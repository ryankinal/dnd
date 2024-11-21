import { getDDBClient } from "#utils/ddb-client.js";
import { CognitoClient } from "#utils/cognito-client.js";
import { mapPermissions } from "#utils/map-permissions.js";
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";

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
	let query = event.query || {};
	let id = params.map_id;
	let start = query.start;
	let now = Date.now();

	if (id && start) {
		if (true || start >= now - 11000) {
			let permission = await mapPermissions(id, user.id);

			if (!permission) {
				return {
					statusCode: 404,
					body: {}
				};
			}

			let ddb = await getDDBClient();

			let changesCommand = new QueryCommand({
				TableName: 'map_changes',
				KeyConditionExpression: '#m = :map AND #t >= :t',
				ExpressionAttributeValues: {
					':map': {
						S: id
					},
					':t': {
						N: start
					}
				},
				Limit: 1000,
				ExpressionAttributeNames: {
					'#m': 'map_id',
					'#t': 'change_time'
				}
			});

			try {
				let response = await ddb.send(changesCommand);
				let lastKey = response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : {};
				let result =  {
					statusCode: response.Items ? 200 : 404,
					body: {
						data: response.Items ? response.Items.map(unmarshall) : []
					}
				};

				if (lastKey) {
					result.body.lastChangeTime = lastKey.change_time || Date.now();
				}

				return result;
			} catch (e) {
				console.log(e);

				return {
					statusCode: 400,
					body: {
						error: e.message
					}
				};
			}
		} else {
			return {
				statusCode: 400,
				body: {
					error: 'Polling time must be within 10 seconds of server time'
				}
			};
		}
	} else {
		return {
			statusCode: 400,
			body: {
				error: 'Missing required parameter'
			}
		}
	}
};