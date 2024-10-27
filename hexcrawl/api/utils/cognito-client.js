import { createHmac } from 'crypto';
import {
	AuthFlowType,
	CognitoIdentityProviderClient,
	ConfirmSignUpCommand,
	GetUserCommand,
	InitiateAuthCommand,
	RevokeTokenCommand,
	ResendConfirmationCodeCommand,
	SignUpCommand,
	
} from "@aws-sdk/client-cognito-identity-provider";

import {
	GetOpenIdTokenCommand
} from '@aws-sdk/client-cognito-identity'

let clientId = process.env.AWS_COGNITO_CLIENT_ID;
let clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;

export class CognitoClient {
	async getClient() {
		if (!this.client) {
			this.client = new CognitoIdentityProviderClient({
				region: 'us-west-2'
			});
		}
		
		return this.client;
	}

	getClientSecret(secretHashUpdates) {
		let hasher = createHmac('sha256', clientSecret);

		if (secretHashUpdates) {
			hasher.update(secretHashUpdates);
		}

		return hasher.digest('base64');;
	}

	async signUp(email, password) {
		let cognito = await this.getClient();
		let command = new SignUpCommand({
			ClientId: clientId,
			SecretHash: this.getClientSecret(`${email}${clientId}`),
			Username: email,
			Password: password,
			UserAttributes: [{Name: 'email', Value: email}]
		});

		try {
			let response = await cognito.send(command);
	
			return {
				statusCode: 201,
				body: {
					id: response.UserSub
				}
			};
		} catch (e) {
			let message = e.message || 'There was a problem with signup';
	
			return {
				statusCode: 400,
				body: {
					error: message
				}
			};
		}
	}

	async confirm(email, code) {
		let cognito = await this.getClient();
		let command = new ConfirmSignUpCommand({
			ClientId: clientId,
			SecretHash: this.getClientSecret(`${email}${clientId}`),
			Username: email,
			ConfirmationCode: code
		});

		try {
			let response = await cognito.send(command);
	
			return {
				statusCode: 201,
				body: {
					id: response.UserSub
				}
			};
		} catch (e) {
			let message = e.message || 'There was a problem with verification';
	
			return {
				statusCode: 400,
				body: {
					error: message
				}
			};
		}
	}

	async resendCode(email) {
		let cognito = await this.getClient();
		let command = new ResendConfirmationCodeCommand({
			ClientId: clientId,
			SecretHash: this.getClientSecret(`${email}${clientId}`),
			Username: email
		});

		try {
			let response = await cognito.send(command);
	
			return {
				statusCode: 200,
				body: {
					id: response.UserSub
				}
			};
		} catch (e) {
			let message = e.message || 'There was a problem with verification';
	
			return {
				statusCode: 400,
				body: {
					error: message
				}
			};
		}
	}

	async signIn(email, password) {
		let cognito = await this.getClient();
		let secretHash = this.getClientSecret(`${email}${clientId}`);

		let command = new InitiateAuthCommand({
			ClientId: clientId,
			SecretHash: secretHash,
			AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
			AuthParameters: {
				SECRET_HASH: secretHash,
				USERNAME: email,
				PASSWORD: password
			}
		});

		try {
			let response = await cognito.send(command);
	
			return {
				statusCode: 200,
				body: response
			};
		} catch (e) {
			let message = e.message || 'There was a problem with sign in';
	
			return {
				statusCode: 400,
				body: {
					error: message
				}
			};
		}
	}

	async getUser(token) {
		let cognito = await this.getClient();
		let command = new GetUserCommand({
			AccessToken: token
		});

		try {
			let response = await cognito.send(command);
			let { UserAttributes } = response;
			let user = {};
			
			UserAttributes.forEach((attribute) => {
				let { Name, Value } = attribute;

				if (Name === 'sub') {
					Name = 'id';
				}

				user[Name.toLocaleLowerCase()] = Value;
			})
	
			return {
				statusCode: 200,
				body: user
			};
		} catch (e) {
			let message = e.message;
	
			return {
				statusCode: 401,
				body: {
					error: message
				}
			};
		}
	}

	async refreshAuth(id, refreshToken) {
		let cognito = await this.getClient();
		let secretHash = this.getClientSecret(`${id}${clientId}`);

		let command = new InitiateAuthCommand({
			ClientId: clientId,
			AuthFlow: AuthFlowType.REFRESH_TOKEN,
			AuthParameters: {
				SECRET_HASH: secretHash,
				REFRESH_TOKEN: refreshToken
			}
		});

		try {
			let response = await cognito.send(command);
	
			return {
				statusCode: 200,
				body: response
			};
		} catch (e) {
			let message = e.message || 'There was a problem with sign in';
	
			return {
				statusCode: 400,
				body: {
					error: message
				}
			};
		}
	}

	async signOut(token) {
		let cognito = await this.getClient();
		let command = new RevokeTokenCommand({
			AccessToken: token
		});

		try {
			await cognito.send(command);
	
			return {
				statusCode: 204,
				body: {}
			};
		} catch (e) {
			let message = e.message;
	
			return {
				statusCode: 401,
				body: {
					error: message
				}
			};
		}
	}
}