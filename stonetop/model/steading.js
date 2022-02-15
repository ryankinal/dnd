export class Steading {
	constructor(steading) {
		let defaultData = {
			stats: {
				fortunes: 1,
				surplus: 1,
				size: 0,
				population: 0,
				prosperity: 0,
				defenses: 0
			},
			resources: [
				{ name: 'beans', category: 'Farming', sources: [] },
				{ name: 'potatoes', category: 'Farming', sources: [] },
				{ name: 'oats', category: 'Farming', sources: [] },
				{ name: 'barley', category: 'Farming', sources: [] },

				{ name: 'fur', category: 'Hunting', sources: [] },
				{ name: 'meat', category: 'Hunting', sources: [] },
				{ name: 'hides', category: 'Hunting', sources: [] },

				{ name: 'whisky', category: 'Distilling', sources: [] },

				{ name: 'stone', category: 'Collecting', sources: ['The Old Wall'] },
				{ name: 'water', category: 'Collecting', sources: ['Cistern'] },

				{ name: 'metal', category: 'Trade', sources: ["Gordin's Delve"] },
				{ name: 'tools', category: 'Trade', sources: ["Gordin's Delve"] },
				{ name: 'textiles', category: 'Trade', sources: ["Marshedge"] },
				{ name: 'herbs', category: 'Trade', sources: ["Marshedge"] },
				{ name: 'glass', category: 'Trade', sources: ["Marshedge"] }
			],
			fortifications: [
				{ name: 'The Ringwall', tags: ['low', 'stone'] },
				{ name: '3 watchtowers', tags: [] },
				{ name: 'Spears & wooden shields in every home', tags: [] },
				{ name: 'Some bows', tags: [] }
			],
			placesOfInterest: [
				{ name: 'The Stone', label: 'A', position: [0, 0], description: '' },
				{ name: 'The Granary', label: 'B', position: [0, 0], description: '' },
				{ name: 'Public House & Stables', label: 'C', position: [0, 0], description: '' },
				{ name: 'Cistern', label: 'D', position: [0, 0], description: '' },
				{ name: 'Pavilion of the Gods', label: 'E', position: [0, 0], description: '' },
				{ name: 'Watchtower', label: 'F', position: [0, 0], description: '' },
				{ name: 'Watchtower', label: 'F', position: [0, 0], description: '' },
				{ name: 'Watchtower', label: 'F', position: [0, 0], description: '' }
			]
		};

		this.statDescriptions = {
			size: {
				'-1': 'hamlet',
				'0': 'village',
				'1': 'town',
				'2': 'city'
			},
			population: {
				'-2': 'exodus',
				'-1': 'shrinking',
				'0': 'steady',
				'1': 'growing',
				'2': 'booming'
			},
			prosperity: {
				'-1': 'dirt',
				'0': 'poor',
				'1': 'moderate',
				'2': 'wealthy',
				'3': 'rich'
			},
			defenses: {
				'-1': 'none',
				'0': 'militia',
				'1': 'watch',
				'2': 'guard',
				'3': 'garrison'
			}
		}

		this.data = typeof steading === 'undefined' ? defaultData : null;
	}

	getMinStat(name) {
		let min = -Infinity;

		switch (name) {
			case 'fortunes':
				min = -3;
				break;
			case 'population':
				min = -2;
				break;
			case 'size':
			case 'prosperity':
			case 'defenses':
				min = -1
				break;
			case 'surplus':
				min = 0;
				break;
		}

		return min;
	}

	getMaxStat(name) {
		let max = Infinity;

		switch (name) {
			case 'size':
			case 'population':
				max = 2;
				break;
			case 'prosperity':
			case 'defenses':
				max = this.getStat('size') + 1
				break;
			case 'fortunes':
				max = 3;
				break;
		}

		return max;
	}

	decreaseStat(name) {
		let min = this.getMinStat(name);
		this.data.stats[name] = Math.max(this.data.stats[name] - 1, min);

		if (name === 'size') {
			this.data.stats.prosperity = Math.min(this.data.stats.prosperity, this.data.stats.size + 1);
			this.data.stats.defenses = Math.min(this.data.stats.defenses, this.data.stats.size +1);
		}

		return this.data.stats[name];
	}

	increaseStat(name) {
		let max = this.getMaxStat(name);
		return this.data.stats[name] = Math.min(this.data.stats[name] + 1, max);
	}

	getStat(name) {
		if (typeof this.data.stats[name] === 'undefined') {
			return false;
		} else {
			return this.data.stats[name];
		}
	}

	getStatDescription(name) {
		let value = this.getStat(name);

		if (value === false) {
			return false;
		} else if (typeof this.statDescriptions[name] === 'undefined' || typeof this.statDescriptions[name][value] === 'undefined') {
			return false;
		} else {
			return this.statDescriptions[name][value];
		}
	}
}