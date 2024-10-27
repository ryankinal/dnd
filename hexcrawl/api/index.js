import { routes } from "./routes.js";
import { default as express } from 'express';
const app = express();

app.listen(3000, () => {
 	console.log("Server running on port 3000");
});
app.use(express.json());

routes.forEach((definition) => {
	let { path, methods } = definition;

	Object.keys(methods).forEach(async (method) => {
		if (typeof app[method] === 'function') {
			let file = methods[method];
			let controller = {};

			try {
				controller = await import(file) || {};
			} catch (e) {
				console.log('Could not import ' + file);
				controller = {};
			}
			
			let { handler } = controller;

			if (typeof handler === 'function') {
				app[method](path, async function(req, res, next) {
					let action = {
						body: req.body,
						query: req.query,
						params: req.params,
						headers: req.headers
					};

					let response = await handler(action);
					res.statusCode = response && response.statusCode || 500;
					res.json(response && response.body || {});
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