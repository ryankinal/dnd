import { Events } from './events.js';
import { Map } from './map.js';
import { HexSettings } from './hexsettings.js';
import { MapSettings } from './mapsettings.js';
import { MapSetup } from './mapsetup.js';

// Map setup
let output = document.getElementById('display');
let positioningConfirmButton = document.getElementById('positioningConfirm');

// Temp saved data for dev purposes
let mapData = {
	container: output,
	"background": {
		"image": "barovia-map.jpg",
		"width": 8300.25,
		"height": 5851.25,
		"x": -7591,
		"y": -2401
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
};

let map = new Map();

// Global API
window.hexcrawl = {
	events: new Events(),
	map: map,
	removeVisualizers: function() {
		document.querySelectorAll('.visualizer').forEach((div) => div.parentNode.removeChild(div));
	}
};

// Hex settings controller
let hexSettingsContainer = document.getElementById('hexSettings');
let hexNotesContainer = document.getElementById('hexNotes');
let hexSettings = new HexSettings({
	map: map,
	container: hexSettingsContainer,
	notesContainer: hexNotesContainer
});

// Map settings controller
let mapSettingsContainer = document.getElementById('mapSettings');
let mapSettings = new MapSettings({
	map: map,
	container: mapSettingsContainer
});

let mapSetupContainer = document.getElementById('mapSetup');
new MapSetup({
	mapContainer: output,
	container: mapSetupContainer
});

window.hexcrawl.events.sub('map.new', (map) => {
	output.innerHTML = '';
	hexSettings.map = map;
	mapSettings.map = map;
	hexcrawl.map = map
	map.render(output);
	mapSettings.toggleGMView(1);
	positioningConfirmButton.style.display = 'block';
});

positioningConfirmButton.addEventListener('click', () => {
	mapSettings.toggleGMView();
	mapSettings.show();

	hexSettings.hide();

	hexcrawl.map.panEnabled = true;
	hexcrawl.map.allowBackgroundAdjust = false;
	hexcrawl.map.allowHexSelection = true;
	hexcrawl.map.transform.scale = 1;
	hexcrawl.map.applyTransform(true);

	positioningConfirmButton.style.display = 'none';
});

// Render
// map.render(output);