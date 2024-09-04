export class Events {
	constructor() {
		this.listeners = {};
	}

	pub(event, data) {
		if (typeof event === 'string' && Array.isArray(this.listeners[event])) {
			this.listeners[event].forEach((listener) => {
				listener(data);
			});
		}
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