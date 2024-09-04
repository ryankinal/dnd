import { Map } from './map.js';

export class Hex {
	constructor(data) {
		let self = this;


		// The map
		this.map = null;

		// This hex interface
		this.hidden = false;
		this.selected = false;
		this.backgroundAdjust = false;
		this.adjustingBackground = false;
		this.minBackgroundWidth = 500;
		this.maxBackgroundWidth = 15000;
		this.addInterface = false;
		this.element = false;
		this.background = {
			image: null,
			position: {
				x: 0,
				y: 0
			},
			scale: 1
		};
		this.diameter = 100;
		this.height = this.diameter * .86;
		this.x = this.diameter / 2 * -1;
		this.y = this.height / 2 * -1;

		// Surrounding hexes
		this.nw = null;
		this.n = null;
		this.ne = null;
		this.se = null;
		this.s = null;
		this.sw = null;
		this.positions = {
			nw: {
				x: (this.diameter - this.diameter / 4) * -1 - 1,
				y: (this.height / 2 * -1) - 1,
				opposite: 'se'
			},
			n: {
				x: 0,
				y: (this.height * -1) - 1,
				opposite: 's'
			},
			ne: {
				x: (this.diameter - this.diameter / 4) + 1,
				y: (this.height / 2 * -1) - 1,
				opposite: 'sw'
			},
			se: {
				x: (this.diameter - this.diameter / 4) + 1,
				y: (this.height / 2) + 1,
				opposite: 'nw'
			},
			s: {
				x: 0,
				y: (this.height) + 1,
				opposite: 'n'
			},
			sw: {
				x: (this.diameter - this.diameter / 4) * -1 - 1,
				y: (this.height / 2) + 1,
				opposite: 'ne'
			}
		};

		// SVG
		let hexCoords = [
			[.25, 0],
			[.75, 0],
			[1, .43],
			[.75, .86],
			[.25, .86],
			[0, .43]
		];

		hexCoords = hexCoords.map(function(set) {
			return [set[0] * self.diameter, set[1] * self.diameter].join(',');
		}).join(' ');

		this.svg = `url('data:image/svg+xml,<svg id="tile0_0" class="hex" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon class="hex"  points="${hexCoords}"></polygon></svg>')`

		if (data) {
			if (data.map instanceof Map) {
				this.map = data.map;
			}

			if (typeof data.background === 'object') {
				this.background = data.background;
			}

			if (data.nw instanceof Hex) {
				this.nw = new Hex(data.nw);
			}

			if (data.n instanceof Hex) {
				this.n = new Hex(data.n);
			}

			if (data.ne instanceof Hex) {
				this.ne = new Hex(data.ne);
			}

			if (data.se instanceof Hex) {
				this.se = new Hex(data.se);
			}

			if (data.s instanceof Hex) {
				this.s = new Hex(data.s);
			}

			if (data.sw instanceof Hex) {
				this.sw = new Hex(data.sw);
			}

			if (typeof data.x === 'number') {
				this.x = data.x;
			}

			if (typeof data.y === 'number') {
				this.y = data.y;
			}
		}
	}

	addNeighbor(position, data) {
		if (typeof this.positions[position] === 'object') {
			if (this[position] instanceof Hex) {
				this[position].show();
			} else {
				let positionData = this.positions[position];

				data = data || {};
				data.x = this.x + positionData.x,
				data.y = this.y + positionData.y
				data.map = this.map;

				data.background = Object.assign({}, this.background);
				data.background.position = {
					x: this.background.position.x - positionData.x,
					y: this.background.position.y - positionData.y
				};

				this[position] = new Hex(data);

				this[position].render(this.container);
			}
			
		}
	}

	render(container) {
		if (this.element) {
			return;
		}

		let self = this;

		let div = document.createElement('div');

		div.className = 'hex';
		div.style.maskImage = this.svg;
		div.style.left = this.x + 'px';
		div.style.top = this.y + 'px';
		div.style.width = this.diameter + 'px';
		div.style.height = (this.diameter * .86) + 'px';

		container.appendChild(div);

		Object.keys(this.positions).forEach((position) => {
			if (self[position]) {
				self[position].render(container);
			}
		});

		this.container = container;
		this.element = div;

		this.adjustBackground();
		this.wireEvents();
	}

	hide() {
		this.hidden = true;
		this.element.classList.add('hidden');
	}

	show() {
		this.hidden = false;
		this.element.classList.remove('hidden');
	}

	adjustBackground() {
		if (this.background) {
			if (this.background.image) {
				this.element.style.backgroundRepeat = 'no-repeat';
				this.element.style.backgroundImage = `url(${this.background.image})`;

				if (this.background.width && this.background.height) {
					this.element.style.backgroundSize = `${this.background.width}px ${this.background.height}px`;
				}

				if (this.background.position) {
					if (this.background.position.x && this.background.position.y) {
						this.element.style.backgroundPosition = `${this.background.position.x}px ${this.background.position.y}px`;
					}
				}
			}
		}
	}

	wireEvents() {
		let self = this;

		let hexClick = function(e) {
			if (!self.map.panning) {
				self.selected = true;
				self.element.classList.add('selected');
				self.renderAddInterface();
				hexcrawl.events.pub('hex.selected', self);
			}
			
			e.preventDefault();
			e.stopPropagation();
			return false;
		};

		let bodyClick = function(e) {
			if (self.selected && !self.backgroundAdjust) {
				self.removeAddInterface();
				hexcrawl.events.pub('hex.unselected', self);
				self.selected = false;
			}
		};

		this.element.addEventListener('click', hexClick);
		document.body.addEventListener('click', bodyClick);

		let adjustBackgroundSize = function(e) {
			if (self.backgroundAdjust) {
				let backgroundWidth = self.background.width;
				let backgroundHeight = self.background.height;

				if (backgroundWidth < self.maxBackgroundWidth && e.deltaY > 0 || backgroundWidth > self.minBackgroundWidth && e.deltaY < 0) {
					let heightRatio = backgroundHeight / backgroundWidth;
					backgroundWidth = Math.min(self.maxBackgroundWidth, backgroundWidth + (e.deltaY * 4));
					backgroundHeight = heightRatio * backgroundWidth;

					self.background.position.x = backgroundWidth * (self.background.position.x / self.background.width);
					self.background.position.y = backgroundHeight * (self.background.position.y / self.background.height);
					
					self.background.width = backgroundWidth;
					self.background.height = backgroundHeight;

					console.log(self.background.width, self.background.height);

					self.adjustBackground();
				}
			}
			
		};

		let adjustBackgroundPositionStart = function(e) {
			if (self.backgroundAdjust) {
				self.adjustingBackgroundPosition = true;
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		};

		let adjustBackgroundPositionEnd = function(e) {
			if (self.adjustingBackgroundPosition) {
				self.adjustingBackgroundPosition = false;
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		};

		let adjustBackgroundPosition = function(e) {
			if (self.adjustingBackgroundPosition) {
				self.background.position.x += e.movementX;
				self.background.position.y += e.movementY;

				self.adjustBackground();
			}
		};

		this.element.addEventListener('wheel', adjustBackgroundSize);
		this.element.addEventListener('mousedown', adjustBackgroundPositionStart);
		document.body.addEventListener('mousemove', adjustBackgroundPosition);
		document.body.addEventListener('mouseup', adjustBackgroundPositionEnd);

		window.hexcrawl.events.sub('hex.selected', (hex) => {
			if (hex !== self) {
				self.removeAddInterface();
			}
		});

		window.hexcrawl.events.sub('hex.unselected', () => {
			self.removeAddInterface();
		});
	}

	startBackgroundAdjust() {
		this.backgroundAdjust = true;
		this.backgroundAdjustUndo = JSON.parse(JSON.stringify(this.background));
	}

	confirmBackgroundAdjust() {
		this.backgroundAdjust = false;
		this.backgroundAdjustUndo = null;
	}

	cancelBackgroundAdjust() {
		this.background = this.backgroundAdjustUndo;
		this.backgroundAdjust = false;
		this.adjustBackground();
	}

	// Click handler to add neighboring hexes
	makeAddHandler(position) {
		let self = this;
		return function() {
			if (!self.map.panning) {
				self.removeAddInterface();
				self.addNeighbor(position);
			}
		}
	}

	// Remove
	renderAddInterface() {
		let self = this;

		if (this.container && (!this.addInterface || this.addInterface.length === 0)) {
			this.addInterface = [];

			Object.keys(this.positions).forEach((position) => {
				let positionData = self.positions[position];
				let newX = self.x + positionData.x;
				let newY = self.y + positionData.y;

				if (!self.map.hexAtPoint(newX + self.diameter / 2, newY + self.height / 2))
				{
					let div = document.createElement('div');

					div.innerHTML = '+';
					div.className = 'hex add';

					div.style.maskImage = self.svg;
					div.style.left = self.x + positionData.x + 'px';
					div.style.top = self.y + positionData.y + 'px';
					div.style.width = self.diameter + 'px';
					div.style.height = (self.diameter * .86) + 'px';
					
					self.container.appendChild(div);
					self.addInterface.push(div);

					div.addEventListener('click', self.makeAddHandler(position));
				}
			});
		}
	}

	removeAddInterface() {
		if (this.container && this.addInterface) {
			this.addInterface.forEach((div) => {
				div.parentNode.removeChild(div);
			})
			this.addInterface = null
		}
	}

	getData() {
		let data = {
			x: this.x,
			y: this.y,
			background: this.background,
		};

		Object.keys(this.positions).forEach((position) => {
			if (self[position]) {
				data[position] = self[position].getData();
			}
		});

		return data;
	}
}