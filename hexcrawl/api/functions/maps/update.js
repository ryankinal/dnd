import { getDDBClient } from "#utils/ddb-client.js";
import { UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { CognitoClient } from "#utils/cognito-client.js";
import { mapPermissions } from "#utils/map-permissions.js";

export const handler = async function(event, context) {
	let { body, params } = event;
	let { map_id } = params;
	let ddb = await getDDBClient();
	let updated = false;
	
	if (body && map_id) {
		try {
			let cognito = new CognitoClient(event);
			let user = await cognito.authorizedUser();	
			let mapRecord = Object.assign({}, body);
			let permission = user ? await mapPermissions(map_id, user.id) : false;

			if (permission !== 'gm') {
				return {
					statusCode: 404,
					body: {}
				};
			}

			// Don't want to update these fields
			// make sure they're unset so we skip them
			delete mapRecord.hexes;
			delete mapRecord.id;
			delete mapRecord.created
			delete mapRecord.gms;
			delete mapRecord.players;

			mapRecord.updated = Date.now();

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

			names['#user_id'] = user.id;

			if (sets.length) {
				let command = new UpdateItemCommand({
					TableName: 'maps',
					Key: marshall({
						'id': map_id,
						'subdocument_id': 'map'
					}),
					ConditionExpression: 'attribute_exists(gms.#user_id)',
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

			switch (error.name) {
				case 'ConditionalCheckFailedException':
					statusCode = 404;
					message = 'Not found';
					break;
			}
			
			return {
				statusCode: statusCode,
				body: {
					"error": message
				}
			};
		}

		if (updated) {
			try {
				if (user) {
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
				}
			} catch (e) {
				// This just means that the changes will be missed
				// by other clients - might break things
				console.log(e);
			}
			
			return {
				statusCode: 200,
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