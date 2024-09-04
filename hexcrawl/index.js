import { Events } from './events.js';
import { Map } from './map.js';
import { HexSettings } from './hexsettings.js';

let scale = 1.55;
let output = document.getElementById('display');

let map = window.map = new Map({
	image: 'barovia-map.jpg',
	imageScale: scale,
	container: output,
	start: {
		background: {
			scale: scale,
			position: {
				x: -7591,
				y: -2401
			}
		}
	}
});

window.hexcrawl = {
	events: new Events(),
	map: map,
	removeVisualizers: function() {
		document.querySelectorAll('.visualizer').forEach((div) => div.parentNode.removeChild(div));
	}
};

let hexSettingsContainer = document.getElementById('hexSettings');

new HexSettings({
	map: map,
	container: hexSettingsContainer
});

map.render();