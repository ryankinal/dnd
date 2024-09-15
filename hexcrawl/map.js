import { Id } from './id.js';
import { Hex } from './hex.js';
import { Party } from './party.js';
import { visualizers } from './visualizers.js';

export class Map {
	constructor(data) {
		let self = this;
		
		this.fullMapElement = document.createElement('div');
		this.fullMapElement.className = "full-map";
		this.positioningConfirmButton = null;

		// Hex selection vars
		this.addArbitraryHex = false;
		this.allowHexSelection = false;
		this.parties = {};

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

			if (typeof data.parties === 'object') {
				this.parties = {};

				Object.keys(data.parties).forEach((key) => {
					let party = new Party(data.parties[key]);
					self.parties[party.id] = party;

					if (data.parties[key].hex && data.parties[key].hex.id) {
						party.moveTo()
					}
				});
			}
		}

		// Default hex location
		if (!this.hexes) {
			let party = new Party({
				name: 'The Party'
			});	

			this.parties[party.id] = party;
		
			let hex = this.addHex({
				party: party,
				background: {
					image: this.background.image,
					position: {
						x: this.background.width / -2,
						y: this.background.height / -2
					},
					dimensions: this.background.dimensions
				}
			});

			party.hex = hex;
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

	addHex(data) {
		let hex = null;
		let event = 'hex.updated';

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
			hex.id = Id.generate();
			event = 'hex.created';
		}
		
		hex.map = this;
		this.hexes[hex.id] = hex;

		hexcrawl.events.pub(event, hex);

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
					let x = e.clientX;
					let y = e.clientY;

					if (x && y && Math.abs(x - self.panStartCoordinates.x) > 5 || Math.abs(y - self.panStartCoordinates.y) > 5) {
						self.panning = true;

						self.transform.translate.x += (e.movementX);
						self.transform.translate.y += (e.movementY);

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
						let box = self.container.parentNode.getBoundingClientRect();

						// Scale calculations
						let currentScale = self.transform.scale || 1;
						let newScale = Math.max(currentScale + e.deltaY / 100, self.minScale);
						self.transform.scale = newScale;

						self.applyTransform();
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
					self.adjustingBackgroundPosition = {
						x: e.clientX,
						y: e.clientY
					};

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

					self.adjustingBackgroundPosition = null;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			};
	
			let adjustBackgroundPosition = function(e) {
				if (self.adjustingBackgroundPosition) {
					let xDiff = Math.abs(self.adjustingBackgroundPosition.x - e.clientX);
					let yDiff = Math.abs(self.adjustingBackgroundPosition.y - e.clientY);

					if (xDiff > 0 || yDiff > 0) {
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
				}
			};
	
			document.body.addEventListener('wheel', adjustBackgroundSize);
			document.body.addEventListener('mousedown', adjustBackgroundPositionStart);
			document.body.addEventListener('mousemove', adjustBackgroundPosition);
			document.body.addEventListener('mouseup', adjustBackgroundPositionEnd);

			this.container.parentNode.addEventListener('wheel', zoom);

			this.fullMapElement.addEventListener('click', (e) => {
				if (self.addArbitraryHex) {
					let x = e.clientX;
					let y = e.clientY;
					let box = self.container.getBoundingClientRect();
					let hexes = Object.values(self.hexes);
					let translatedX = (x - box.x) / self.transform.scale;
					let translatedY = (y - box.y) / self.transform.scale;

					if (hexes && hexes.length) {
						let hex = hexes[0];
						let newHex = new Hex({
							x: hex.x,
							y: hex.y,
							background: Object.assign({}, hex.background)
						});
						
						let xDirection = '';
						let yDirection = '';

						if (translatedY > newHex.y + newHex.height) {
							yDirection = 's';
						} else {
							yDirection = 'n';
						}
						
						if (translatedX > newHex.x + newHex.diameter) {
							xDirection = 'e';
						} else if (translatedX < newHex.x) {
							xDirection = 'w';
						}

						while (!newHex.contains(translatedX, translatedY)) {
							let x = newHex.x + newHex.positions[yDirection + xDirection].x;
							let y = newHex.y + newHex.positions[yDirection + xDirection].y;
							let background = hex.background();

							newHex = self.addHex({
								x: x,
								y: y,
								background: background
							});

							if (translatedY > newHex.y + newHex.height) {
								yDirection = 's';
							} else {
								yDirection = 'n';
							}
							
							if (translatedX > newHex.x + newHex.diameter) {
								xDirection = 'e';
							} else if (translatedX < newHex.x) {
								xDirection = 'w';
							} else {
								xDirection = '';
							}
						}

						newHex.render(hex.container);
					}
				}
			});
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

		hexcrawl.events.pub('map.updated', this);
	}

	alignBackgroundWithHex(hex) {
		this.background.x = hex.background.position.x + hex.x;
		this.background.y = hex.background.position.y + hex.y;
		this.background.width = hex.background.width;
		this.background.height = hex.background.height;

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
	centerOnHex(hex, animate) {
		let center = hex.getCenterPoint();

		if (center) {
			this.transform.scale = 2;
			this.centerOnPoint(center.x, center.y, animate);
		}
	}

	centerOnPoint(x, y, animate) {
		if (this.container) {
			let box = this.container.parentNode.getBoundingClientRect();
			let centerX = box.width / 2 - x * this.transform.scale;
			let centerY = box.height / 2 - y * this.transform.scale;

			this.transform.origin = {
				x: 0,
				y: 0
			};

			this.transform.translate = {
				x: centerX,
				y: centerY
			}

			this.applyTransform(animate);
		}
	}

	scalePoint(x, y, target) {
		target = target || 'map';

		let box = this.container.parentNode.getBoundingClientRect();
		let newX = x;
		let newY = y;

		if (target === 'viewport') {
			newX = box.width / 2 - x / this.transform.scale;
			newY = box.height / 2 - y / this.transform.scale;
		} else if (target === 'map') {
			newX = box.width / 2 - x * this.transform.scale;
			newY = box.height / 2 - y * this.transform.scale;
		}

		return {
			x: newX,
			y: newY
		};
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
		let self = this;
		let hexData = {};
		let partyData = {};
		
		Object.keys(this.hexes).forEach((key) => {
			hexData[key] = self.hexes[key].getData();
		});

		Object.keys(this.parties).forEach((key) => {
			partyData[key] = self.parties[key].getData();
		})

		return {
			background: this.background,
			hexes: hexData,
			parties: partyData
		};
	}
}