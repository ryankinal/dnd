export let routes = [
	// Users
	{
		functionSuffix: 'Users',
		path: '/users',
		methods: {
			get: {
				file: './functions/users/list.js',
				authenticate: true
			},
			post: {
				file: './functions/users/create.js',
				authenticate: false
			}
		}
	}, {
		functionSuffix: 'UserAuth',
		path: '/users/auth',
		methods: {
			post: {
				file: './functions/users/login.js',
				authenticate: false
			},
			put: {
				file: './functions/users/refresh.js',
				authenticate: false
			},
			delete: {
				file: './functions/users/logout.js',
				authenticate: false
			}
		}
	}, {
		functionSuffix: 'UserVerification',
		path: '/users/auth/verification',
		methods: {
			post: {
				file: './functions/users/verify.js',
				authenticate: false
			},
			put: {
				file: './functions/users/resend-code.js',
				authenticate: false
			}
		}
	}, {
		functionSuffix: 'User',
		path: '/users/:user_id',
		methods: {
			get: {
				file: './functions/users/read.js',
				authenticate: true
			},
			put: {
				file: './functions/users/update.js',
				authenticate: true
			},
			delete: {
				file: './functions/users/delete.js',
				authenticate: true
			}
		}
	},
	
	// Maps
	{
		functionSuffix: 'Maps',
		path: '/maps',
		methods: {
			get: {
				file: './functions/maps/list.js',
				authenticate: true
			},
			post: {
				file: './functions/maps/create.js',
				authenticate: true
			}
		}
	}, {
		functionSuffix: 'Map',
		path: '/maps/:map_id',
		methods: {
			get: {
				file: './functions/maps/read.js',
				authenticate: true
			},
			put: {
				file: './functions/maps/update.js',
				authenticate: true
			},
			delete: {
				file: './functions/maps/delete.js',
				authenticate: true
			}
		}
	}, {
		functionSuffix: 'MapChanges',
		path: '/maps/:map_id/changes',
		methods: {
			get: {
				file: './functions/maps/changes.js',
				authenticate: true
			}
		}
	},

	// GMS
	{
		functionSuffix: 'GMs',
		path: '/maps/:map_id/gms',
		methods: {
			get: {
				file: './functions/gms/list.js',
				authenticate: true
			},
			post: {
				file: './functions/gms/create.js',
				authenticate: true
			}
		}
	}, {
		functionSuffix: 'GM',
		path: '/maps/:map_id/gms/:gm_id',
		methods: {
			get: {
				file: './functions/gms/read.js',
				authenticate: true
			},
			put: {
				file: './functions/gms/update.js',
				authenticate: true
			},
			delete: {
				file: './functions/gms/delete.js',
				authenticate: true
			}
		}
	},

	// Players
	{
		functionSuffix: 'Players',
		path: '/maps/:map_id/players',
		methods: {
			get: {
				file: './functions/players/list.js',
				authenticate: true
			},
			post: {
				file: './functions/players/create.js',
				authenticate: true
			}
		}
	}, {
		functionSuffix: 'Player',
		path: '/maps/:map_id/players/:player_id',
		methods: {
			get: {
				file: './functions/players/read.js',
				authenticate: true
			},
			put: {
				file: './functions/players/update.js',
				authenticate: true
			},
			delete: {
				file: './functions/players/delete.js',
				authenticate: true
			}
		}
	},
	
	// Hexes
	{
		functionSuffix: 'Hexes',
		path: '/maps/:map_id/hexes',
		methods: {
			get: {
				file: './functions/hexes/list.js',
				authenticate: true
			},
			post: {
				file: './functions/hexes/create.js',
				authenticate: true
			}
		}
	}, {
		functionSuffix: 'Hex',
		path: '/maps/:map_id/hexes/:hex_id',
		methods: {
			get: {
				file: './functions/hexes/read.js',
				authenticate: true
			},
			put: {
				file: './functions/hexes/update.js',
				authenticate: true
			}
		}
	},
	
	// Hex Notes
	{
		functionSuffix: 'HexNotes',
		path: '/maps/:map_id/hexes/:hex_id/notes',
		methods: {
			get: {
				file: './functions/hex-notes/list.js',
				authenticate: true
			},
			post: {
				file: './functions/hex-notes/create.js',
				authenticate: true
			}
		}
	}, {
		functionSuffix: 'HexNote',
		path: '/maps/:map_id/hexes/:hex_id/notes/:note_id',
		methods: {
			get: {
				file: './functions/hex-notes/read.js',
				authenticate: true
			},
			put: {
				file: './functions/hex-notes/update.js',
				authenticate: true
			},
			delete: {
				file: './functions/hex-notes/delete.js',
				authenticate: true
			}
		}
	}
];