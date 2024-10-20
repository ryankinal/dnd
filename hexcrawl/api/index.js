import { routes } from "./routes.js";
import { default as express } from 'express';
const app = express();

app.listen(3000, () => {
 	console.log("Server running on port 3000");
});

routes.forEach((definition) => {
	let { path, methods } = definition;

	Object.keys(methods).forEach(async (method) => {
		if (typeof app[method] === 'function') {
			let file = methods[method];

			let controller = await import(file);
			let { handler } = controller;

			if (typeof handler === 'function') {
				app[method](path, async function(req, res, next) {
					let action = {
						body: req.body,
						query: req.query,
						params: req.params
					};

					let response = await handler(action);
					res.json(response || {});
				});
			} else {
				// console.log('Not implemented: ' + method.toUpperCase() + ' ' + path);
			}
		} else {
			console.log('Invalid method: ' + method.toUpperCase() + ' ' + path);
		}
	});

	return true;
});