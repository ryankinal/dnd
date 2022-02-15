/*
Todo:
* Edit/customize items
* Search inventory and available
* Filter available
* Saving
*/

import { Character } from './model/character.js' ;
import { items } from './data/inventory-data.js';

let blanketElem = document.querySelector('.blanket');
let modalClose = document.createElement('button');
modalClose.className = 'modal-close';
let modalCloseIcon = document.createElement('span');
modalCloseIcon.className = 'fa fa-times';
modalClose.append(modalCloseIcon);

// Steading elements
let steadingStatElements = {
	fortunes: document.querySelector('.stat-fortunes .slide'),
	surplus: document.querySelector('.stat-surplus .value'),
	size: document.querySelector('.stat-size .slide'),
	population: document.querySelector('.stat-population .slide'),
	prosperity: document.querySelector('.stat-prosperity .slide'),
	defenses: document.querySelector('.stat-defenses .slide')
};

// Inventory variables
let inventoryItemsList = document.querySelector('.inventory .items-list');
let smallItemCountElem = document.querySelector('.load-indicator .small-items .count');
let modalSmallItemCountElem = document.querySelector('.modal-load-indicator .small-items .count');
let smallItemMaxElem = document.querySelector('.load-indicator .small-items .max');
let modalSmallItemMaxElem = document.querySelector('.modal-load-indicator .small-items .max');
let editItemModal = document.querySelector('.item-edit-form');
let editItemSaveButton = editItemModal.querySelector('[name=edit-item-save-button]');
let editCategoryElem = document.querySelector('.item-edit-form [name=item-category]');

let character;
let inventory;
let smallItemCount = 0;
let load = 0;
let editIndex = null;

// Avaialable items variables
let categoryFilterElem = document.querySelector('[name="item-category-filter"]');
let availableItemsModal = document.querySelector('.available-items');
let availableItemsList = document.querySelector('.available-items .items-list');

let itemCategories = items.map(function(item) {
		return item.category;
	}).filter(function(category, index, self) {
		return self.indexOf(category) === index;
	});

function saveData() {
	let campaign = character.campaign.getData();
	campaign.steading = character.steading.getData();

	localStorage.setItem('stonetop-character', JSON.stringify(character.getData()));
	localStorage.setItem('stonetop-campaign', JSON.stringify(campaign));
}

function loadData() {
	let campaignData = localStorage.getItem('stonetop-campaign');
	let characterData = localStorage.getItem('stonetop-character');

	if (campaignData && characterData) {
		campaignData = JSON.parse(campaignData);
		characterData = JSON.parse(characterData);

		if (campaignData && characterData) {
			character = new Character(characterData, campaignData);
			inventory = character.getInventory();

			return true;	
		}
	}

	character = new Character();
	inventory = character.getInventory();
}

// Rendering functions
function renderItem(item, addRemove) {
	let container = document.createElement('div');
	container.className = 'item columns';

	let loadArray = new Array(item.load || 0);
	loadArray.fill('');

	let load = item.load ? loadArray.map(function(l) {
			return '<div class="big-item"></div>';
		}).join('') + ' ' : '';

	let tags = item.tags ? item.tags.map(function(t) {
			return `<span class="tag">${t}</span>`;
		}).join('') : '';

	let material = item.material ? `<span class="tag material">${item.material}</span>` : '';

	container.classList.add('item', 'columns');
	container.innerHTML = `<div class="column is-8">
					<h4>${load} ${item.name}</h4>
					<div class="tags">${material} ${tags}</div>
				</div>
				<div class="column is-2">
					<div class="label">Value</div>
					<div class="value">${item.value}</div>
				</div>`;

	let buttonContainer = document.createElement('div');
		buttonContainer.className = 'column is-2 text-center item-buttons';

	if (addRemove === 'add') {
		let addButton = document.createElement('button');
		addButton.className = 'button add-button';
	
		let addIcon = document.createElement('span');
		addIcon.className = 'fa fa-plus'

		addButton.addEventListener('click', function() {
			addItem(item);
		});

		addButton.appendChild(addIcon);
		buttonContainer.appendChild(addButton);
		container.appendChild(buttonContainer);
	} else if (addRemove === 'remove') {
		// Remove button
		let removeButton = document.createElement('button');
		removeButton.className = 'button add-button';
		
		let removeIcon = document.createElement('span');
		removeIcon.className = 'fa fa-trash';

		removeButton.addEventListener('click', function() {
			if (!container.classList.contains('removing')) {
				removeItem(item);

				container.classList.add('removing');
				setTimeout(function() {
					container.parentNode && container.parentNode.removeChild(container);

					if (character.getInventory().length === 0) {
						renderInventory();
					}
				}, 350);
			}
		});

		removeButton.appendChild(removeIcon);
		buttonContainer.appendChild(removeButton);

		// Edit button
		let editButton = document.createElement('button');
		editButton.className = 'button edit-button';

		let editIcon = document.createElement('span');
		editIcon.className = 'fa fa-pencil';

		editButton.addEventListener('click', function() {
			showEditModal(item);
		});

		editButton.appendChild(editIcon);
		buttonContainer.appendChild(editButton);

		container.appendChild(buttonContainer);
	}

	return container;
}

function renderInventory() {
	let fragment = document.createDocumentFragment();
	inventoryItemsList.innerHTML = '';
	inventory = character.getInventory();

	if (inventory && inventory.length) {
		inventory.forEach(function(item) {
			fragment.appendChild(renderItem(item, 'remove'));
		});

		inventoryItemsList.appendChild(fragment);
	} else {
		inventoryItemsList.innerHTML = '<div class="no-inventory">No inventory selected</div>';
	}
}

function renderItemCategories() {
	itemCategories.forEach(function(category) {
		let option = document.createElement('option');
		option.value = category;
		option.appendChild(document.createTextNode(category));
		
		categoryFilterElem.appendChild(option);
		editCategoryElem.appendChild(option.cloneNode(true));
	});
}

function renderAvailableItems(filters) {
	let fragment = document.createDocumentFragment();
	let currentCategory = false;
	filters = Object.assign({
			search: false,
			category: false
		}, filters);

	availableItemsList.innerHTML = '';


	let filteredItems = items.filter(function(item) {
		let searchMatches = filters.search ? item.name.indexOf(filters.search) >= 0 : true;
		let categoryMatches = filters.category ? item.category === filters.category : true;

		return searchMatches && categoryMatches;
	});

	if (filteredItems.length) {
		filteredItems.forEach(function(item) {
			if (item.category !== currentCategory) {
				let categoryContainer = document.createElement('h2');
				categoryContainer.className = 'available-item-category-header';

				categoryContainer.appendChild(document.createTextNode(item.category));
				fragment.appendChild(categoryContainer);

				currentCategory = item.category;
			}

			let itemContainer = renderItem(item, 'add');
			fragment.appendChild(itemContainer);
		});

		availableItemsList.appendChild(fragment);
	}
}

// Inventory management functions
function addItem(item) {
	let itemLoad = item.load || 0;
	let canAdd = false;


	if (item.load === 0) {
		canAdd = smallItemCount < character.getMaxSmallItems();
	} else if (typeof item.load === 'number') {
		canAdd = load + itemLoad <= 9;
	} else {
		canAdd = true;
	}

	if (canAdd) {
		let emptyItem = document.querySelector('.no-inventory');

		if (emptyItem) {
			emptyItem.parentNode.removeChild(emptyItem);
		}

		character.addInventory(item);
		inventoryItemsList.insertBefore(renderItem(item, 'remove'), inventoryItemsList.firstChild);
		load += itemLoad;

		if (item.load === 0) {
			smallItemCount++;
		}

		saveData();
	} else {
		// can't go over 9 load
	}
	
	updateLoadInterface();
}

function removeItem(item) {
	character.removeInventory(item);

	load -= item.load || 0;

	if (item.load === 0) {
		smallItemCount--;
	}

	saveData();
	updateLoadInterface();
}

function clearInventory() {
	character.clearInventory();
	saveData();
	renderItems();
}

function calculateLoad() {
	let inventory = character.getInventory();
	smallItemCount = 0;
	load = 0;

	inventory.forEach(function(item) {
		if (typeof item.load === 'number') {
			if (item.load === 0) {
				smallItemCount++;
			} else {
				load += item.load;
			}
		}
	});
}

function updateLoadInterface() {
	document.querySelectorAll('.load-indicator .big-items .big-item').forEach(function(elem, index) {
		if (index < load) {
			elem.classList.add('used');
		} else {
			elem.classList.remove('used');
		}
	});

	document.querySelectorAll('.modal-load-indicator .big-items .big-item').forEach(function(elem, index) {
		if (index < load) {
			elem.classList.add('used');
		} else {
			elem.classList.remove('used');
		}
	});

	smallItemCountElem.innerHTML = smallItemCount;
	modalSmallItemCountElem.innerHTML = smallItemCount;
	smallItemMaxElem.innerHTML = character.getMaxSmallItems();
	modalSmallItemMaxElem.innerHTML = character.getMaxSmallItems();
}

function updateSteadingInterface() {
	let steading = character.steading;

	steadingStatElements.fortunes.style.marginLeft = (steading.getStat('fortunes') + 3) * -100 + '%';
	steadingStatElements.surplus.innerHTML = steading.getStat('surplus');
	steadingStatElements.size.style.marginLeft = (steading.getStat('size') + 1) * -100 + '%';
	steadingStatElements.population.style.marginLeft = (steading.getStat('population') + 2) * -100 + '%';
	steadingStatElements.prosperity.style.marginLeft = (steading.getStat('prosperity') + 1) * -100 + '%';
	steadingStatElements.defenses.style.marginLeft = (steading.getStat('defenses') + 1) * -100 + '%';
}

function showEditModal(item) {
	editIndex = character.findItem(item);
	let inputs = editItemModal.querySelectorAll('[name^=item]');
	
	editItemModal.appendChild(modalClose);

	inputs.forEach(function(input) {
		let property = input.name.split(/\-/)[1];

		if (typeof item[property] !== 'undefined') {
			if (typeof item[property] === 'object' && item[property] && typeof item[property].join === 'function') {
				input.value = item[property].join(',');
			} else {
				input.value = item[property];
			}
		} else {
			input.value = '';
		}
	});

	blanketElem.classList.add('show');
	editItemModal.classList.add('show');
}

// Event listeners
function closeModals() {
	blanketElem.classList.remove('show');
	document.querySelectorAll('.modal.show').forEach(function(modal) {
		modal.classList.remove('show');
	});
	editIndex = null;
}

document.querySelector('[name=add-item]').addEventListener('click', function(e) {
	blanketElem.classList.add('show');
	availableItemsModal.classList.add('show');
	availableItemsModal.appendChild(modalClose);
});

editItemSaveButton.addEventListener('click', function() {
	if (typeof editIndex === 'number') {
		let item = {};

		editItemModal.querySelectorAll('[name^=item]').forEach(function(input) {
			let name = input.name ? input.name.split(/\-/)[1] : false,
				value = input.value ? input.value.replace(/(^\s|\s$)/g, '') : false;

			if (value) {
				if (name === 'tags') {
					value = value.split(/,/);
				} else if (value.match(/^\d+$/)) {
					value = parseInt(value);
				}

				item[name] = value;	
			}
		});

		character.setItem(editIndex, item);
		editIndex = null;

		closeModals();
		renderInventory();
		calculateLoad();
		updateLoadInterface();

		saveData();
	}
});

document.querySelector('[name=clear-items]').addEventListener('click', function() {
	document.querySelectorAll('.inventory .item').forEach(function(elem) {
		elem.classList.add('removing');
	});
	character.clearInventory();
	load = 0;
	smallItemCount = 0;
	updateLoadInterface();

	setTimeout(function() {
		renderInventory();
	}, 200);

	saveData();
});

document.addEventListener('click', function(e) {
	let target = e.target,
		button;
	
	if (target.tagName == 'BUTTON') {
		button = e.target;
	} else if (target.parentNode.tagName === 'BUTTON') {
		button = e.target.parentNode;
	}

	if (button) {
		button.classList.add('active');
		setTimeout(function() {
			button.classList.remove('active');
		}, 200);	
	}
});

document.querySelectorAll('.stat [name=decrease-stat]').forEach(function(statElem) {
	statElem.addEventListener('click', function() {
		let stat = statElem.dataset.stat;
		character.steading.decreaseStat(stat);	
		updateSteadingInterface();

		if (stat === 'prosperity' || stat == 'size') {
			updateLoadInterface();
		}

		saveData();
	});
});

document.querySelectorAll('.stat [name=increase-stat]').forEach(function(statElem) {
	statElem.addEventListener('click', function() {
		let stat = statElem.dataset.stat;
		character.steading.increaseStat(stat);	
		updateSteadingInterface();

		if (stat === 'prosperity' || stat == 'size') {
			updateLoadInterface();
		}

		saveData();
	})
});

blanketElem.addEventListener('click', closeModals);

modalClose.addEventListener('click', closeModals);

// Setup

loadData();
updateSteadingInterface();
renderInventory();
calculateLoad();
renderAvailableItems();
renderItemCategories();
updateLoadInterface();
