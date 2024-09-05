import { Hex } from './hex.js';

export class Map {
	constructor(data) {
		// Pan vars
		this.panEnabled = true;
		this.panStartCoordinates = null;
		this.panning = false;

		// Zoom vars
		this.minScale = 0.5;
		this.maxScale = 4.0;
		
		// Defaults
		this.container = null;
		this.start = null;
		this.background = {
			image: null,
			scale: 1,
			width: 5355,
			height: 3775
		};
		
		this.transform = {
			origin: {
				x: 0,
				y: 0
			},
			translate: {
				x: 0,
				y: 0
			},
			scale: 1
		};
		
		// Arguments
		if (data) {
			if (typeof data.background === 'object') {
				this.background = data.background;
			}

			if (typeof data.start === 'object') {
				data.start.background = data.start.background || {};
				data.start.background.image = data.start.background.image || this.background.image;
				data.start.background.position = data.start.background.position || { x: 0, y: 0};
				data.start.background.width = data.start.background.width || this.background.width;
				data.start.background.height = data.start.background.height || this.background.height;
				data.start.map = this;

				this.start = new Hex(data.start);
			}

			if (typeof data.container === 'object') {
				this.container = data.container;
			}
		}

		// Default start location
		if (!this.start) {
			this.start = new Hex({
				background: {
					image: this.background.image,
					position: {
						x: -6642,
						y: -2486
					},
					dimensions: this.background.dimensions
				},
				map: this
			});
		}

		this.wireEvents();
	}

	wireEvents() {
		if (this.container) {
			let self = this;

			let panStart = function(e) {
				if (self.panEnabled) {
					if ((e.clientX && e.clientY) || (e.touches && e.touches.length === 1)) {
						self.panStartCoordinates = {
							x: e.clientX,
							y: e.clientY
						}
					}
				}
			};

			let panEnd = function(e) {
				if (!e.touches || e.touches.length === 0) {
					self.panStartCoordinates = null;

					setTimeout(() => {
						self.panning = false;
					}, 10);
				}
			};

			let pan = function(e) {
				if (self.panStartCoordinates) {
					let scrollBox = self.container.parentNode.getBoundingClientRect();
					let x = e.clientX;
					let y = e.clientY;

					if (x && y && Math.abs(x - self.panStartCoordinates.x) > 10 || Math.abs(y - self.panStartCoordinates.y) > 10) {
						self.panning = true;

						self.transform.translate.x += (e.movementX / self.transform.scale);
						self.transform.translate.y += (e.movementY / self.transform.scale);

						self.transform.origin = {
							x: (scrollBox.width / 2 - self.transform.translate.x),
							y: (scrollBox.height / 2 - self.transform.translate.y)
						};

						self.applyTransform();
					}
				}

				e.preventDefault();
				return false;
			};

			this.container.parentNode.addEventListener('mousedown', panStart);
			this.container.parentNode.addEventListener('touchstart', panStart);

			document.addEventListener('mouseup', panEnd);
			document.addEventListener('touchend', panEnd);

			document.addEventListener('mousemove', pan);
			document.addEventListener('touchmove', pan);

			let zoom = function(e) {
				if (self.panEnabled) {
					if (e.deltaY > 0 && self.transform.scale < self.maxScale || e.deltaY < 0 && self.transform.scale > self.minScale) {
						// Scale calculations
						let currentScale = self.transform.scale || 1;
						let newScale = Math.max(currentScale + e.deltaY / 100, self.minScale);
						self.transform.scale = newScale;
					}
				}
			};

			let placeVisualizer = function(e) {
				let box = self.container.getBoundingClientRect();
				let visualizer = document.createElement('div');
				visualizer.className = 'visualizer';
				self.container.appendChild(visualizer);

				visualizer.style.left = ((e.clientX - box.x) / self.transform.scale) + 'px';
				visualizer.style.top = ((e.clientY - box.y) / self.transform.scale) + 'px';
			};

			setInterval(() => {
				self.applyTransform();
			}, 10)

			this.container.parentNode.addEventListener('wheel', zoom);
		}
	}

	// Rendering
	applyTransform() {
		this.container.style.transformOrigin = `${this.transform.origin.x}px ${this.transform.origin.y}px`;
		this.container.style.transform = `translate(${this.transform.translate.x}px, ${this.transform.translate.y}px) scale(${this.transform.scale})`;
	}

	render(container) {
		this.container = container || this.container;

		if (this.start && typeof this.start.render === 'function') {
			this.start.render(this.container);
			this.centerOnPoint(0, 0);
		}
	}

	// Positioning
	centerOnPoint(x, y) {
		if (this.container) {
			let box = this.container.parentNode.getBoundingClientRect();
			let centerX = box.width / 2 - x;
			let centerY = box.height / 2 - y;

			this.transform.translate = {
				x: centerX,
				y: centerY
			}

			this.applyTransform();
		}
	}

	// Worry about scaling later
	hexAtPoint(x, y) {
		let containerBox = this.container.getBoundingClientRect();
		let elements = document.elementsFromPoint((x * this.transform.scale) + containerBox.x, (y * this.transform.scale) + containerBox.y);

		if (elements && elements.length) {
			elements = elements.filter((e) => {
				return e.matches('.hex');
			});
		}

		return elements.length ? elements[0] : null;
	}

	getData() {
		return {
			background: this.background,
			start: this.start.getData()
		};
	}
}