import { Map } from './map.js';
import { Party } from './party.js';
import { config } from './config.js';
import { Id } from './id.js';
import { TouchHandler } from './touch.js';

export class Hex {
	constructor(data) {
		let self = this;

		this.noteTypes = config.noteTypes;
		this.touchHandler = new TouchHandler();
		this.touched = false;

		// The map
		this.map = null;
		this.party = null;

		// This hex interface
		this.hidden = false;
		this.selected = false;
		this.notes = {};
		this.allowBackgroundAdjust = false;
		this.adjustingBackground = false;
		this.backgroundAdjusted = false;
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
				x: (this.diameter - this.diameter / 4) * -1,
				y: (this.height / 2 * -1),
				opposite: 'se'
			},
			n: {
				x: 0,
				y: (this.height * -1),
				opposite: 's'
			},
			ne: {
				x: (this.diameter - this.diameter / 4),
				y: (this.height / 2 * -1),
				opposite: 'sw'
			},
			se: {
				x: (this.diameter - this.diameter / 4),
				y: (this.height / 2),
				opposite: 'nw'
			},
			s: {
				x: 0,
				y: (this.height),
				opposite: 'n'
			},
			sw: {
				x: (this.diameter - this.diameter / 4) * -1,
				y: (this.height / 2),
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

		this.mask = `url('data:image/svg+xml,<svg id="tile0_0" class="hex" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon class="hex"  stroke="rgba(0, 0, 0, 0)" stroke-width="3" points="${hexCoords}"></polygon></svg>')`;
		this.border = `url('data:image/svg+xml,<svg id="tile0_0" class="hex" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon class="hex"  stroke="black" stroke-width="1" fill="transparent" points="${hexCoords}"></polygon></svg>')`;
		this.selectedBorder = `url('data:image/svg+xml,<svg id="tile0_0" class="hex" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon class="hex"  stroke="blue" stroke-width="2" fill="transparent" points="${hexCoords}"></polygon></svg>')`;

		if (data) {
			if (typeof data.id === 'string') {
				this.id = data.id;
			}

			if (data.map instanceof Map) {
				this.map = data.map;
			}

			if (typeof data.background === 'object') {
				this.background = data.background;
			}

			if (data.party instanceof Party) {
				this.party = data.party;
				this.party.hex = this;
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

			if (typeof data.hidden === 'boolean') {
				this.hidden = data.hidden;
			}

			if (typeof data.notes === 'object') {
				this.notes = data.notes;
			}
		}
	}

	addNeighbor(position, data) {
		if (typeof this.positions[position] === 'object') {
			let hex = null;

			if (this[position] instanceof Hex) {
				hex = this[position];
				hex.show();
				hex.select();

				setTimeout(() => {
					this[position].select();
				}, 10);
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

				this.unselect();
				
				hex = this.map.addHex(data);
				this[position] = hex;

				hex.render(this.container);

				setTimeout(() => {
					hex.select();
				}, 10);
			}

			if (this.party) {
				this.party.moveTo(hex);
				this.renderIcons();	
			}
		}
	}

	render(container) {
		if (this.element || !container) {
			return;
		}

		let div = document.createElement('div');

		div.className = 'hex';
		div.style.maskImage = this.mask;
		div.style.left = this.x + 'px';
		div.style.top = this.y + 'px';
		div.style.width = this.diameter + 'px';
		div.style.height = (this.diameter * .86) + 'px';
		div.dataset.id = this.id;

		container.appendChild(div);

		this.container = container;
		this.element = div;

		this.renderIcons();
		this.adjustBackground();
		this.wireEvents();

		if (this.hidden) {
			this.hide();
		}
	}

	renderIcons() {
		let self = this;

		if (this.element instanceof HTMLElement) {
			this.element.innerHTML = '';

			let propertyIcons = {
				party: this.party && this.party.icon ? this.party.icon : 'fa-solid fa-location-pin',
				notes: config.noteTypes.note.icon,
				combat: config.noteTypes.combat.icon,
				social: config.noteTypes.social.icon,
				gm: config.noteTypes.secret.icon,
				target: 'fa-solid fa-expand'
			};
			
			let showIcons = {};
			let notesContainer = document.createElement('div');
			notesContainer.className = 'icons';

			if (this.map.allowBackgroundAdjust) {
				showIcons.target = true;
			} else {
				if (this.party) {
					showIcons.party = true;
				}
	
				if (this.notes) {
					let notes = Object.values(this.notes);
					showIcons.combat = notes.filter(n => n.type === 'combat').length;
					showIcons.social = notes.filter(n => n.type === 'social').length;
					showIcons.gm = notes.filter(n => n.type === 'secret').length;
					showIcons.notes = !showIcons.combat && !showIcons.social && notes.filter(n => n.type === 'note').length;
				}	
			}

			Object.keys(showIcons).forEach((key) => {
				if (showIcons[key]) {
					let div = document.createElement('div');
					div.className = `icon ${key}-icon`;

					let i = document.createElement('i');
					i.className = propertyIcons[key];
					div.appendChild(i);

					if (key === 'party' || key === 'target') {
						self.element.appendChild(div);
					} else {
						notesContainer.append(div);
						self.element.append(notesContainer);
					}
				}
			});
		}
	}

	hideIcons() {
		if (this.element) {
			this.element.querySelectorAll('.icon').forEach((icon) => {
				icon.classList.add('hidden');
			})
		}
	}

	showIcons() {
		if (this.element) {
			this.element.querySelectorAll('.icon').forEach((icon) => {
				icon.classList.remove('hidden')
			})
		}
	}

	hide() {
		if (!this.hidden) {
			this.hidden = true;

			if (this.map.triggerEvents) {
				hexcrawl.events.pub('hex.updated', this);
			}
		}
		
		if (this.element instanceof HTMLElement) {
			this.element.classList.add('hidden');
		}

		if (this.addInterface.length) {
			this.removeAddInterface();
		}
	}

	show() {
		if (this.hidden) {
			this.hidden = false;

			if (this.map.triggerEvents) {
				hexcrawl.events.pub('hex.updated', this);
			}
		}
		
		if (this.element instanceof HTMLElement) {
			this.element.classList.remove('hidden');
		}

		if (!this.addInterface.length) {
			this.renderAddInterface();
		}
	}

	adjustBackground() {
		if (this.background) {
			if (this.background.image) {
				let border = this.selected && !this.allowBackgroundAdjust ? this.selectedBorder : this.border;
				this.element.style.backgroundRepeat = 'no-repeat';
				this.element.style.backgroundImage = `${border}, url(${this.background.image})`;

				if (this.background.width && this.background.height) {
					this.element.style.backgroundSize = `contain, ${this.background.width}px ${this.background.height}px`;
				}

				if (this.background.position) {
					if (this.background.position.x && this.background.position.y) {
						this.element.style.backgroundPosition = `0 0, ${this.background.position.x}px ${this.background.position.y}px`;
					}
				}
			}
		}
	}

	select() {
		let self = this;

		if (this.map.allowHexSelection && !this.selected) {
			this.selected = true;
			this.element.classList.add('selected');

			if (this.map.triggerEvents) {
				hexcrawl.events.pub('hex.selected', this);
			}

			if (!this.hidden) {
				this.renderAddInterface();
				this.adjustBackground();
			}

			hexcrawl.hideStack.push({
				f: () => {
					if (self.selected && !self.map.panning && !self.allowBackgroundAdjust) {
						self.unselect();
					}
				}
			});
		}
	}

	unselect() {
		if (this.selected) {
			this.removeAddInterface();

			if (this.map.triggerEvents) {
				hexcrawl.events.pub('hex.unselected', this);
			}
			
			this.element.classList.remove('selected');
			this.selected = false;

			if (this.backgroundAdjusted) {
				this.confirmBackgroundAdjust();
			}

			this.adjustBackground();
		}
	}

	wireEvents() {
		let self = this;

		let hexClick = function(e) {
			self.select();
			e.preventDefault();
			e.stopPropagation();
			return false;
		};

		this.element.addEventListener('click', hexClick);

		let adjustBackgroundSize = function(delta) {
			if (self.allowBackgroundAdjust) {
				let backgroundWidth = self.background.width;
				let backgroundHeight = self.background.height;

				if (backgroundWidth < self.maxBackgroundWidth && delta > 0 || backgroundWidth > self.minBackgroundWidth && delta < 0) {
					let heightRatio = backgroundHeight / backgroundWidth;
					backgroundWidth = Math.min(self.maxBackgroundWidth, backgroundWidth + delta);
					backgroundHeight = heightRatio * backgroundWidth;

					let x = self.background.position.x - self.diameter / 2;
					let y = self.background.position.y - self.height / 2;
					let scale = backgroundWidth / self.background.width;

					self.background.position.x = x * scale + self.diameter / 2;
					self.background.position.y = y * scale + self.height / 2;
					
					self.background.width = backgroundWidth;
					self.background.height = backgroundHeight;

					self.backgroundAdjusted = true;
					self.adjustBackground();
				}
			}
		};

		let adjustBackgroundPositionStart = function(e) {
			if (self.allowBackgroundAdjust) {
				self.adjustingBackgroundPosition = true;
				return false;
			}
		};

		let adjustBackgroundPositionEnd = function(e) {
			if (self.adjustingBackgroundPosition) {
				self.adjustingBackgroundPosition = false;
				return false;
			}
		};

		let adjustBackgroundPosition = function(e) {
			if (self.adjustingBackgroundPosition) {
				self.background.position.x += e.movementX;
				self.background.position.y += e.movementY;

				self.backgroundAdjusted = true;
				self.adjustBackground();
			}
		};

		let wheel = function(e) {
			self.adjustBackgroundSize(e.deltaY * 4);
		};

		this.element.addEventListener('wheel', adjustBackgroundSize);
		this.element.addEventListener('mousedown', adjustBackgroundPositionStart);
		document.body.addEventListener('mousemove', adjustBackgroundPosition);
		document.body.addEventListener('mouseup', adjustBackgroundPositionEnd);

		let pinch = function(e) {
			adjustBackgroundSize(e.delta * 8);
		};

		this.touchHandler.pinch(document.body, pinch);

		this.touchHandler.touchMove(this.element, adjustBackgroundPosition, adjustBackgroundPositionStart, adjustBackgroundPositionEnd);

		window.hexcrawl.events.sub('hex.selected', (hex) => {
			if (hex !== self) {
				self.unselect();
			}
		});
	}

	startBackgroundAdjust() {
		this.element.classList.remove('selected');
		this.allowBackgroundAdjust = true;
		this.backgroundAdjustUndo = JSON.parse(JSON.stringify(this.background));
		this.removeAddInterface();
		this.adjustBackground();
	}

	confirmBackgroundAdjust() {
		this.allowBackgroundAdjust = false;
		this.backgroundAdjustUndo = null;

		this.map.alignBackgroundWithHex(this);

		if (this.map.triggerEvents) {
			hexcrawl.events.pub('hex.updated', this);
		}
		
		if (this.selected) {
			this.element.classList.add('selected');
			this.renderAddInterface();
		}
	}

	cancelBackgroundAdjust() {
		this.background = this.backgroundAdjustUndo;
		this.allowBackgroundAdjust = false;
		this.backgroundAdjusted = false;
		this.adjustBackground();

		if (this.selected) {
			this.element.classList.add('selected');
			this.renderAddInterface();
		}
	}

	// Click handler to add neighboring hexes
	makeAddHandler(position) {
		let self = this;
		return function() {
			if (!self.map.panning) {
				self.addNeighbor(position);
			}
		}
	}

	renderAddInterface() {
		let self = this;

		if (this.container && (!this.addInterface || this.addInterface.length === 0)) {
			this.addInterface = [];

			Object.keys(this.positions).forEach((position) => {
				let positionData = self.positions[position];
				let newX = self.x + positionData.x;
				let newY = self.y + positionData.y;
				let hex = self.map.hexAtPoint(newX + self.diameter / 2, newY + self.height / 2);
				self[position] = hex;

				if (hex) {
					self[position] = hex;
				}
				
				if (!hex || (!self.map.gmView && hex.hidden) || this.party) {
					let div = document.createElement('div');
					let icon = document.createElement('i');

					if (self.party) {
						icon.className = 'party-icon fa-solid fa-location-pin';
					} else {
						icon.innerHTML = '+';
					}

					div.appendChild(icon);
					div.className = 'hex add';

					if (hex && !hex.hidden) {
						div.classList.add('overlaid');
					}

					div.style.maskImage = self.mask;
					div.style.backgroundImage = this.border;
					div.style.left = self.x + positionData.x + 'px';
					div.style.top = self.y + positionData.y + 'px';
					div.style.width = self.diameter + 'px';
					div.style.height = (self.diameter * .86) + 'px';
					
					self.container.appendChild(div);
					self.addInterface.push(div);

					let addHandler = self.makeAddHandler(position);

					div.addEventListener('click', addHandler);
				}
			});
		}
	}

	removeAddInterface() {
		if (this.container && this.addInterface) {
			this.addInterface.forEach((div) => {
				div.parentNode.removeChild(div);
			})
			this.addInterface = []
		}
	}

	getCenterPoint() {
		return {
			x: this.x + this.diameter / 2,
			y: this.y + this.height / 2
		}
	}

	contains(x, y) {
		return x > this.x && x < this.x + this.diameter && y > this.y && y < this.y + this.height;
	}

	addNote(note) {
		let id = Id.generate();
		note.id = id;
		note.hex = this;

		this.notes[id] = note;
		this.renderIcons();

		if (this.map.triggerEvents) {
			hexcrawl.events.pub('hex.note.created', note);
		}
	}

	getData() {
		let data = {
			id: this.id,
			x: this.x,
			y: this.y,
			background: this.background,
			notes: this.notes,
			party: this.party ? this.party.getData() : null
		};

		return data;
	}
}