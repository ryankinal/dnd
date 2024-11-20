import { getDDBClient } from "#utils/ddb-client.js";
import { CognitoClient } from "#utils/cognito-client.js";
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

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
		let ddb = await getDDBClient();

		let mapsCommand = new QueryCommand({
			TableName: 'user_maps',
			KeyConditionExpression: '#u = :user_id',
			ExpressionAttributeNames: {
				'#u': 'user_id'
			},
			ExpressionAttributeValues: marshall({
				':user_id': user.id
			}),
			ProjectionExpression: 'map_id, map_name'
		});

		try {
			let response = await ddb.send(mapsCommand);
			let mapData = [];

			if (response.Items) {
				mapData = response.Items.map((item) => {
					item = unmarshall(item);

					return {
						id: item.map_id,
						name: item.map_name
					};
				});
			}

			return {
				statusCode: 200,
				body: {
					data: mapData
				}
			};			
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
};