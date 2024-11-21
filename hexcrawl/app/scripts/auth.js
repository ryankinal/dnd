export function authenticate(username, password) {
	AWS.config.region = 'us-west-2';
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-west-2_iUmV9VZmy'
	});
}