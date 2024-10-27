import { CognitoClient } from '#utils/cognito-client.js';
import { InitiateAuthCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider'

let clientId = process.env.AWS_COGNITO_CLIENT_ID;

export const handler = async function(event, context) {
	let { body } = event || {};
	let { email, password } = body;
	let client = new CognitoClient();
	
	return await client.signIn(email, password);
};