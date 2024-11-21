import { CognitoClient } from '#utils/cognito-client.js';

export const handler = async function(event, context) {
	let { body } = event || {};
	let { email, password } = body;
	
	let client = new CognitoClient();
	let response = await client.signIn(email, password);
	let responseBody = response.body;
	let authResult = responseBody.AuthenticationResult || {};
	let accessToken = authResult.AccessToken;
	let refreshToken = authResult.RefreshToken;
	let expiresIn = authResult.ExpiresIn;

	return {
		statusCode: 200,
		body: {
			accessToken: accessToken,
			refreshToken: refreshToken,
			expiresIn: expiresIn
		}
	};
};