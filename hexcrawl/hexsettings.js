import { Map } from './map.js';
import { Hex } from './hex.js';

export class HexSettings {
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
			notes: this.container.querySelector('.notes-button'),
			backgroundAdjust: this.container.querySelector('.background-position'),
			backgroundImage: this.container.querySelector('.background-image'),
			hide: this.container.querySelector('.hide')
		};

		this.wireEvents();
	}

	wireEvents() {
		let self = this;

		window.hexcrawl.events.sub('hex.selected', (hex) => {
			if (hex !== self.hex) {
				self.buttons.backgroundAdjust.classList.remove('on');
				hex.backgroundAdjust = false;
				self.map.panEnabled = true;
				self.hex = hex;
				self.show();
			}
		});

		window.hexcrawl.events.sub('hex.unselected', () => {
			if (self.hex) {
				self.hex.backgroundAdjust = false;
				self.hex = null;
			}
			
			self.buttons.backgroundAdjust.classList.remove('on');
			self.map.panEnabled = true;
			self.hide();
		});

		if (this.buttons.backgroundAdjust) {
			this.buttons.backgroundAdjust.addEventListener('click', (e) => {
				if (self.hex) {
					if (!self.hex.backgroundAdjust) {
						self.buttons.backgroundAdjust.classList.add('on');
						self.map.panEnabled = false;
						
						self.hex.startBackgroundAdjust();
					} else {
						self.buttons.backgroundAdjust.classList.remove('on');
						self.map.panEnabled = true;
						
						self.hex.confirmBackgroundAdjust();
					}
	
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			});

			document.addEventListener('keyup', (e) => {
				if (self.hex && self.hex.backgroundAdjust) {
					if (e.code === 'Enter') {
						self.buttons.backgroundAdjust.classList.remove('on');
						self.map.panEnabled = true;
						self.hex.confirmBackgroundAdjust();
					} else if (e.code === 'Escape') {
						self.buttons.backgroundAdjust.classList.remove('on');
						self.map.panEnabled = true;
						self.hex.cancelBackgroundAdjust();
					}	
				}
			});
		}

		if (this.buttons.hide) {
			this.buttons.hide.addEventListener('click', () => {
				self.hex.hide();
			});
		}
	}

	show() {
		if (this.container) {
			this.container.classList.remove('hidden')
		}
	}

	hide() {
		if (this.container) {
			this.container.classList.add('hidden');
		}
	}
};