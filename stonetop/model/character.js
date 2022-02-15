import { Campaign } from './campaign.js';
import { Steading } from './steading.js';

export class Character {
	constructor(character, campaign) {
		character = character || {};
		campaign = campaign || {};
		this.data = character;
		this.campaign = new Campaign(campaign);
		this.steading = new Steading(campaign.steading);
	}

	getMaxSmallItems(steading) {
		steading = steading || this.steading;
		return 4 + steading.getStat('prosperity');
	}

	getInventory() {
		this.data.inventory = this.data.inventory || [];
		return this.data.inventory;
	}

	findItem(item) {
		this.data.inventory = this.data.inventory || [];
		return this.data.inventory.indexOf(item);
	}

	setItem(index, item) {
		this.data.inventory = this.data.inventory || [];
		if (typeof this.data.inventory[index] !== 'undefined') {
			this.data.inventory[index] = item;
		}
	}

	addInventory(item) {
		this.data.inventory = this.data.inventory || [];
		this.data.inventory.unshift(item);
		return true;
	}

	removeInventory(item) {
		let index = -1;

		this.data.inventory = this.data.inventory || [];

		if (typeof item === 'object') {
			index = this.data.inventory.indexOf(item);	
		} else if (typeof item === 'number') {
			index = item;
		}

		if (index >= 0) {
			this.data.inventory.splice(index, 1);
			return true;
		} else {
			return false;
		}
	}

	clearInventory() {
		this.data.inventory = [];
		return true;
	}
}