import { getDDBClient } from "#utils/ddb-client.js";
import { CognitoClient } from "#utils/cognito-client.js";
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { mapPermissions } from "#utils/map-permissions.js";

export const handler = async function(event, context) {
	let cognito = new CognitoClient(event);
	let user = await cognito.authorizedUser();

	let params = event.params || {};
	let id = params.map_id;

	if (id && user && user.id) {
		let ddb = await getDDBClient();

		let command = new GetItemCommand({
			TableName: 'maps',
			Key: marshall({
				id: id,
				subdocument_id: 'map'
			})
		});

		try {
			let response = await ddb.send(command);

			let map = response.Item ? unmarshall(response.Item) : {};
			let permission = await mapPermissions(map, user.id);
			
			if (permission) {
				delete map.subdocument_id;
				
				return {
					statusCode: 200,
					body: {
						data: map
					}
				};
			}

			return {
				statusCode: 404,
				body: {}
			};
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