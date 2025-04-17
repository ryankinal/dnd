import { config } from './config.js';

export class API {
	constructor() {
		let self = this;
		let events = window.hexcrawl && window.hexcrawl.events;

		this.pollInterval = 3000;
		this.events = events;
		this.logging = true;
		this.lastChangeTime = null;

		if (events) {
			events.sub('map.created', (map) => {
				let method = 'POST';
				let url = '/maps';
				let data = map.getData();
	
				return self.makeRequest(method, url, data)
					.then((response) => {
						if (response.statusCode === 201) {
							map.id = response.body.data.id;
							history.replaceState(null, null, '/app/' + map.id);
							self.pollChanges(map);

							if (Array.isArray(map.hexes)) {
								Object.values(map.hexes).forEach((hex) => {
									events.pub('hex.created', hex);
								});
							}
						}
					});
			});
	
			events.sub('map.updated', (map) => {
				if (map.id) {
					let method = 'PUT';
					let url = `/maps/${map.id}`;
					let data = map.getData();
					delete data.hexes;
	
					return self.makeRequest(method, url, data);
				}
			});
	
			events.sub('map.deleted', (map) => {
				if (map.id) {
					let method = 'DELETE';
					let url = `/maps/${map.id}`;
	
					return self.makeRequest(method, url)
						.then((response) => {
							window.location = '/';
						});
				}
			});
	
			events.sub('party.created', (party) => {
				let map = party.map || party.hex.map;
	
				if (map.id) {
					let method = 'POST';
					let url = `/maps/${map.id}/parties`;
					let data = party.getData();
	
					return self.makeRequest(method, url, data);
				}
			});
	
			events.sub('party.updated', (party) => {
				let map = party.map || party.hex.map;
	
				if (map.id) {
					let method = 'PUT';
					let url = `/maps/${map.id}/parties/${party.id}`;
					let data = party.getData();
	
					return self.makeRequest(method, url, data);
				}
			});
	
			events.sub('party.deleted', (party) => {
				let map = party.map || party.hex.map;
	
				if (map.id) {
					let method = 'DELETE';
					let url = `/maps/${map.id}/parties/${party.id}`;
	
					return self.makeRequest(method, url);
				}
			});
	
			events.sub('hex.created', (hex) => {
				let map = hex.map;
	
				if (map.id) {
					let method = 'POST';
					let url = `/maps/${hex.map.id}/hexes`;
					let data = hex.getData();
	
					return self.makeRequest(method, url, data);
				}
			});
	
			events.sub('hex.updated', (hex) => {
				let map = hex.map;
	
				if (hex.id && map && map.id) {
					let method = 'PUT';
					let url = `/maps/${hex.map.id}/hexes/${hex.id}`;
					let data = hex.getData();
	
					return self.makeRequest(method, url, data);
				}
			});
	
			events.sub('hex.notes.created', (note) => {
				let hex = note.hex;
				let map = hex.map;
	
				if (hex.id && map.id) {
					let method = 'POST';
					let url = `/maps/${map.id}/hexes/${hex.id}/notes`;
					let data = note.getData();
	
					return self.makeRequest(method, url, data);	
				}
			});
	
			events.sub('hex.notes.updated', (note) => {
				let hex = note.hex;
				let map = hex.map;
	
				if (hex.id && map.id) {
					let method = 'PUT';
					let url = `/maps/${map.id}/hexes/${hex.id}/notes/${note.id}`;
					let data = note.getData();
	
					return self.makeRequest(method, url, data);
				}
			});
	
			events.sub('hex.notes.deleted', (note) => {
				let hex = note.hex;
				let map = hex.map;
	
				if (hex.id && map.id) {
					let method = 'PUT';
					let url = `/maps/${map.id}/hexes/${hex.id}/notes/${note.id}`;
	
					return self.makeRequest(method, url);
				}
			});
		}
	}

	async getMap(mapId) {
		return await this.makeRequest('GET', `/maps/${mapId}`);
	}

	async getHexes(mapId, from) {
		let data = from ? { from: from } : null;
		return await this.makeRequest('GET', `/maps/${mapId}/hexes`, data);
	}

	async pollChanges(map) {
		let self = this;
		let lastChangeTime = this.lastChangeTime || Date.now() - 2000;

		let response = await this.makeRequest('GET', `/maps/${map.id}/changes`, {
				start: lastChangeTime
			});


		if (response.body && response.body) {
			let changes = response.body.data || [];
			this.lastChangeTime = response.body.lastChangeTime || Date.now() - 500;

			if (changes.length) {
				map.handleChanges();
			}
		}

		setTimeout(() => {
			self.pollChanges(map);
		}, this.pollInterval);
	}

	async auth(email, password) {
		let data = {
				email: email,
				password: password
			};

		try {
			let auth = await this.send('POST', '/users/auth', data, false)
		
			if (auth.statusCode === 200) {
				localStorage.setItem('access_token', auth.body.accessToken);
				localStorage.setItem('access_expires', Date.now() + (auth.body.expiresIn * 1000));

				let user = await this.makeRequest('GET', '/users/me');

				if (user && user.body && user.body.id) {
					localStorage.setItem('user_id', user.body.id);

					return true;
				}
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}

	async refreshAccess() {
		let userId = localStorage.getItem('user_id');
		let refreshToken = localStorage.getItem('refresh_token');
		let data = {
				id: userId,
				token: refreshToken
			};

		try {
			let response = await this.send('PUT', '/users/auth', data, false)
		
			if (response.statusCode === 200) {
				localStorage.setItem('access_token', response.body.accessToken);
				localStorage.setItem('access_expires', Date.now() + (response.body.expiresIn * 1000));

				return true;
			} else {
				return false;
			}	
		} catch (e) {
			return false;
		}
	}

	send(method, url, data, authorized) {
		let self = this;
		let dataIsQuery = method === 'GET' || method === 'DELETE';

		if (authorized !== false) {
			authorized = true;
		}

		if (data && dataIsQuery) {
			let params = new URLSearchParams(data);
			url += '?' + params.toString();
		}

		let xhr = new XMLHttpRequest();
		xhr.open(method, window.location.protocol + '//' + config.apiBase + url);
		xhr.setRequestHeader('Content-type', 'application/json');

		if (authorized) {
			let accessToken = localStorage.getItem('access_token');
			xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		}

		return new Promise((resolve, reject) => {
			xhr.onload = () => {
				let parsed = {};

				console.log(xhr.responseText);

				try {
					parsed = xhr.responseText ? JSON.parse(xhr.responseText) : {};
				} catch (e) {

				}

				let response = {
						statusCode: xhr.status,
						body: parsed
					};

				if (this.logging) {
					console.log(`${method} ${url} - ${xhr.status}`, response);
				}

				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(response);
				} else if (xhr.status === 401 && authorized) {
					self.refreshAccess()
						.then(() => {
							return self.send(method, url, data, authorized);
						})
						.catch(() => {
							reject(response);
						});
				} else {
					reject(response)
				}
			};

			xhr.send(data && !dataIsQuery ? JSON.stringify(data) : null);
		});
	}

	async makeRequest(method, url, data) {
		if (this.logging) {
			console.log(`${method} ${url}`, data);
		}

		let expires = localStorage.getItem('access_expires');

		if (Date.now() > expires - 5000) {
			await this.refreshAccess();
		}
		
		return this.send(method, url, data);
	}
}