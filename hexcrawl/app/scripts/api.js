import { config } from './config.js';

export class API {
	constructor() {
		let self = this;
		let events = window.hexcrawl.events;
		this.events = events;
		this.logging = true;

		events.sub('map.created', (map) => {
			let method = 'POST';
			let url = '/maps';
			let data = map.getData();

			self.makeRequest(method, url, data);
		});

		events.sub('map.updated', (map) => {
			if (map.id) {
				let method = 'PUT';
				let url = `/maps/${map.id}`;
				let data = map.getData();
				delete data.hexes;

				self.makeRequest(method, url, data);
			}
		});

		events.sub('map.deleted', (map) => {
			if (map.id) {
				let method = 'DELETE';
				let url = `/maps/${map.id}`;

				self.makeRequest(method, url);
			}
		});

		events.sub('party.created', (party) => {
			let map = party.map || party.hex.map;

			if (map.id) {
				let method = 'POST';
				let url = `/maps/${map.id}/parties`;
				let data = party.getData();

				self.makeRequest(method, url, data);
			}
		});

		events.sub('party.updated', (party) => {
			let map = party.map || party.hex.map;

			if (map.id) {
				let method = 'PUT';
				let url = `/maps/${map.id}/parties/${party.id}`;
				let data = party.getData();

				self.makeRequest(method, url, data);
			}
		});

		events.sub('party.deleted', (party) => {
			let map = party.map || party.hex.map;

			if (map.id) {
				let method = 'DELETE';
				let url = `/maps/${map.id}/parties/${party.id}`;

				self.makeRequest(method, url);
			}
		});

		events.sub('hex.created', (hex) => {
			let map = hex.map;

			if (map.id) {
				let method = 'POST';
				let url = `/maps/${hex.map.id}/hexes`;
				let data = hex.getData();

				self.makeRequest(method, url, data);
			}
		});

		events.sub('hex.updated', (hex) => {
			let map = hex.map;

			if (map.id) {
				let method = 'PUT';
				let url = `/maps/${hex.map.id}/hexes/${hex.id}`;
				let data = hex.getData();

				self.makeRequest(method, url, data);
			}
		});

		events.sub('hex.notes.created', (note) => {
			let hex = note.hex;
			let map = hex.map;

			if (hex.id && map.id) {
				let method = 'POST';
				let url = `/maps/${map.id}/hexes/${hex.id}/notes`;
				let data = note.getData();

				self.makeRequest(method, url, data);	
			}
		});

		events.sub('hex.notes.updated', (note) => {
			let hex = note.hex;
			let map = hex.map;

			if (hex.id && map.id) {
				let method = 'PUT';
				let url = `/maps/${map.id}/hexes/${hex.id}/notes/${note.id}`;
				let data = note.getData();

				self.makeRequest(method, url, data);
			}
		});

		events.sub('hex.notes.deleted', (note) => {
			let hex = note.hex;
			let map = hex.map;

			if (hex.id && map.id) {
				let method = 'PUT';
				let url = `/maps/${map.id}/hexes/${hex.id}/notes/${note.id}`;

				self.makeRequest(method, url);
			}
		});
	}

	makeRequest(method, url, data) {	
		if (this.logging) {
			console.log(`${method} ${url}`, data);
		}

		let dataIsQuery = method === 'GET' || method === 'DELETE';

		if (data && dataIsQuery) {
			let params = new URLSearchParams(data);
			url += '?' + params.toString();
		}

		let xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if (this.logging) {
				console.log(`${method} ${url} - ${xhr.status}`, data);
			}
		};
		xhr.open(method, window.location.protocol + '//' + config.apiBase + url);
		xhr.send(data && !dataIsQuery ? JSON.stringify(data) : null);
	}
}