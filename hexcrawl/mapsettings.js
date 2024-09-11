import { Map } from './map.js';

export class MapSettings {
	constructor(data) {
		this.adjustBackground = false;
		this.adjustingBackgroundPosition = false;
		this.positioningAccept = document.getElementById('positioningAccept');
		
		this.map = null;
		this.container = null;
		this.events = null;

		if (data) {
			if (data.map instanceof Map) {
				this.map = data.map;
			}

			if (data.container instanceof HTMLElement) {
				this.container = data.container;
			}
		}

		if (!this.map instanceof Map) {
			throw new Exception('map is required for hex settings interface');
		}
		
		if (!this.container instanceof HTMLDivElement) {
			throw new Exception('container is required for hex settings interface');
		}

		this.buttons = {
			gmView: this.container.querySelector('.gm-view-button'),
			map: this.container.querySelector('.map-button'),
			notes: this.container.querySelector('.notes-button')
		};

		this.wireEvents();
	}

	hide() {
		this.container.classList.add('hidden');
	}

	show() {
		this.container.classList.remove('hidden');
	}
	
	changeMap(map) {
		this.map = map;
		
		if (this.map.container.matches('.gm-view')) {
			this.map.container.classList.remove('gm-view');
		} else {
			this.map.container.classList.add('gm-view');
		}
	}

	toggleGMView(onOff) {
		if (onOff === 1 || onOff === 0) {
			if (onOff === 1) {
				this.map.container.classList.add('gm-view');
			} else {
				this.map.container.classList.remove('gm-view');
			}
		} else {
			if (this.map.container.matches('.gm-view')) {
				this.map.container.classList.remove('gm-view');
			} else {
				this.map.container.classList.add('gm-view');
			}
		}
	}

	wireEvents() {
		let self = this;
		let selectionTimeout = null;

		window.hexcrawl.events.sub('map.new', (map) => {
			map.allowBackgroundAdjust = true;
			this.map = map;
			self.container.classList.add('hidden');
		});

		if (this.buttons.gmView) {
			this.buttons.gmView.addEventListener('click', () => {
				self.toggleGMView();
			});
		}
		
		window.hexcrawl.events.sub('hex.selected', () => {
			clearTimeout(selectionTimeout);
			self.container.classList.add('hidden');
		});

		window.hexcrawl.events.sub('hex.unselected', () => {
			selectionTimeout = setTimeout(() => {
				self.container.classList.remove('hidden');
			}, 50);
		});
	}
}