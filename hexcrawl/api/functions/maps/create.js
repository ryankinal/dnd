import { getDDBClient } from "#utils/ddb-client.js";
import { PutItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";
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

	let { body } = event;
	let { hexes } = body;
	let ddb = await getDDBClient();

	body.id = randomUUID();
	body.created = Date.now();
	body.updated = Date.now();

	body.players = {};
	body.players[user.id] = 'gm';
	
	let created = false;
	
	try {
		// Create the base map record
		let transactionItems = [];
		let mapRecord = Object.assign({}, body);
		mapRecord.subdocument_id = 'map';
		delete mapRecord.hexes;

		transactionItems.push({
			Put: {
				TableName: 'maps',
				Item: marshall(mapRecord),
				ConditionExpression: 'attribute_not_exists(id)'
			}
		});

		// Create any hexes included
		Object.keys(hexes || {}).forEach(async (key) => {
			let hex = hexes[key];
			hex.created = Date.now();
			hex.updated = Date.now();

			let hexRecord = Object.assign({}, hex);
			hexRecord.id = mapRecord.id;
			hexRecord.subdocument_id = key;

			transactionItems.push({
				Put: {
					TableName: 'maps',
					Item: marshall(hexRecord)
				}
			});
		});

		transactionItems.push({
			Put: {
				TableName: 'user_maps',
				Item: marshall({
					user_id: user.id,
					map_id: mapRecord.id,
					map_name: mapRecord.name,
					created: Date.now()
				})
			}
		})

		let transaction = new TransactWriteItemsCommand({
			TransactItems: transactionItems
		});

		let response = await ddb.send(transaction);
		let metadata = response.$metadata || {};
		let statusCode = metadata.httpStatusCode || 400;
		created = statusCode === 200;
	} catch (error) {
		console.log(error);

		let message = 'Could not create map';
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

	if (created) {
		try {
			// Record changes for polling by the client
			let change = {
				map_id: body.id,
				change_time: Date.now(),
				type: "map.created",
				data: body
			};
			
			let putChangeCommand = new PutItemCommand({
				TableName: 'map_changes',
				Item: marshall(change)
			});
	
			await ddb.send(putChangeCommand);
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

	return {
		statusCode: 400,
		body: {
			error: 'Could not create map'
		}
	};
};