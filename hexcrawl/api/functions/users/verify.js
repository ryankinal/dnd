import { CognitoClient } from "#utils/cognito-client.js";

export const handler = async function(event, context) {
	let { body } = event || {};
	let { email, code } = body;

	let client = new CognitoClient();
	return await client.confirm(email, code);
};