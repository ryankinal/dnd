import { Events } from './events.js';
import { Map } from './map.js';
import { HexSettings } from './hexsettings.js';

let output = document.getElementById('display');

let map = window.map = new Map({
	background: {
		image: 'barovia-map.jpg',
		width: 8300.25,
		height: 5851.25
	},
	container: output,
	start: {
		background: {
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