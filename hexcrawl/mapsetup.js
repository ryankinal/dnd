import { Map } from './map.js';

export class MapSetup {
	constructor(data) {
		data = data || {};

		this.positioningMap = null;

		this.mapContainer = null;
		this.container = null;
		this.inputs = {};
		this.buttons = {};

		if (data) {
			if (data.container instanceof HTMLDivElement) {
				this.container = data.container;
			}
	
			if (data.mapContainer instanceof HTMLDivElement) {
				this.mapContainer = data.container;
			}
		}
		

		if (this.container) {
			this.inputs.name = this.container.querySelector('#mapNameInput');
			this.inputs.image = this.container.querySelector('#mapImageInput');
			// this.inputs.gmPassword = this.container.querySelector('#gmPasswordInput');
			// this.inputs.gmPasswordConfirm = this.container.querySelector('#gmPasswordConfirm');
			// this.inputs.playerPassword = this.container.querySelector('#playerPasswordInput');
			// this.inputs.playerPasswordConfirm = this.container.querySelector('#playerPasswordConfirm');

			this.buttons.submit = this.container.querySelector('#setupSubmitButton');
			this.buttons.cancel = this.container.querySelector('#setupCancelButton');
		}

		this.wireEvents();
	}

	submit() {
		let self = this;
		let values = {}
		
		Object.keys(this.inputs).forEach((key) => {
			values[key] = self.inputs[key].value;
		});

		// API call to upload image
		// API call to create map with GM password and player password


		let image = document.createElement('img');
		image.className = 'fake-image-for-loading';
		image.src = values.image;
		document.body.appendChild(image);

		image.addEventListener('load', () => {
			let imageBox = image.getBoundingClientRect();
			image.parentNode.removeChild(image);

			let map = new Map({
				name: values.name,
				container: self.mapContainer,
				background: {
					image: values.image,
					width: imageBox.width,
					height: imageBox.height,
					x: imageBox.width / -2 - 50,
					y: imageBox.height / -2 - 43
				}
			});

			window.hexcrawl.events.pub('map.new', map);

			this.container.classList.add('hiding');
			setTimeout(() => { 
				self.container.classList.add('hidden');
			}, 200);

			map.panEnabled = false;
			map.transform.scale = map.maxScale;
			map.applyTransform();
		});
	}

	cancel() {
		let self = this;
		this.container.classList.add('hiding');

		setTimeout(() => { 
			self.container.classList.add('hidden');
		}, 200);
	}

	wireEvents() {
		let self = this;

		if (this.buttons.submit) {
			this.buttons.submit.addEventListener('click', () => {
				self.submit();
			})
		}

		if (this.buttons.cancel) {
			this.buttons.cancel.addEventListener('click', () => {
				self.cancel();
			})
		}
	}
}