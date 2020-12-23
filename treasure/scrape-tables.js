var treasureData = {};
tables.forEach(function(t) {
	let titleElement = t.parentNode.previousElementSibling;

	console.log(titleElement.tagName);
	while (titleElement.tagName !== 'H4') {
		titleElement = titleElement.previousSibling;
	}
	let title = titleElement.innerText;
	let rows = Array.prototype.slice.call(t.querySelectorAll('tr'));

	if (treasureData[title]) {
		treasureData[title].push(rows.map(function(row) {
			let cells = Array.prototype.slice.call(row.querySelectorAll('td, th'));

			return cells.map(function(cell) {
				return cell.innerText;
			});
		}));
	} else {
		treasureData[title] = [rows.map(function(row) {
			let cells = Array.prototype.slice.call(row.querySelectorAll('td, th'));

			return cells.map(function(cell) {
				return cell.innerText;
			});
		})];	
	}
});