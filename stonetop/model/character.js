import { Campaign } from './campaign.js';
import { Steading } from './steading.js';
import { items } from '../data/inventory-data.js';

export class Character {
	constructor(character, campaign) {
		character = character || {};
		campaign = campaign || {};
		this.data = character;
		this.campaign = new Campaign(campaign);
		this.steading = new Steading(campaign.steading);

		let inventorySortOrder = {};

		[
			'Weapons of War',
			'Armor',
			'Light Sources',
			'Provisions & Supplies',
			'Tools & Trades',
			'Writing Implements',
			'Transport',
			'Exotic Stuff',
			'Trade Goods',
			'Bronze Weapons',
			'Livestock & Other Beasts',
			'Have What You Need',
			'Miscellany'
		].forEach(function(category, index) {
			inventorySortOrder[category] = index;
		});

		this.inventorySortOrder = inventorySortOrder;

		this.sortInventory();
	}

	getMaxSmallItems(steading) {
		steading = steading || this.steading;
		return 4 + steading.getStat('prosperity');
	}

	getInventory() {
		this.data.inventory = this.data.inventory || [];
		return this.data.inventory;
	}

	sortInventory() {
		let self = this;
		this.data.inventory = this.data.inventory || [];
		this.data.inventory.sort(function(a, b) {
			return self.inventorySortOrder[a.category] - self.inventorySortOrder[b.category];
		});
	}

	findItem(item) {
		this.data.inventory = this.data.inventory || [];
		return this.data.inventory.indexOf(item);
	}

	getItem(index) {
		this.data.inventory = this.data.inventory || [];
		return typeof this.data.inventory[index] !== 'undefined' ? this.data.inventory[index] : null;
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

		this.sortInventory();

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

	getData() {
		return this.data;
	}
}