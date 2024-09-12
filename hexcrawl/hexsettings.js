import { Map } from './map.js';
import { Hex } from './hex.js';
import { Party } from './party.js';
import { config } from './config.js';

export class HexSettings {
	constructor(data) {
		this.map = null;
		this.hex = null;

		this.container = null;
		this.notesContainer = null;

		this.noteTypes = config.noteTypes;

		if (data) {
			if (data.map instanceof Map) {
				this.map = data.map;
			}

			if (data.container instanceof HTMLElement) {
				this.container = data.container;
			}

			if (data.notesContainer instanceof HTMLElement) {
				this.notesContainer = data.notesContainer;
			}
		}

		if (!this.map instanceof Map) {
			throw new Exception('map is required for hex settings interface');
		}
		
		if (!this.container instanceof HTMLDivElement) {
			throw new Exception('container is required for hex settings interface');
		}

		this.buttons = {
			notes: this.container.querySelector('.notes'),
			backgroundAdjust: this.container.querySelector('.background-position'),
			backgroundImage: this.container.querySelector('.background-image'),
			hide: this.container.querySelector('.hide'),
			party: this.container.querySelector('.party')
		};

		this.render();
		this.wireEvents();
	}

	render() {
		if (this.notesContainer) {
			let typeInput = this.notesContainer.querySelector('.note-type-input');
			let typeSelect = this.notesContainer.querySelector('.note-type-select');
			let typeOptions = this.notesContainer.querySelector('.note-type-options');

			typeInput.value = Object.keys(this.noteTypes)[0];

			Object.keys(this.noteTypes).forEach((type) => {
				let name = this.noteTypes[type].name;
				let icon = this.noteTypes[type].icon;

				let optionElem = document.createElement('div');
				let iconElem = document.createElement('div');
				let nameElem = document.createElement('div');
				
				optionElem.dataset.type = type;
				iconElem.innerHTML = `<i class="${icon}"></i>`;
				nameElem.innerHTML = name;

				optionElem.appendChild(iconElem);
				optionElem.appendChild(nameElem);
				typeOptions.appendChild(optionElem);

				if (typeInput.value === type) {
					typeSelect.innerHTML = optionElem.innerHTML;
				}
			});
		}
	}

	renderNotes() {
		let self = this;

		if (this.notesContainer) {
			let notes = Object.values(this.hex.notes || {});
			let notesOutput = this.notesContainer.querySelector('.content');

			notesOutput.innerHTML = '';

			if (notes.length === 0) {
				notesOutput.innerHTML = '<div class="no-content">No notes.</div>';
			} else {
				Object.values(notes).forEach((note) => {
					let div = document.createElement('div');
					div.className = 'note';
					div.dataset.noteId = note.id;

					let iconDiv = document.createElement('div');
					iconDiv.className = 'icon';

					let icon = document.createElement('i');
					icon.className = self.noteTypes[note.type].icon;
					iconDiv.appendChild(icon);

					let textDiv = document.createElement('div');
					textDiv.className = 'text';
					textDiv.innerHTML = note.text;

					div.appendChild(iconDiv);
					div.appendChild(textDiv);

					notesOutput.appendChild(div);
				});
			}
		}
	}

	wireEvents() {
		let self = this;

		self.container.addEventListener('click', (e) => {
			e.stopPropagation();
			return false;
		});

		window.hexcrawl.events.sub('hex.selected', (hex) => {
			if (hex !== self.hex) {
				self.buttons.backgroundAdjust.classList.remove('on');
				self.buttons.notes.classList.remove('on');
				
				if (hex.hidden) {
					self.buttons.hide.classList.add('on');
				} else {
					self.buttons.hide.classList.remove('on');
				}

				hex.allowBackgroundAdjust = false;
				self.map.panEnabled = true;
				self.hex = hex;
				self.renderNotes();
				self.show();
			}
		});

		window.hexcrawl.events.sub('hex.unselected', (hex) => {
			if (hex === self.hex) {
				self.hex.allowBackgroundAdjust = false;
				self.hex = null;
				self.buttons.backgroundAdjust.classList.remove('on');
				self.map.panEnabled = true;
				self.hide();
			}
		});

		if (this.buttons.backgroundAdjust) {
			this.buttons.backgroundAdjust.addEventListener('click', (e) => {
				if (self.hex) {
					if (!self.hex.allowBackgroundAdjust) {
						self.buttons.backgroundAdjust.classList.add('on');
						self.map.panEnabled = false;
						
						self.hex.startBackgroundAdjust();
					} else {
						self.buttons.backgroundAdjust.classList.remove('on');
						self.map.panEnabled = true;
						
						self.hex.confirmBackgroundAdjust();
					}
				}
			});

			document.addEventListener('keyup', (e) => {
				if (self.hex && self.hex.allowBackgroundAdjust) {
					if (e.code === 'Enter') {
						self.buttons.backgroundAdjust.classList.remove('on');
						self.map.panEnabled = true;
						self.hex.confirmBackgroundAdjust();
					} else if (e.code === 'Escape') {
						self.buttons.backgroundAdjust.classList.remove('on');
						self.map.panEnabled = true;
						self.hex.cancelBackgroundAdjust();
					}	
				}
			});
		}

		if (this.buttons.hide) {
			this.buttons.hide.addEventListener('click', () => {
				if (self.hex) {
					if (self.hex.hidden) {
						self.buttons.hide.classList.remove('on');
						self.hex.show();
					} else if (!self.hex.party) {
						self.hex.hide();
						self.buttons.hide.classList.add('on');
					}
				}
			});
		}

		if (this.buttons.notes) {
			this.buttons.notes.addEventListener('click', (e) => {
				if (self.notesContainer.matches('.hidden')) {
					self.notesContainer.classList.remove('hidden');
					self.buttons.notes.classList.add('on');
				} else {
					self.notesContainer.classList.add('hidden');
					self.buttons.notes.classList.remove('on');
				}
			});

			self.notesContainer.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			});

			document.body.addEventListener('click', () => {
				self.notesContainer.classList.add('hidden');
				self.buttons.notes.classList.remove('on');
			});
		}

		if (this.buttons.party) {
			this.buttons.party.addEventListener('click', function() {
				if (self.hex && self.map.parties) {
					let parties = Object.values(self.map.parties);

					if (parties && parties[0] instanceof Party) {
						parties[0].moveTo(self.hex);
						self.hex.removeAddInterface();
						self.hex.renderAddInterface();
					}
				}
			});
		}

		if (this.notesContainer) {
			let slides = this.notesContainer.querySelectorAll('.modal.notes > div');
			let typeInput = this.notesContainer.querySelector('.note-type-input');
			let typeSelect = this.notesContainer.querySelector('.note-type-select');
			let typeOptions = this.notesContainer.querySelector('.note-type-options');
			let noteInput = this.notesContainer.querySelector('.note-input');
			let addButton = this.notesContainer.querySelector('.add-note');
			let submitButton = this.notesContainer.querySelector('.submit');
			let cancelButton = this.notesContainer.querySelector('.cancel');

			addButton.addEventListener('click', (e) => {
				let notesBox = this.notesContainer.getBoundingClientRect();

				slides.forEach((slide) => {
					slide.style.transform = `translateX(${notesBox.width * -1}px)`;
				});

				e.stopPropagation();
				return false;
			});

			typeSelect.addEventListener('click', (e) => {
				if (typeOptions.style.display === 'block') {
					typeOptions.style.display = 'none';
				} else {
					typeOptions.style.display = 'block';
				}
				
				e.stopPropagation();
				return false;
			});

			document.body.addEventListener('click', (e) => {
				typeOptions.style.display = 'none';
			});

			typeOptions.querySelectorAll('.note-type-options > div').forEach((optionElem) => {
				optionElem.addEventListener('click', (e) => {
					let type = optionElem.dataset.type;
					typeInput.value = type;
					typeOptions.style.display = 'none';
					typeSelect.innerHTML = optionElem.innerHTML;
	
					e.stopPropagation();
					return false;
				});	
			});

			submitButton.addEventListener('click', (e) => {
				let note = {
					type: typeInput.value,
					text: noteInput.value
				};

				noteInput.value = '';

				if (self.hex) {
					self.hex.addNote(note);
					self.renderNotes();
				}

				slides.forEach((slide) => {
					slide.style.transform = 'translateX(0)';
				});

				e.stopPropagation();
			});

			cancelButton.addEventListener('click', (e) => {
				slides.forEach((slide) => {
					slide.style.transform = 'translateX(0)';
				});

				e.stopPropagation();
			});
		}
	}

	show() {
		if (this.container) {
			this.container.classList.remove('hidden')
		}
	}

	hide() {
		if (this.container) {
			this.container.classList.add('hidden');
		}
	}
};