import { getDDBClient } from "#utils/ddb-client.js";
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async function(event, context) {
	let params = event.params || {};
	let id = params.map_id;

	if (id) {
		let ddb = await getDDBClient();

		let command = new GetItemCommand({
			TableName: 'maps',
			Key: {
				id: {
					S: id
				}
			}
		})

		let response = await ddb.send(command);

		return {
			statusCode: response.Item ? 200 : 404,
			body: unmarshall(response.Item) || {
				error: 'Map not found'
			}
		};
	}
	
	return event;
};