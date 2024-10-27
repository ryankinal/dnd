import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getParameter } from "#utils/stored-parameters.js";

const environment = process.env.ENVIRONMENT || 'prod';
let serverParameterName = '/hexcrawl/' + environment + '/db/server';

export const getDDBClient = async function() {
	let server = await getParameter(serverParameterName);
	let config = {
		region: 'us-west-2',
		endpoint: 'http://' + server + ':8000',
	};

	if (environment === 'dev') {
		config.credentials = {
			accessKeyId: 'fuck',
			secretAccessKey: 'you'
		};
	}

	const client = new DynamoDBClient(config);

	return client;
};