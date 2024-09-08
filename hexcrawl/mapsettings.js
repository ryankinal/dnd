import { Map } from './map.js';

export class MapSettings {
	constructor(data) {
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

	wireEvents() {
		let self = this;
		let selectionTimeout = null;

		if (this.buttons.gmView && this.map.container instanceof HTMLElement) {
			this.buttons.gmView.addEventListener('click', () => {
				if (this.map.container.matches('.gm-view')) {
					self.map.container.classList.remove('gm-view');
				} else {
					self.map.container.classList.add('gm-view');
				}
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