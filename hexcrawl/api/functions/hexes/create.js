import { getDDBClient } from "#utils/ddb-client.js";
import { PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { CognitoClient } from "#utils/cognito-client.js";
import { mapPermissions } from "#utils/map-permissions.js";

export const handler = async function(event, context) {
	let cognito = new CognitoClient(event);
	let user = await cognito.authorizedUser();
	let ddb = await getDDBClient();

	if (!user) {
		return {
			statusCode: 401,
			body: {}
		};
	}

	let { body, params } = event;
	let mapId = params.map_id;

	if (!body || !mapId) {
		return {
			statusCode: 400,
			body: {
				'error': 'Bad request'
			}
		};
	}

	let permission = await mapPermissions(mapId, user.id);

	if (permission !== 'gm') {
		return {
			statusCode: 404,
			body: {}
		};
	}

	let created = false;
	
	try {
		

		body.created = Date.now();
		body.updated = Date.now();	
		body.subdocument_id = body.id;
		body.id = mapId;

		let createCommand = new PutItemCommand({
			TableName: 'maps',
			Item: marshall(body),
		});

		// Create the hex record
		let response = await ddb.send(createCommand) || {};
		let metadata = response.$metadata || {};
		let statusCode = metadata.httpStatusCode || 400;
		created = statusCode === 200;
	} catch (error) {
		console.log(error);

		let message = 'Could not create hex';
		let metadata = error.$metadata || {};
		let statusCode = metadata.httpStatusCode || 500;

		switch (statusCode) {
			case 400:
				message = 'Invalid hex data';
				break;
		}

		return {
			statusCode: statusCode,
			body: {
				"error": message
			}
		};
	}

	if (created) {
		body.id = body.subdocument_id;
		delete body.subdocument_id;

		try {
			// Record changes for polling by the client
			let change = {
				map_id: body.id,
				change_time: Date.now(),
				type: "hex.created",
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