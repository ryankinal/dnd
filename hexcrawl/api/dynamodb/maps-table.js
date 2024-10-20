import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { getParameter } from "#utils/stored-parameters.js";

const environment = process.env.ENVIRONMENT || 'prod';
let parameterName = '/hexcrawl/' + environment + '/db/server';
let server = await getParameter(parameterName);

const tableName = 'maps';

const keySchema = [
	{
		AttributeName: 'map_id',
		KeyType: "HASH"
	}
];

const attributeSchema = [
	{
		AttributeName: "map_id",
		AttributeType: "S"
	}
];

const client = new DynamoDBClient({
	region: 'us-west-2',
	endpoint: 'http://' + server + ':8000',
	credentials: {
		accessKeyId: 'fuck',
		secretAccessKey: 'you'
	}
});
const command = new CreateTableCommand({
	TableName: tableName,
	KeySchema: keySchema,
	AttributeDefinitions: attributeSchema,
	ProvisionedThroughput: {
		"ReadCapacityUnits": 8,
		"WriteCapacityUnits": 8
	}
});

client.send(command);