import { fromIni } from '@aws-sdk/credential-providers';

const environment = process.env.ENVIRONMENT || 'prod';
const credentialsFile = process.env.AWS_CREDENTIALS_FILE;

export const getCredentials = async function() {
	if (environment == 'dev') {
		let credentials = await fromIni({
			filepath: credentialsFile
		});

		return await credentials();
	}

	return null;
};