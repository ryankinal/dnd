import { getDDBClient } from "#utils/ddb-client.js";
import { UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { CognitoClient } from "#utils/cognito-client.js";

export const handler = async function(event, context) {
	let cognito = new CognitoClient(event);
	let user = await cognito.authorizedUser();

	if (!user) {
		return {
			statusCode: 401,
			body: {}
		};
	}

	let { body, params } = event;
	let { map_id } = params;
	let ddb = await getDDBClient();
	let updated = false;
	
	if (body && map_id) {
		try {
			let mapRecord = Object.assign({}, body);

			// Don't want to update hexes or id with this call
			delete mapRecord.hexes;
			delete mapRecord.id;
			delete mapRecord.created

			mapRecord.last_updated = Date.now();

			let sets = [];
			let names = {};
			let values = {};

			Object.keys(mapRecord).forEach((key) => {
				let namePlaceholder = '#' + key;
				let valuePlaceholder = ':' + key;

				names[namePlaceholder] = key;
				values[valuePlaceholder] = mapRecord[key];
				sets.push(namePlaceholder + ' = ' + valuePlaceholder);
			});

			if (sets.length) {
				let command = new UpdateItemCommand({
					TableName: 'maps',
					Key: marshall({
						'id': map_id,
						'subdocument_id': 'map'
					}),
					ExpressionAttributeNames: names,
					ExpressionAttributeValues: marshall(values),
					UpdateExpression: 'SET ' + sets.join(', ')
				});

				let response = await ddb.send(command);
				let metadata = response.$metadata || {};
				let statusCode = metadata.httpStatusCode || 400;
				updated = statusCode === 200;	
			}
		} catch (error) {
			console.log(error);

			let message = 'Could not update map';
			let metadata = error.$metadata || {};
			let statusCode = metadata.httpStatusCode || 500;

			switch (statusCode) {
				case 400:
					message = 'Invalid map data';
					break;
			}

			return {
				statusCode: statusCode,
				body: {
					"details": error,
					"error": message
				}
			};
		}

		if (updated) {
			try {
				// Record changes for polling by the client
				let change = {
					map_id: map_id,
					user_id: user.id,
					change_time: Date.now(),
					type: "map.updated",
					data: body
				};
				
				let putChangeCommand = new PutItemCommand({
					TableName: 'map_changes',
					Item: marshall(change)
				});
		
				ddb.send(putChangeCommand);
			} catch (e) {
				// This just means that the changes will be missed
				// by other clients - might break things
				console.log(e);
			}
			
			return {
				statusCode: 201,
				body: {
					data: body
				}
			};
		}
	} else {
		return {
			statusCode: 400,
			body: {
				error: 'Invalid map data'
			}
		};	
	}

	return {
		statusCode: 400,
		body: {
			error: 'Could not update map'
		}
	};
};