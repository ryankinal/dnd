let noteTypes = {
	note: {
		name: 'Note',
		icon: 'fa-duotone fa-solid fa-file-lines'
	},
	combat: {
		name: 'Combat Encounter',
		icon: 'fa-duotone fa-solid fa-shield-halved'
	},
	social: {
		name: 'Social Encounter',
		icon: 'fa-duotone fa-solid fa-comments'
	},
	treasure: {
		name: 'Treasure',
		icon: 'fa-duotone fa-solid fa-gem'
	},
	secret: {
		name: 'GM Secret',
		icon: 'fa-duotone fa-solid fa-lock'
	}
};

let maps = {
	barovia: {
		"background": {
			"image": "barovia-map.jpg",
			"width": 8332,
			"height": 5873,
			"x": -7094,
			"y": -2627
		},
		"hexes": {
			"6f8ea9ab-c7a6-4322-b3d4-caba5b64c758": {
				"x": -50,
				"y": -43,
				"background": {
					"position": {
						"x": -7094,
						"y": -2627
					},
					"image": "barovia-map.jpg",
					"width": 8332,
					"height": 5873
				}
			}
		}
	}
};

export let config = {
	noteTypes: noteTypes,
	maps: maps
};