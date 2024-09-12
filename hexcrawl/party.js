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
		// Clear old hex
		this.hex.party = null;
		this.hex.renderIcons();

		// Move to new hex
		this.hex = hex;
		hex.party = this;
		hex.renderIcons();
	}

	getData() {
		let data = {
			id: this.id,
			name: this.name,
			icon: this.icon
		};

		if (this.hex instanceof Hex) {
			data.hex = this.hex.getData();
		}

		return data;
	}
}