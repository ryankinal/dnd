import { Hex } from './hex.js';

export class Map {
	constructor(data) {
		let self = this;
		this.fullMapElement = document.getElementById('fullMap');

		// Pan vars
		this.panEnabled = true;
		this.panStartCoordinates = null;
		this.panning = false;

		// Zoom vars
		this.minScale = 0.5;
		this.maxScale = 4.0;
		
		// Defaults
		this.container = null;
		this.hexes = null;
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

			if (typeof data.hexes === 'object') {
				this.hexes = {};

				Object.keys(data.hexes).forEach((key) => {
					let hex = new Hex(data.hexes[key]);
					hex.map = self;
					this.hexes[key] = hex;
				});
			}

			if (typeof data.container === 'object') {
				this.container = data.container;
			}
		}

		// Default hex location
		if (!this.hexes) {
			this.addHex({
				background: {
					image: this.background.image,
					position: {
						x: this.background.width / -2,
						y: this.background.height / -2
					},
					dimensions: this.background.dimensions
				}
			});
		}

		if (this.background.image) {
			this.fullMapElement.style.backgroundImage = `url(${this.background.image})`;
			this.fullMapElement.style.width = (this.background.width || 0) + 'px';
			this.fullMapElement.style.height = (this.background.height || 0) + 'px';

			if (this.hexes && Object.values(this.hexes).length) {
				let hex = Object.values(this.hexes)[0]
				let background = hex.background;
				let position = background.position;
				this.fullMapElement.style.backgroundSize = `${background.width}px ${background.height}px`;
				this.fullMapElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
				this.fullMapElement.style.transform = `translate(${position.x - hex.diameter / 2}px, ${position.y - hex.height / 2}px)`;
				
			}
		}
		this.wireEvents();
	}

	generateHexId() {
		return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
	}

	addHex(data) {
		let hex = null;
		this.hexes = this.hexes || {};

		if (data instanceof Hex) {
			hex = data;
		} else if (typeof data === 'object') {
			data.background = data.background || {};
			data.background.image = data.background.image || this.background.image;
			data.background.position = data.background.position || { x: 0, y: 0};
			data.background.width = data.background.width || this.background.width;
			data.background.height = data.background.height || this.background.height;

			hex = new Hex(data);
		}

		if (!hex.id) {
			hex.id = this.generateHexId();
		}
		
		hex.map = this;
		
		this.hexes[hex.id] = hex;

		return hex;
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
		let self = this;
		let x = 0;
		let y = 0;
		this.container = container || this.container;

		if (this.hexes) {0
			Object.keys(this.hexes).forEach((key) => {
				self.hexes[key].render(self.container);

				if (self.hexes[key].party) {
					let center = self.hexes[key].getCenterPoint();
					x = center.x;
					y = center.y;
				}
			})

			
			this.centerOnPoint(x, y);
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

	// is there a hex at this point?
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
		let hexData = {};
		let self = this;

		Object.keys(this.hexes).forEach((key) => {
			hexData[key] = self.hexes[key].getData();
		});

		return {
			background: this.background,
			hexes: hexData
		};
	}
}