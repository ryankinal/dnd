import { Hex } from './hex.js';

export class Map {
	constructor(data) {
		let self = this;

		this.start = null;
		this.image = null;
		this.container = null;
		this.imageScale = 1;
		this.imageDimensions = {
			width: 5355,
			height: 3775
		};
			
		if (data) {
			if (typeof data.image === 'string') {
				this.image = data.image;
			}

			if (typeof data.start === 'object') {
				data.start.background = data.start.background || {};
				data.start.background.image = data.start.background.image || this.image;
				data.start.background.position = data.start.background.position || [0, 0];
				data.start.background.scale = data.start.background.scale || 1;
				data.start.background.dimensions = data.start.background.dimensions || this.imageDimensions;
				data.start.map = this;

				this.start = new Hex(data.start);
			}

			if (typeof data.imageScale === 'number') {
				this.imageScale = data.imageScale;
			}
		}

		if (!this.start) {
			this.start = new Hex({
				background: {
					image: this.image,
					scale: this.imageScale,
					position: {
						x: -6642,
						y: -2486
					},
					dimensions: this.imageDimensions
				},
				map: this
			});
		}
	}

	// Rendering
	render(container) {
		this.container = container;

		if (this.start && typeof this.start.render === 'function') {
			this.start.render(container);
			this.centerOnPoint(0, 0);
		}
	}

	// Positioning
	centerOnPoint(x, y) {
		if (this.container) {
			let box = this.container.parentNode.getBoundingClientRect();
			let centerX = box.width / 2 - x;
			let centerY = box.height / 2 - y;

			this.container.style.transform = `translate(${centerX}px, ${centerY}px)`;
		}
	}

	// Worry about scaling later
	hexAtPoint(x, y) {
		let containerBox = this.container.getBoundingClientRect();
		let elements = document.elementsFromPoint(x + containerBox.x, y + containerBox.y);

		if (elements && elements.length) {
			elements = elements.filter((e) => {
				return e.matches('.hex');
			});
		}

		return elements.length ? elements[0] : null;
	}
}