import { CognitoClient } from '#utils/cognito-client.js';

export const handler = async function(event, context) {
	let { body } = event || {};
	let { email, password } = body;
	let client = new CognitoClient();
	
	return await client.signIn(email, password);
};