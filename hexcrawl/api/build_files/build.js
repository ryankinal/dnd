import { packageConfig } from "./packageConfig.js";
import { routes } from "../routes.js";
import * as fs from 'fs';

routes.forEach((route) => {
	let { functionSuffix, methods } = route;

	console.log(methods);

	if (methods) {
		Object.keys(methods).forEach((method) => {
			let { file } = methods[method];
			let routeConfig = Object.assign({}, packageConfig);
			let functionName = method + functionSuffix;
			let configName = routeConfig.name + '-' + functionName;
			let dir = './output/' + configName;
			
			file = '.' + file;
			routeConfig.name = configName;

			console.log(routeConfig);

			if (fs.existsSync(file))
			{
				fs.mkdir(dir, () => {
					fs.copyFile(file, dir + '/index.mjs', () => {});
					fs.writeFile(dir + '/package.json', JSON.stringify(routeConfig, null, 4), () => {});
					fs.cp('../utils', dir + '/utils', { recursive: true }, () => {});
					fs.cp('../node_modules', dir + '/node_modules', { recursive: true }, () => {});
				});
			}
			
			return false;
		});
	}

	return false;
});