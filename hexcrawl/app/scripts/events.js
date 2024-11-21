export class Events {
	constructor() {
		this.listeners = {};
	}

	pub(event, data) {
		let results = [];

		if (typeof event === 'string' && Array.isArray(this.listeners[event])) {
			this.listeners[event].forEach((listener) => {
				if (typeof listener === 'function') {
					results.push(listener(data));
				}
			});
		}

		return Promise.all(results);
	}

	sub(event, listener) {
		if (typeof event === 'string' && typeof listener === 'function') {
			this.listeners[event] = this.listeners[event] || [];
			this.listeners[event].push(listener)
		}
	}

	unsub(event, listener) {
		if (typeof event === 'string' && typeof listener === 'function') {
			this.listeners[event] = this.listeners[event].filter((f) => f !== listener);
		}
	}
}