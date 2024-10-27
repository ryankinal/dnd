import { getDDBClient } from "#utils/ddb-client.js";
import { PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

export const handler = async function(event, context) {
	let body = event.body;
	let params = event.params;
	let id = body && body.id || params && params.map_id;

	if (id && body) {
		let ddb = await getDDBClient();

		if (!id) {
			body.id = randomUUID();
			body.created = Date.now();
		}

		body.updated = Date.now();
		
		try {
			let putCommand = new PutItemCommand({
				TableName: 'maps',
				Item: marshall(body),
				ConditionExpression: 'attribute_not_exists(id)'
			});

			let response = await ddb.send(putCommand);

			return {
				statusCode: 201,
				body: body
			};
		} catch (error) {
			let errorBody = 'Could not create map';
			let metadata = error.$metadata || {};
			let statusCode = metadata.httpStatusCode || 500;

			switch (statusCode) {
				case 400:
					errorBody = 'Invalid map data';
					break;
				default:
					errorBody = 'Could not create map';
			}

			return {
				statusCode: statusCode,
				body: {
					"error": errorBody
				}
			};
		}
	}

	return {
		statusCode: 400,
		errorBody: 'Invalid map data'
	}
};