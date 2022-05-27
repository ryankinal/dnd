var areas = {};
var currentElement = document.getElementById('1Ledge');

do {
	if (currentElement.id === 'Aftermath') {
		break;
	}

	if (currentElement.tagName === 'H3') {
		let number = parseInt(currentElement.id.replace(/[^\d]/g, ''));

		if (number) {
			currentHeader = currentElement;
			areas[currentElement.id] = {
				map: number >= 42 ? 1 : 0,
				coordinates: [0, 0],
				html: ''
			};	
		}
	}

	if (currentHeader.tagName === 'H3' && currentElement.outerHTML) {
		areas[currentHeader.id].html += currentElement.outerHTML;
	}
} while (currentElement = currentElement.nextSibling);