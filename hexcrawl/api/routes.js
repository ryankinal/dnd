export let routes = [
	{
		path: '/users',
		methods: {
			get: './functions/users/list.js',
			post: './functions/users/create.js'
		}
	}, {
		path: '/users/auth',
		methods: {
			post: './functions/users/login.js',
			put: './functions/users/refresh.js',
			delete: './functions/users/logout.js'
		}
	}, {
		path: '/users/auth/verification',
		methods: {
			post: './functions/users/verify.js',
			put: './functions/users/resend-code.js'
		}
	}, {
		path: '/users/:user_id',
		methods: {
			get: './functions/users/read.js',
			put: './functions/users/update.js',
			delete: './functions/users/delete.js'
		}
	}, {
		path: '/maps',
		methods: {
			get: './functions/maps/list.js',
			post: './functions/maps/create.js'
		}
	}, {
		path: '/maps/:map_id',
		methods: {
			get: './functions/maps/read.js',
			put: './functions/maps/update.js',
			delete: './functions/maps/delete.js'
		}
	}, {
		path: '/maps/:map_id/hexes',
		methods: {
			get: './functions/hexes/list.js',
			post: './functions/hexes/create.js'
		}
	}, {
		path: '/maps/:map_id/hexes/:hex_id',
		methods: {
			get: './functions/hexes/read.js',
			put: './functions/hexes/update.js',
		}
	}, {
		path: '/maps/:map_id/hexes/:hex_id/notes',
		methods: {
			get: './functions/hex-notes/list.js',
			post: './functions/hex-notes/create.js'
		}
	}, {
		path: '/maps/:map_id/hexes/:hex_id/notes/:note_id',
		methods: {
			get: './functions/hex-notes/read.js',
			put: './functions/hex-notes/update.js',
			delete: './functions/hex-notes/delete.js'
		}
	}
];