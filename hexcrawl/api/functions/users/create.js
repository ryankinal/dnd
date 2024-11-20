import { CognitoClient } from '#utils/cognito-client.js';
import { getDDBClient } from '#utils/ddb-client.js';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

export const handler = async function(event, context) {
	let { body } = event || {};
	let { email, password } = body;
	let ddb = await getDDBClient();
	let client = new CognitoClient();
	
	let response = await client.signUp(email, password);
	let user = response.body || {};
	let id = user.id;

	let putCommand = PutItemCommand({
		TableName: 'users',
		Item: marshall({
			id: user.id,
			maps: {}
		})
	});

	ddb.send(putCommand);
	return response;
};