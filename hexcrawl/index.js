import { Events } from './events.js';
import { Map } from './map.js';
import { HexSettings } from './hexsettings.js';

let output = document.getElementById('display');

let map = window.map = new Map({
	container: output,
    "background": {
        "image": "barovia-map.jpg",
        "width": 8300.25,
        "height": 5851.25
    },
    "hexes": {
        "6f8ea9ab-c7a6-4322-b3d4-caba5b64c758": {
            "x": -50,
            "y": -43,
            "background": {
                "position": {
                    "x": -7591,
                    "y": -2401
                },
                "image": "barovia-map.jpg",
                "width": 8300.25,
                "height": 5851.25
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