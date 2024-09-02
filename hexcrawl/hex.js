export class Hex {
	constructor(data) {
		let self = this;

		this.addInterface = false;
		this.element = false;
		this.map = null;		
		this.background = {
			image: null,
			position: {
				x: 0,
				y: 0
			},
			scale: 1
		};

		this.nw = null;
		this.n = null;
		this.ne = null;
		this.se = null;
		this.s = null;
		this.sw = null;

		this.diameter = 100;
		this.height = this.diameter * .86;
		this.x = this.diameter / 2 * -1;
		this.y = this.height / 2 * -1;

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
			if (typeof data.map === 'object') {
				this.map = data.map;
			}

			if (typeof data.background === 'object') {
				this.background = data.background;
			}

			if (typeof data.nw === 'object') {
				this.nw = new Hex(data.nw);
			}

			if (typeof data.nw === 'object') {
				this.n = new Hex(data.n);
			}

			if (typeof data.nw === 'object') {
				this.ne = new Hex(data.ne);
			}

			if (typeof data.nw === 'object') {
				this.se = new Hex(data.se);
			}

			if (typeof data.nw === 'object') {
				this.s = new Hex(data.s);
			}

			if (typeof data.nw === 'object') {
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

		if (this.background) {
			if (this.background.image) {
				div.style.backgroundRepeat = 'no-repeat';
				div.style.backgroundImage = `url(${this.background.image})`;

				if (this.background.scale) {
					div.style.backgroundSize = `${this.background.scale * this.background.dimensions.width}px ${this.background.scale * this.background.dimensions.height}px`;
				}

				if (this.background.position) {
					if (this.background.position.x && this.background.position.y) {
						div.style.backgroundPosition = `${this.background.position.x}px ${this.background.position.y}px`;
					}
				}
			}
		}

		container.appendChild(div);

		div.addEventListener('click', (e) => {
			self.renderAddInterface();
			e.preventDefault();
			e.stopPropagation();
			return false;
		})

		document.body.addEventListener('click', (e) => {
			self.removeAddInterface();
		})

		Object.keys(this.positions).forEach((position) => {
			if (self[position]) {
				self[position].render(container);
			}
		});

		this.container = container;
		this.element = div;
	}

	removeAddInterface() {
		if (this.container && this.addInterface) {
			this.addInterface.forEach((div) => {
				div.parentNode.removeChild(div);
			})
			this.addInterface = null
		}
	}

	makeAddHandler(position) {
		let self = this;
		return function() {
			self.removeAddInterface();
			self.addNeighbor(position);
		}
	}

	renderAddInterface() {
		let self = this;

		if (this.container && (!this.addInterface || this.addInterface.length === 0)) {
			this.addInterface = [];

			Object.keys(this.positions).forEach((position) => {
				if (!self[position]) {
					let boundingBox = self.element.getBoundingClientRect();
					let positionData = self.positions[position];
					let newX = self.x + positionData.x;
					let newY = self.y + positionData.y;

					if (!self.map.hexAtPoint(newX + boundingBox.width / 2, newY + self.height / 2))
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
				}
			});
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
	}
}