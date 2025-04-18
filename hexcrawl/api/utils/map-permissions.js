import { getDDBClient } from "#utils/ddb-client.js";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export async function mapPermissions(map, userId) {
	if (typeof map === 'string') {
		let ddb = await getDDBClient();

		let command = new GetItemCommand({
			TableName: 'maps',
			Key: marshall({
				id: map,
				subdocument_id: 'map'
			})
		});

		try {
			let response = await ddb.send(command);
			map = response.Item ? unmarshall(response.Item) : {};
		} catch (e) {

		}
	}

	let { players } = map;

	console.log(map, players);

	if (players && players[userId]) {
		return players[userId];
	}

	return false;
}