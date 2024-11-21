import { getDDBClient } from "#utils/ddb-client.js";
import { mapPermissions } from "#utils/map-permissions.js";
import { BatchWriteItemCommand, DeleteItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { CognitoClient } from "#utils/cognito-client.js";

async function removeMapFromUsers(mapId, users) {
	let ddb = await getDDBClient();

	let batchCommands = users.map((userId) => {
		return {
			DeleteRequest: {
				Key: marshall({
					map_id: mapId,
					user_id: userId
				})
			}
		}
	});

	let batchCommand = new BatchWriteItemCommand({
		RequestItems: {
			user_maps: batchCommands
		}
	})

	ddb.send(batchCommand);
}

async function deleteHexes(mapId) {
	let ddb = await getDDBClient();
	let lastKey = null;

	do {
		let commandConfig = {
			TableName: 'maps',
			KeyConditionExpression: '#m = :id',
			ExpressionAttributeValues: marshall({
				':id': mapId
			}),
			Limit: 100,
			ExpressionAttributeNames: {
				'#m': 'id'
			}
		};

		if (lastKey) {
			commandConfig.ExclusiveStartKey = lastKey;
		}

		let response = await ddb.send(new QueryCommand(commandConfig));
		let items = response.Items || [];

		console.log(items);

		lastKey = response.LastEvaluatedKey;

		if (items.length) {
			let batchCommandConfig = items.map((item) => {
				item = unmarshall(item);

				let obj = {
					DeleteRequest: {
						Key: marshall({
							id: mapId,
							subdocument_id: item.subdocument_id
						})
					}
				};

				console.log(JSON.stringify(obj));

				return obj;
			});

			console.log(batchCommandConfig);

			let batchCommand = new BatchWriteItemCommand({
				RequestItems: {
					maps: batchCommandConfig
				}
			});

			ddb.send(batchCommand)
		}
	} while (lastKey);
}

export const handler = async function(event, context) {
	let cognito = new CognitoClient(event);
	let user = await cognito.authorizedUser();

	if (!user) {
		return {
			statusCode: 401,
			body: {}
		};
	}

	let params = event.params || {};
	let id = params.map_id;

	if (id) {
		let ddb = await getDDBClient();

		try {
			let permission = await mapPermissions(id, user.id);

			if (permission === 'gm') {
				let users = Object.keys(map.gms);

				if (map.players) {
					users.splice(0, 0, Object.keys(maps.players));
				}

				let deleteCommand = new DeleteItemCommand({
					TableName: 'maps',
					Key: marshall({
						id: id,
						subdocument_id: 'map'
					})
				});
			
				let deleteResponse = await ddb.send(deleteCommand);
				let meta = deleteResponse.$metadata || {};
				let statusCode = meta.httpStatusCode;

				if (statusCode === 200) {
					// Don't bother waiting for these async functions
					removeMapFromUsers(map.id, users)
					deleteHexes(id);
				}
				
				return {
					statusCode: statusCode,
					body: {}
				};
			}

			return {
				statusCode: 404,
				body: {}
			}
		} catch (e) {
			console.log(e);

			return {
				statusCode: 400,
				body: {
					detail: e,
					error: e.message
				}
			};
		}
	}
	
	return event;
};