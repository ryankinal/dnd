import { Id } from './id.js';
import { Events } from './events.js';
import { API } from './api.js';
import { HexSettings } from './hexsettings.js';
import { MapSettings } from './mapsettings.js';
import { MapSetup } from './mapsetup.js';
import { visualizers } from './visualizers.js';

// Map setup
let output = document.getElementById('display');
let positioningConfirmButton = document.getElementById('positioningConfirm');

// Global API
window.hexcrawl = {
	events: new Events(),
	visualizers: visualizers
};

new API();

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
new MapSetup({
	mapContainer: output,
	container: mapSetupContainer
});

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

	hexcrawl.map.id = Id.generate();
	toolBelt.classList.remove('hidden');
	hexcrawl.events.pub('map.created', hexcrawl.map);
});