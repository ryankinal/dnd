import { CognitoClient } from '#utils/cognito-client.js';

export const handler = async function(event, context) {
	let { headers, params } = event || {};
	let { authorization } = headers || {};
	let { user_id } = params;

	authorization = authorization.replace(/^Bearer /, '');

	if (user_id === 'me') {
		let client = new CognitoClient();
		return await client.getUser(authorization);
	} else {
		return {
			statusCode: 401,
			body: {}
		};
	}
};