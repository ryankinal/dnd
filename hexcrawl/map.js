import { Hex } from './hex.js';

export class Map {
	constructor(data) {
		let self = this;
		
		this.fullMapElement = document.createElement('div');
		this.fullMapElement.className = "full-map";
		this.positioningConfirmButton = null;

		// Hex selection vars
		this.allowHexSelection = false;

		// Background vars
		this.allowBackgroundAdjust = false;
		this.adjustingBackgroundPosition = false;
		this.minBackgroundWidth = 400;
		this.maxBackgroundWidth = 60000;
		
		// Pan vars
		this.panEnabled = true;
		this.panStartCoordinates = null;
		this.panning = false;

		// Zoom vars
		this.minScale = 0.2;
		this.maxScale = 4.0;
		
		// Defaults
		this.name = null;
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
			if (typeof data.name === 'string') {
				this.name = data.name;
			}

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

			let adjustBackgroundSize = function(e) {
				if (self.allowBackgroundAdjust) {
					let backgroundWidth = self.background.width;
					let backgroundHeight = self.background.height;
					let heightRatio = backgroundHeight / backgroundWidth;
					let hexes = Object.values(self.hexes);
					let hex = hexes && hexes.length ? hexes[0] : null;

					backgroundWidth = Math.max(self.minBackgroundWidth, Math.min(self.maxBackgroundWidth, backgroundWidth + (e.deltaY * 4)));
					backgroundHeight = heightRatio * backgroundWidth;
					
					if (hex) {
						hex.background.position.x = backgroundWidth * (hex.background.position.x / hex.background.width);
						hex.background.position.y = backgroundHeight * (hex.background.position.y / hex.background.height);
						hex.background.width = backgroundWidth;
						hex.background.height = backgroundHeight;
	
						hex.adjustBackground();
						self.alignBackgroundWithHex(hex);
					}
				}
			};
	
			let adjustBackgroundPositionStart = function(e) {
				if (self.allowBackgroundAdjust) {
					self.adjustingBackgroundPosition = true;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			};
	
			let adjustBackgroundPositionEnd = function(e) {
				if (self.adjustingBackgroundPosition) {
					if (self.positioningConfirmButton) {
						self.positioningConfirmButton.style.display = 'flex';
					}

					self.adjustingBackgroundPosition = false;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			};
	
			let adjustBackgroundPosition = function(e) {
				if (self.adjustingBackgroundPosition) {
					let hexes = Object.values(self.hexes);
					let hex = hexes && hexes.length ? hexes[0] : null;

					if (hex) {
						hex.background.position.x += e.movementX;
						hex.background.position.y += e.movementY;
		
						hex.adjustBackground();
					}

					if (self.positioningConfirmButton) {
						self.positioningConfirmButton.style.display = 'none';
					}

					self.background.x += e.movementX;
					self.background.y += e.movementY;

					self.adjustBackground();
				}
			};
	
			document.body.addEventListener('wheel', adjustBackgroundSize);
			document.body.addEventListener('mousedown', adjustBackgroundPositionStart);
			document.body.addEventListener('mousemove', adjustBackgroundPosition);
			document.body.addEventListener('mouseup', adjustBackgroundPositionEnd);

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
	applyTransform(animate) {
		let self = this;

		if (animate) {
			this.container.style.transition = 'all 0.2s ease-in';
		}

		this.container.style.transformOrigin = `${this.transform.origin.x}px ${this.transform.origin.y}px`;
		this.container.style.transform = `translate(${this.transform.translate.x}px, ${this.transform.translate.y}px) scale(${this.transform.scale})`;

		if (animate) {
			setTimeout(() => {
				self.container.style.transition = 'none';
			}, 200);
		}
	}

	adjustBackground() {
		let width = this.background.width || 0;
		let height = this.background.height || 0;
		let x = this.background.x || 0;
		let y = this.background.y || 0;

		this.fullMapElement.style.width = width + 'px';
		this.fullMapElement.style.height = width + 'px';
		this.fullMapElement.style.transformOrigin = `${width}px ${height}px`;
		this.fullMapElement.style.backgroundSize = `${width}px ${height}px`;
		this.fullMapElement.style.transform = `translate(${x}px, ${y}px)`;
	}

	alignBackgroundWithHex(hex) {
		console.log(hex.x, hex.y);

		this.background.x = hex.background.position.x + hex.x;
		this.background.y = hex.background.position.y + hex.y;
		this.background.width = hex.background.width;
		this.background.height = hex.background.height;

		// console.log(this.background);

		this.adjustBackground();
	}

	render(container) {
		let self = this;
		let x = 0;
		let y = 0;

		if (container instanceof HTMLDivElement) {
			this.container = container;
		}

		this.fullMapElement.style.backgroundImage = `url(${this.background.image})`;
		this.fullMapElement.style.width = (this.background.width || 0) + 'px';
		this.fullMapElement.style.height = (this.background.height || 0) + 'px';

		this.container.appendChild(this.fullMapElement);
			
		if (this.hexes) {
			if (Object.values(this.hexes).length) {
				let hex = Object.values(this.hexes)[0]
				let background = hex.background;
				let position = background.position;

				this.fullMapElement.style.backgroundSize = `${background.width}px ${background.height}px`;
				this.fullMapElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
				this.fullMapElement.style.transform = `translate(${position.x - hex.diameter / 2}px, ${position.y - hex.height / 2}px)`;
			}
			
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

		if (elements.length) {
			let element = elements[0];
			let id = element.dataset.id;

			if (this.hexes[id] instanceof Hex) {
				return this.hexes[id];
			}
		}

		return null;
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