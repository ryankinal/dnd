import { CognitoClient } from '#utils/cognito-client.js';

export const handler = async function(event, context) {
	let { body } = event || {};
	let { id, token } = body;

	let client = new CognitoClient();

	let response = await client.refreshAuth(id, token);
	let responseBody = response.body;
	let authResult = responseBody.AuthenticationResult || {};
	let accessToken = authResult.AccessToken;
	let expiresIn = authResult.ExpiresIn;

	return {
		statusCode: 200,
		body: {
			accessToken: accessToken,
			expiresIn: expiresIn
		}
	};

	return 
};