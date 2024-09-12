import { Id } from './id.js';
import { Events } from './events.js';
import { API } from './api.js';
import { HexSettings } from './hexsettings.js';
import { MapSettings } from './mapsettings.js';
import { MapSetup } from './mapsetup.js';
import { visualizer } from './visualizers.js';

// Map setup
let output = document.getElementById('display');
let positioningConfirmButton = document.getElementById('positioningConfirm');

// Global API
window.hexcrawl = {
	events: new Events(),
	visualizer: visualizer
};

new API();

// Hex settings controller
let hexSettingsContainer = document.getElementById('hexSettings');
let hexNotesContainer = document.getElementById('hexNotes');
let hexSettings = new HexSettings({
	container: hexSettingsContainer,
	notesContainer: hexNotesContainer
});

// Map settings controller
let mapSettingsContainer = document.getElementById('mapSettings');
let mapSettings = new MapSettings({
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
	hexcrawl.events.pub('map.created', hexcrawl.map);
});