import { getCredentials } from '#utils/aws-credentials.js';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export const getParameter = async function(name) {
	let ssmConfig = {
		region: 'us-west-2'
	};

	let credentials = await getCredentials();

	if (credentials) {
		ssmConfig.credentials = credentials;
	}

	const ssmClient = new SSMClient(ssmConfig);
	
	let command = new GetParameterCommand({ Name: name });
	let response = await ssmClient.send(command);
	
	if (response && response.Parameter) {
		return response.Parameter.Value;
	}

	return null;
};