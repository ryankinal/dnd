export let items = [
	// Undefined
	{ name: 'Have What You Need', category: 'Have What You Need', material: null, load: 1, tags: [], value: 0},
	{ name: 'Have What You Need', category: 'Have What You Need', material: null, load: 0, tags: [], value: 0},

	// Weapons of war
	{ name: 'Mace or Flail', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', 'forceful'], value: 1},
	{ name: 'Battleaxe', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', 'messy'], value: 1},
	{ name: 'Battleaxe', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', 'messy', '1 piercing'], value: 2},
	{ name: 'Short sword', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', 'hand'], value: 1},
	{ name: 'Short sword', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', 'hand', '1 piercing'], value: 2},
	{ name: 'Sword', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', '+1 damage'], value: 1},
	{ name: 'Sword', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', '+1 damage', '1 piercing'], value: 2},
	{ name: 'Greatsword', category: 'Weapons of War', material: 'iron', load: 2, tags: ['close', '2-handed', 'messy'], value: 1},
	{ name: 'Greatsword', category: 'Weapons of War', material: 'iron', load: 2, tags: ['close', '2-handed', 'messy', '1 piercing'], value: 2},
	{ name: 'Warhammer', category: 'Weapons of War', material: 'iron', load: 1, tags: ['close', '2 piercing'], value: 1},
	{ name: 'Crossbow', category: 'Weapons of War', material: 'iron', load: 1, tags: ['far', 'ammo', '+1 damage', '1 piercing'], value: 1},
	{ name: 'Longbow', category: 'Weapons of War', material: 'iron', load: 1, tags: ['far', 'ammo', '+1 damage', '1 piercing'], value: 1},

	// Bronze weapons
	{ name: 'Mace or Flail', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['close', 'forceful'], value: 1},
	{ name: 'Battleaxe', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['close', 'messy'], value: 1},
	{ name: 'Short sword', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['close', 'hand'], value: 1},
	{ name: 'Sword', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['close', '+1 damage'], value: 1},
	{ name: 'Greatsword', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['close', '2-handed', 'messy'], value: 1},
	{ name: 'Warhammer', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['close'], value: 1},
	{ name: 'Crossbow', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['far', 'ammo', '+1 damage'], value: 1},
	{ name: 'Longbow', category: 'Bronze Weapons', material: 'bronze', load: 1, tags: ['far', 'ammo', '+1 damage'], value: 1},

	// Armor
	{ name: 'Cuirass', category: 'Armor', material: 'boiled leather', load: 1, tags: ['1 armor'], value: 1},
	{ name: 'Hauberk/cuirass/scale', category: 'Armor', material: 'iron or bronze', load: 2, tags: ['2 armor', 'warm', 'clumsy'], value: 2},
	{ name: 'Vest', category: 'Armor', material: 'brigandine', load: 1, tags: ['fancy', '2 armor', 'warm'], value: 1},

	// Light sources
	{ name: 'Candle', category: 'Light Sources', material: null, load: 0, tags: ['1 hour', 'close', 'area'], value: 0 },
	{ name: 'Lantern', category: 'Light Sources', material: null, load: 1, tags: ['5 hours', 'reach', 'area'], value: 0 },
	{ name: 'Bullseye Lantern', category: 'Light Sources', material: null, load: 1, tags: ['5 hours', 'near'], value: 1 },

	// Tools & Trades
	{ name: 'Small metal tool', category: 'Tools & Trades', material: 'bronze, iron, or steel', load: 0, tags: [], value: 0 },
	{ name: 'Glass vial', category: 'Tools & Trades', material: 'glass', load: 0, tags: [], value: 0 },
	{ name: 'Block & tackle', category: 'Tools & Trades', material: 'wood and iron', load: 1, tags: [], value: 0 },
	{ name: 'Instrument', category: 'Tools & Trades', material: null, load: 1, tags: [], value: 1 },
	{ name: 'Metal tool', category: 'Tools & Trades', material: 'bronze, iron, or steel', load: 1, tags: [], value: 0 },
	{ name: 'Mirror', category: 'Tools & Trades', material: 'polished bronze', load: 1, tags: [], value: 1 },
	{ name: 'Common trade tools', category: 'Tools & Trades', material: null, load: null, tags: ['immobile'], value: 1 },
	{ name: 'Uncommon trade tools', category: 'Tools & Trades', material: null, load: null, tags: ['immobile'], value: 2 },
	{ name: 'Specialized trade tools', category: 'Tools & Trades', material: null, load: null, tags: ['immobile'], value: 3 },

	// Writing Implements
	{ name: 'Slate and chalk', category: 'Writing Implements', material: null, load: 1, tags: [], value: 0 },
	{ name: 'Wax tablet and stylus', category: 'Writing Implements', material: null, load: 1, tags: [], value: 0 },
	{ name: 'Parchment', category: 'Writing Implements', material: null, stock: 3, load: 0, tags: [], value: 1 },
	{ name: 'Fine vellum', category: 'Writing Implements', material: null, stock: 3, load: 0, tags: [], value: 2 },
	{ name: 'Ink, vial, and quills', category: 'Writing Implements', material: null, stock: 3, load: 0, tags: [], value: 1 },
	{ name: 'Empty book, parchment', category: 'Writing Implements', material: null, stock: 25, load: 1, tags: [], value: 1 },
	{ name: 'Empty book, fine vellum', category: 'Writing Implements', material: null, stock: 25, load: 1, tags: [], value: 2 },

	// Transport
	{ name: 'Wheelbarrow', category: 'Transport', material: 'wood and iron', load: null, tags: [], value: 1 },
	{ name: 'Cart', category: 'Transport', material: 'wood and iron', load: null, tags: ['requires donkey/mule/horse'], value: 2 },
	{ name: 'Sleigh', category: 'Transport', material: 'wood and iron', load: null, tags: ['requires donkey/mule/horse'], value: 2 },
	{ name: 'Wagon', category: 'Transport', material: 'wood and iron', load: null, tags: ['requires mule/horse'], value: 3 },
	{ name: 'Spare parts for wagon/cart/sleigh', category: 'Transport', material: 'wood and iron', stock: 3, load: null, tags: ['immobile'], value: 2 },

	// Exotic Stuff
	{ name: 'Bendis root', category: 'Exotic Stuff', material: null, stock: null, load: 0, tags: ['1 hour', 'reach', 'area'], value: 1 },
	{ name: 'Bezoar', category: 'Exotic Stuff', material: null, stock: null, load: 0, tags: ['1 hour', 'reach', 'area'], value: 1 },
	{ name: 'Naphtha', category: 'Exotic Stuff', material: null, stock: 3, load: 1, tags: ['d8 damage', 'thrown', 'area', 'dangerous', 'ignores armor'], value: 1 },
	{ name: 'Silver-alloy dagger', category: 'Exotic Stuff', material: null, stock: null, load: 1, tags: ['hand', 'precise'], value: 2 },

	// Trade Goods
	{ name: 'Salt', category: 'Trade Goods', material: null, stock: null, load: 0, tags: [], value: 0 },
	{ name: 'Skin of whisky', category: 'Trade Goods', material: null, stock: 2, load: 0, tags: [], value: 0 },
	{ name: 'Purse of coppers', category: 'Trade Goods', material: null, stock: 5, load: 1, tags: [], value: 0 },
	{ name: 'Firkin of whisky, fine', category: 'Trade Goods', material: null, stock: 5, load: 2, tags: [], value: 1 },
	{ name: 'Handful of silvers', category: 'Trade Goods', material: null, stock: null, load: 0, tags: [], value: 1 },
	{ name: 'Barrel of whisky, common', category: 'Trade Goods', material: null, stock: null, load: null, tags: ['immobile'], value: 1 },
	{ name: 'Barrel of whisky, fine', category: 'Trade Goods', material: null, stock: null, load: null, tags: ['immobile'], value: 2 },
	{ name: 'Purse of silvers', category: 'Trade Goods', material: null, stock: 5, load: 1, tags: [], value: 2 },
	{ name: '1 Surplus (village)', category: 'Trade Goods', material: null, stock: 5, load: null, tags: ['immobile'], value: 2 },

	// Livestock & Other Beasts
	{ name: 'Dog', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['follower', 'keen-nosed', '*', '*'], value: 1 },
	{ name: 'Goat', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['keen-nosed', 'sure-footed', 'curious', 'hungry'], value: 1 },
	{ name: 'Sheep', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['timid', 'hardy', 'wooly'], value: 1 },
	{ name: 'Pig', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['keen-nosed', 'stubborn', 'gluttonous', 'clever'], value: 1 },
	{ name: 'Donkey', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['hardy', 'sure-footed', 'cautious', 'slow'], value: 2 },
	{ name: 'Mule', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['large', 'hardy', 'sure-footed', 'keen-nosed', 'sterile'], value: 3 },
	{ name: 'Horse', category: 'Livestock & Other Beasts', material: null, stock: null, load: null, tags: ['large', 'powerful', 'keen-nosed', 'swift or hardy'], value: 3 }
];