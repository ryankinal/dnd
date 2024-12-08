import { Id } from "./id.js";
import { Hex } from './hex.js';

export class Party {
	constructor(data) {
		this.id = null;
		this.name = null;
		this.icon = 'fa-solid fa-location-pin';
		this.hex = null;

		if (data) {
			if (typeof data.id === 'string') {
				this.id = data.id;
			}

			if (typeof data.name === 'string') {
				this.name = data.name;
			}
		}

		if (!this.id) {
			this.id = Id.generate();
		}
	}

	moveTo(hex) {
		let oldHex = this.hex;

		if (oldHex) {
			// Clear old hex
			oldHex.party = null;
			oldHex.renderIcons();
		}

		// Move to new hex
		this.hex = hex;
		hex.party = this;
		hex.renderIcons();

		if (this.hex.map.triggerEvents) {
			// hexcrawl.events.pub('party.updated', this);

			if (oldHex) {
				hexcrawl.events.pub('hex.updated', oldHex);
			}
			
			hexcrawl.events.pub('hex.updated', hex);
		}
	}

	getData() {
		let data = {
			id: this.id,
			name: this.name,
			icon: this.icon
		};

		if (this.hex instanceof Hex) {
			data.hex = {
				id: this.hex.id
			};
		}

		return data;
	}
}