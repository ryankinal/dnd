export class TouchHandler {
	constructor(sampleRate) {
		this.sampleRate = sampleRate || 60;
		this.sampleMS = Math.floor(1000 / this.sampleRate);
	}

	touchMove(element, handler, onStart, onEnd) {
		let sample = 0;
		let start = 0;
		let lastTouch = null;

		setInterval(() => sample += start, this.sampleMS)

		element.addEventListener('touchstart', (e) => {
			if (e.touches.length === 1) {
				lastTouch = e.touches[0];
				start = 1;
				e.clientX = e.touches[0].clientX;
				e.clientY = e.touches[0].clientY;

				if (typeof onStart === 'function') {
					onStart(e);
				}
			} else {
				lastTouch = null;
				start = 0;

				if (typeof onEnd === 'function') {
					onEnd(e);
				}
			}
		});

		document.addEventListener('touchend', (e) => {
			lastTouch = null;
			start = 0

			if (typeof onEnd === 'function') {
				onEnd(e);
			}
		});

		document.addEventListener('touchmove', (e) => {
			e.clientX = e.touches[0].clientX;
			e.clientY = e.touches[0].clientY;

			if (sample) {
				if (lastTouch) {
					let xDiff = e.touches[0].clientX - lastTouch.clientX;
					let yDiff = e.touches[0].clientY - lastTouch.clientY;

					e.touches[0].movementX = xDiff;
					e.touches[0].movementY = yDiff;
				} else {
					e.touches[0].movementX = 0;
					e.touches[0].movementY = 0;
				}

				lastTouch = {
					clientX: e.touches[0].clientX,
					clientY: e.touches[0].clientY
				};

				sample--;
				handler(e.touches[0]);
			}

			return false;
		});
	}

	pinch(element, handler, onStart, onEnd) {
		let self = this;
		let start = 0;
		let sample = 0;
		let deltaMin = 1;
		let lastTouchData = {};

		setInterval(() => sample += start, this.sampleMS)

		element.addEventListener('touchstart', (e) => {
			if (e.touches.length === 2) {
				start = 1;

				if (typeof onStart === 'function') {
					onStart(e);
				}
			} else {
				start = 0;

				if (typeof onEnd === 'function') {
					onEnd(e);
				}
			}
		});

		document.addEventListener('touchend', (e) => {
			lastTouchData = {};
			start = 0

			if (typeof onEnd === 'function') {
				onEnd(e);
			}
		});

		document.addEventListener('touchmove', (e) => {
			if (sample && e.touches.length === 2) {
				let delta = 0;
				let distance = self.getTouchDistance(e.touches);

				if (typeof lastTouchData.distance === 'number') {
					delta = Math.round(distance - lastTouchData.distance);
				}

				sample--;

				lastTouchData = {
					touches: e.touches,
					distance: distance,
					delta: delta
				};

				if (Math.abs(delta) > deltaMin) {
					if (lastTouchData.touches && lastTouchData.touches.length === 2) {
						let xDiff0 = e.touches[0].clientX - lastTouchData.touches[0].clientX;
						let yDiff0 = e.touches[0].clientY - lastTouchData.touches[0].clientY;

						let xDiff1 = e.touches[1].clientX - lastTouchData.touches[1].clientX;
						let yDiff1 = e.touches[1].clientY - lastTouchData.touches[1].clientY;

						e.touches[0].movementX = xDiff0;
						e.touches[0].movementY = yDiff0;

						e.touches[1].movementX = xDiff1;
						e.touches[1].movementY = yDiff1;

						lastTouchData.clientX = e.touches[0].clientX + (e.touches[1].clientX - e.touches[0].clientX) / 2;
						lastTouchData.clientY = e.touches[0].clientY + (e.touches[1].clientY - e.touches[0].clientY) / 2;
					}

					handler(lastTouchData);
				}
			}
		})
	}

	getTouchDistance(touches) {
		if (touches.length === 2) {
			let xDiff = Math.abs(touches[1].clientX - touches[0].clientX);
			let yDiff = Math.abs(touches[1].clientY - touches[0].clientY);

			return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
		}

		return -1;
	}
}