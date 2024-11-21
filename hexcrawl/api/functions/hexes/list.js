import { getDDBClient } from "#utils/ddb-client.js";
import { CognitoClient } from "#utils/cognito-client.js";
import { mapPermissions } from "#utils/map-permissions.js";
import { QueryCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

export const handler = async function(event, context) {
	let cognito = new CognitoClient(event);
	let user = await cognito.authorizedUser();

	if (!user) {
		return {
			statusCode: 401,
			body: {}
		};
	}

	if (user.id) {
		let params = event.params || {};
		let query = event.query || {};
		let id = params.map_id;
		let { limit, from } = query;

		if (id) {
			let ddb = await getDDBClient();
			let mapPermissions = await mapPermissions(id, user.id)
			
			if (!mapPermissions) {
				return {
					statusCode: 404,
					body: {}
				};
			}
			
			let commandConfig = {
				TableName: 'maps',
				KeyConditionExpression: '#m = :id',
				ExpressionAttributeValues: marshall({
					':id': id
				}),
				Limit: limit || 100,
				ExpressionAttributeNames: {
					'#m': 'id'
				}
			};

			if (from) {
				commandConfig.ExclusiveStartKey = marshall({
					'id': id,
					'subdocument_id': from
				});
			}

			let hexesCommand = new QueryCommand(commandConfig);

			try {
				let response = await ddb.send(hexesCommand);
				let hexData = response.Items;
				let lastKey = response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : {};

				if (Array.isArray(hexData)) {
					hexData = hexData.map(unmarshall)
						.filter((i) => i.subdocument_id !== 'map')
						.map((i) => {
							delete i.subdocument_id;
							return i;
						});
				}

				let result = {
					statusCode: 200,
					body: {
						data: hexData || {},
					}
				};

				if (lastKey && lastKey.subdocument_id) {
					result.body.next = '/maps/' + id + '/hexes?from=' + lastKey.subdocument_id;
				}

				return result;
			} catch (e) {
				console.log('Caught error');
				console.log(e);

				return {
					statusCode: 400,
					body: {
						error: e.message
					}
				};
			}
		}
	}

	return {
		statusCode: 400,
		body: {
			error: ''
		}
	};
};