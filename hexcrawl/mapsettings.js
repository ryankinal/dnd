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

			if (data.toolBelt instanceof HTMLElement) {
				this.toolBelt = data.toolBelt;
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
			menu: this.toolBelt.querySelector('.map-settings'),
			gmView: this.container.querySelector('.gm-view'),
			map: this.container.querySelector('.map'),
			notes: this.container.querySelector('.notes'),
			party: this.toolBelt.querySelector('.center-party')
		};

		this.wireEvents();
	}

	hide() {
		if (this.container instanceof HTMLElement) {
			this.container.classList.add('hidden');
		}
	}

	show() {
		if (this.container instanceof HTMLElement) {
			this.container.classList.remove('hidden');
		}
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
				this.buttons.gmView.classList.add('on');
			} else {
				this.map.container.classList.remove('gm-view');
				this.buttons.gmView.classList.remove('on');
			}
		} else {
			if (this.map.container.matches('.gm-view')) {
				this.map.container.classList.remove('gm-view');
				this.buttons.gmView.classList.remove('on');
			} else {
				this.map.container.classList.add('gm-view');
				this.buttons.gmView.classList.add('on');
			}
		}
	}

	wireEvents() {
		let self = this;
		let selectionTimeout = null;

		if (this.container) {
			this.container.addEventListener('click', (e) => {
				e.stopPropagation();
				return false;
			})
		}

		if (this.buttons.menu) {
			this.buttons.menu.addEventListener('click', (e) => {
				self.show();
			});
		}

		document.body.addEventListener('click', (e) => {
			self.hide();
		});

		window.hexcrawl.events.sub('map.new', (map) => {
			map.allowBackgroundAdjust = true;
			this.map = map;
			self.container.classList.add('hidden');
			self.buttons.menu.classList.remove('disabled');
		});

		if (this.buttons.gmView) {
			this.buttons.gmView.addEventListener('click', () => {
				self.toggleGMView();
			});
		}

		if (this.buttons.party) {
			this.buttons.party.addEventListener('click', () => {
				let parties = Object.values(self.map.parties);
				let firstParty = parties.length ? parties[0] : null;

				if (firstParty && firstParty.hex) {
					self.map.centerOnHex(firstParty.hex, true);
				}
			});
		}
		
		window.hexcrawl.events.sub('hex.selected', () => {
			clearTimeout(selectionTimeout);
			self.container.classList.add('hidden');
		});
	}
}