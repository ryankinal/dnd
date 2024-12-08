import { Id } from './id.js';
import { Events } from './events.js';
import { API } from './api.js';
import { HexSettings } from './hexsettings.js';
import { MapSettings } from './mapsettings.js';
import { MapSetup } from './mapsetup.js';
import { Map } from './map.js';

// Map setup
let output = document.getElementById('display');
let positioningConfirmButton = document.getElementById('positioningConfirm');
let pathTokens = window.location.pathname.split(/\//);
let mapId = pathTokens.filter((token) => {
	return token.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
}).pop();

console.log(mapId);

// Global API
window.hexcrawl = {
	events: new Events(),
	hideStack: [],
};

let api = new API();
api.logging = true;

let toolBelt = document.getElementById('toolBelt');
toolBelt.addEventListener('click', (e) => {
	e.stopPropagation();
	return false;
});

// Hex settings controller
let hexSettingsContainer = document.getElementById('hexSettings');
let hexNotesContainer = document.getElementById('hexNotes');
let hexSettings = new HexSettings({
	toolBelt: toolBelt,
	container: hexSettingsContainer,
	notesContainer: hexNotesContainer
});

// Map settings controller
let mapSettingsContainer = document.getElementById('mapSettings');
let mapSettings = new MapSettings({
	toolBelt: toolBelt,
	container: mapSettingsContainer
});

let mapSetupContainer = document.getElementById('mapSetup');
let mapSetup = new MapSetup({
	mapContainer: output,
	container: mapSetupContainer
});

document.body.addEventListener('click', (e) => {
	if (hexcrawl.hideStack.length) {
		let toHide = hexcrawl.hideStack.pop();
		let element = toHide.element;
		let func = toHide.f;

		if (element instanceof HTMLElement) {
			if (typeof func === 'function') {
				func(element);
			} else {
				element.classList.add('hidden');
			}
		} else if (typeof func === 'function') {
			func();
		}
	}
});

if (mapId) {
	let mapData = await api.getMap(mapId) || {};
	let body = mapData.body || {};
	let map = body.data;

	if (map) {
		let from = null;

		map.container = output;
		map.hexes = map.hexes || {};

		do {
			let hexData = await api.getHexes(mapId, from);
			let body = hexData.body || {};
			let hexes = body.data || [];
			let next = body.next || {};
			from = next.from;

			hexes.forEach((hex) => {
				map.hexes[hex.id] = hex;
			});

			// Maybe do some loading animation stuff?
		} while (from);

		map = new Map(map);
		map.render(output);

		hexSettings.map = map;
		mapSettings.map = map;
		hexcrawl.map = map;

		map.panEnabled = true;
		map.allowHexSelection = true;
		map.triggerEvents = true;

		positioningConfirmButton.style.display = 'none';
		toolBelt.classList.remove('hidden');

		mapSetup.cancel();
	} else {
		window.location = '/app/';
	}
} else {
	window.hexcrawl.events.sub('map.new', (map) => {
		output.innerHTML = '';
		map.positioningConfirmButton = positioningConfirmButton;
		hexSettings.map = map;
		mapSettings.map = map;
		hexcrawl.map = map
		map.render(output);
		mapSettings.toggleGMView(1);
		positioningConfirmButton.style.display = 'flex';
	});
	
	let confirmPositioning = function() {
		mapSettings.toggleGMView();
		
		hexcrawl.map.panEnabled = true;
		hexcrawl.map.allowBackgroundAdjust = false;
		hexcrawl.map.allowHexSelection = true;
		hexcrawl.map.transform.scale = 1;
	
		Object.values(hexcrawl.map.hexes).forEach((hex) => {
			hex.renderIcons();
		});
	
		hexcrawl.map.applyTransform(true);
	
		hexcrawl.map.id = Id.generate();
		hexcrawl.events.pub('map.created', hexcrawl.map);
	
		positioningConfirmButton.style.display = 'none';
		toolBelt.classList.remove('hidden');
	};
	
	positioningConfirmButton.addEventListener('click', confirmPositioning);
	positioningConfirmButton.addEventListener('touchstart', confirmPositioning);
}
