import { Steading } from './steading.js';

export class Campaign {
	constructor(data) {
		let self = this;
		data = data || {};
		this.steading = new Steading(typeof data.steading === 'undefined' ? {} : data.steading);
		this.characters = [];
		this.npcs = [];
		this.chronicle = typeof data.chronicle === 'undefined' ? [] : data.chronicle;

		if (typeof data.characters !== 'undefined' && data.characters.forEach) {
			data.characters.forEach(function(c) {
				self.addCharacter(c);
			});
		}
	}

	addCharacter(data) {
		if (typeof data !== 'Character') {
			data = new Character(data);
		}

		this.characters.push(data);
		return true;
	}
}