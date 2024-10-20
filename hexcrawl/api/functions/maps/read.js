import { getClient } from "#utils/ddb-client.js";

export const handler = async function(event, context) {
	let ddbClient = await getClient();

	if (ddbClient) {
		event.client = true;
	} else {
		event.client = false;
	}

	return event;
};