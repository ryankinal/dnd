(function () {
	let tableOutput = document.getElementById('tableOutput');
	let tableTopButton = document.createElement('button');
	tableTopButton.innerHTML = '<span class="fas fa-arrow-up"></span>';
	tableTopButton.className = 'table-top';

	function rollDice(str) {
		let parts = str.replace(/,/g, '').matchAll(/(\d+)?d(\d+)([+-])?(\d+)?\s*x?\s*(\d+)?/ig).next();

		if (parts && parts.value && parts.value[2]) {
			let amount = typeof parts.value[1] === 'undefined' ? 1 : parseInt(parts.value[1]);
			let size = parseInt(parts.value[2]);
			let operator = typeof parts.value[3] === 'undefined' ? '+' : parts.value[3];
			let modifier = typeof parts.value[4] === 'undefined' ? 0 : parseInt(parts.value[4]);
			let multiplier = typeof parts.value[5] === 'undefined' ? 1 : parseInt(parts.value[5]);
			let total = 0;

			for (let i = amount; i > 0; i--) {
				let roll = Math.floor(Math.random() * size) + 1;

				if (operator === '+') {
					roll += modifier;
				} else {
					roll -= modifier;
				}
				
				total += roll;
			}

			return total * multiplier;
		}

		return false;
	}

	function getTableTitle(table) {
		return treasureTableNames.filter(function(n) {
			return n.toLowerCase() === table;
		}).map(function(n) {
			return n.replace(/ gp/, 'gp');
		}).join('');
	}

	function renderTable(name) {
		let data = treasureTables[name];

		if (data) {
			let title = getTableTitle(name);

			let header = document.createElement('h2');
			header.appendChild(document.createTextNode(title));
			header.className = treasureClasses[name];

			let tableSlider = document.createElement('div');
			tableSlider.className = 'slider';

			let viewButton = document.createElement('a');
			viewButton.className = 'view-button fas fa-chevron-down';
			viewButton.setAttribute('data-table-name', name);
			header.appendChild(viewButton);

			viewButton.addEventListener('click', function() {
				if (tableSlider.style.maxHeight === '2px') {
					tableSlider.style.maxHeight = tableSlider.dataset.prevMaxHeight;
					viewButton.classList.remove('fa-chevron-up');
					viewButton.classList.add('fa-chevron-down');
					header.classList.remove('closed');
					

					setTimeout(function() {
						tableSlider.style.transitionDuration = '0';
						tableSlider.style.maxHeight = 'max-content';
						tableSlider.classList.remove('closed');
					}, 300);
				} else {
					let tableHeight = tableSlider.getBoundingClientRect().height + 'px';

					tableSlider.style.transitionDuration = '0';
					tableSlider.style.maxHeight = tableHeight;

					setTimeout(function() {
						tableSlider.style.transitionDuration = '.5s';
						tableSlider.style.maxHeight = '2px';
						tableSlider.classList.add('closed');	
					}, 15);

					tableSlider.setAttribute('data-prev-max-height', tableHeight);
					viewButton.classList.remove('fa-chevron-down');
					viewButton.classList.add('fa-chevron-up');
					
				}
			});

			data.forEach(function(t) {
				let table = document.createElement('table');
				table.className = treasureClasses[name] + ' full-table';

				t.forEach(function(r, i) {
					let row = document.createElement('tr');

					r.forEach(function(c, j) {
						let dieMatches = c.matchAll(/(\d+)?d(\d+)([+-])?(\d+)?(\s*x\s*[\d,]+)?(\s*\([\d,]+\))?/ig);
						let match = dieMatches.next();
						let toReplace = {};

						let cell = document.createElement(i === 0 ? 'th' : 'td');

						if (j > 0) {
							cell.className = 'result';
						}

						if (i > 0 && j > 0 && (name.indexOf('magic') >= 0 || name.indexOf("wondrous power") >= 0))
						{
							linkText = '<a href="https://www.dndbeyond.com/search?q=' + c + '" target="_blank">';
							c = '<div class="result-text">' + linkText + c + ' <span class="fas fa-external-link-alt"></span></a></div>';
						}
						else
						{
							do {
								if (match.value) {
									let fullMatch = match.value[0];
									let linkText = '<a class="rollable" data-dice-string="' + fullMatch + '" title="' + fullMatch + '"><span class="dice-string">' + fullMatch + '</span> <span class="fas fa-dice"></a>';
									toReplace[fullMatch] = linkText;
									match = dieMatches.next();
								} else {
									break;
								}
							} while (match && !match.done);

							let tableMatches = c.matchAll(new RegExp('(' + Object.keys(treasureTables).join('|') + ')', 'ig'));
							match = tableMatches.next();

							do {
								if (match.value) {
									let fullMatch = match.value[0];
									let lowerMatch = fullMatch.toLowerCase();
									let linkText = '<a class="table-reference" data-table-name="' + lowerMatch + '" title="' + fullMatch + '">' + fullMatch + ' <span class="fas fa-table"></a>';
									toReplace[fullMatch] = linkText;
									match = tableMatches.next();
								} else {
									break;
								}
							} while (match && !match.done);

							Object.keys(toReplace).forEach(function(k) {
								c = c.replace(k, toReplace[k]);
							});
						}
						
						cell.innerHTML = c;

						if (i > 0 && j > 0 && name.indexOf('challenge') < 0)
						{
							let detailsLink = document.createElement('a');
							detailsLink.innerHTML = '<span class="fas fa-dice"> random details';
							detailsLink.className = 'details-link';
							addDetailHandler(detailsLink, cell);
							
							let linksDiv = document.createElement('div');
							linksDiv.appendChild(detailsLink);

							cell.appendChild(linksDiv);
						}
						
						row.appendChild(cell);
					});

					table.appendChild(row);
				});

				tableSlider.appendChild(table);
			});

			tableOutput.appendChild(header);
			tableOutput.appendChild(tableSlider);
		}
	}

	function rollOnTable(name, render) {
		render = (typeof render === 'undefined' ? false : render);

		let data = treasureTables[name];
		let results = {};
		let moreToRoll = [];

		results[name] = [];

		if (data)
		{
			data.forEach(function(table) {
				let units = table[0];
				let die = table[0][0].replace(/(^\s+|\s+$)/g, '');
				let tableRoll = die && die.length ? rollDice(die) : 1;

				if (tableRoll)
				{
					let range = [0, 0];
					let i = 1;
					let row = [];

					while (i < table.length && (tableRoll < range[0] || tableRoll > range[1]))
					{
						row = table[i];
						range = row[0].split(/-/).map(function(n) { 
							return parseInt(n);
						})

						if (range.length === 1) {
							range.push(range[0]);
						}

						i++;
					}

					let j = 1;
					let rowResult = [];
					let referencedTables = [];

					while (j < row.length)
					{
						let unit = units[j];

						if (unit.toLowerCase() === 'gems or art objects')
						{
							let matches = row[j].matchAll(/(\d*d\d+(?:[+-]\d+)?)\s*\([\d,]+\)\s*([\d,]+ gp (?:gems?|art objects))/ig);
							let match = matches.next();

							while (match && !match.done)
							{
								let die = match.value[1];
								let table = match.value[2];
								let roll = 1;

								if (die && die.toLowerCase() !== 'once')
								{
									roll = rollDice(die);
								}

								for (let i = 0; i < roll; i++)
								{
									moreToRoll.push(table);
								}

								match = matches.next();

								rowResult.push(roll + ' ' + table.replace(/ gp/, 'gp'));

								if (referencedTables.indexOf(table.toLowerCase()) < 0) {
									referencedTables.push(table.toLowerCase());
								}
							}
						}
						else if (row[j].match(/roll (?:\d*d\d+ times|once) on/i))
						{
							let parts = row[j].split(/\s+and\s+/g);

							parts.forEach(function(part) {
								let refTables = part.matchAll(/(\d*d\d+ times|once) on ([\w\s]+)/gi);
								let match = refTables.next();

								while (match && !match.done)
								{
									let die = match.value[1];
									let table = match.value[2];
									let roll = 1;

									if (die && die.toLowerCase() !== 'once')
									{
										roll = rollDice(die);
									}

									for (let i = 0; i < roll; i++)
									{
										moreToRoll.push(table.toLowerCase());
									}

									match = refTables.next();

									rowResult.push('Roll ' + (roll === 1 ? 'once' : roll + ' times') + ' on ' + table);

									if (referencedTables.indexOf(table.toLowerCase()) < 0) {
										referencedTables.push(table.toLowerCase());
									}
								}
							});
							
						}
						else
						{
							if (row[j] !== '-')
							{
								let roll = rollDice(row[j]);

								if (roll !== false)
								{
									rowResult.push(new Intl.NumberFormat().format(roll) + unit.toLowerCase());
								}
								else if (name.indexOf('magic') >= 0 || name.indexOf("wondrous power") >= 0)
								{
									let linkText = '<a href="https://www.dndbeyond.com/search?q=' + row[j] + '" target="_blank">';
									rowResult.push(linkText + row[j] + ' <span class="fas fa-external-link-alt"></span></a>');
								}
								else
								{
									rowResult.push(row[j]);
								}
							}
						}
						j++;
					}

					results[name].push({
						roll: table.length <= 2 ? '*' : tableRoll,
						result: (rowResult.length ? rowResult.join('; ') : 'nothing'),
						referencedTables: referencedTables
					});
				}
			});

			let refTable = null;
			while (refTable = moreToRoll.shift())
			{
				let refResult = rollOnTable(refTable);
				let refTableResult = refResult[refTable][0];

				if (results[refTable])
				{
					results[refTable].push(refTableResult);
				}
				else
				{
					results[refTable] = [refTableResult];
				}
			}
		}

		if (render)
		{
			let out = document.getElementById('tableOutput');
			out.innerText = '';
			out.appendChild(buildResultHTML(name, results));
		}

		return results;
	}

	function addDetailHandler(link, cell)
	{
		link.addEventListener('click', function() {
			["who created it or was intended to use it?",
			"what is a detail from its history?",
			"what minor property does it have?",
			"what quirk does it have?"].forEach(function(table) {
				let tableResult = rollOnTable(table)[table][0].result;
			
				let detailDiv = document.createElement('div');
				detailDiv.className = 'detail';

				let rerollLink = document.createElement('a');
				rerollLink.className = 'fas fa-dice';
				rerollLink.addEventListener('click', function() {
					text.style.visibility = 'hidden';
					rerollLink.classList.add('fa-spin');

					setTimeout(function() {
						let tableResult = rollOnTable(table)[table][0].result;
						text.innerHTML = tableResult;
						text.style.visibility = 'visible';
						rerollLink.classList.remove('fa-spin');
					}, 250);
				});

				let label = document.createElement('b');
				label.appendChild(rerollLink);
				label.appendChild(document.createTextNode(' ' + getTableTitle(table)));

				let text = document.createElement('div');
				text.innerText = tableResult;

				detailDiv.appendChild(label);
				detailDiv.appendChild(text);

				cell.appendChild(detailDiv);
			});
			
			link.remove();
		});
	}

	function buildResultHTML(table, result)
	{
		let currentLevel = result[table];

		if (currentLevel)
		{
			let referencedTables = [];

			let rows = currentLevel.map(function(r) {
				let roll = (r.roll === 'none' ? 'n/a' : r.roll);
				referencedTables = referencedTables.concat(r.referencedTables);

				let rollCell = document.createElement('td');
				rollCell.appendChild(document.createTextNode(r.roll));
				rollCell.className = 'roll';

				let resultDiv = document.createElement('div');
				resultDiv.innerHTML = r.result;
				resultDiv.className = 'result-text';

				let resultCell = document.createElement('td');
				resultCell.appendChild(resultDiv);
				resultCell.className = 'result';

				let rowElement = document.createElement('tr');
				rowElement.appendChild(rollCell);
				rowElement.appendChild(resultCell);

				if (table.indexOf('challenge') < 0)
				{
					let detailsLink = document.createElement('a');
					detailsLink.innerHTML = '<span class="fas fa-dice"> random details';
					detailsLink.className = 'details-link';
					addDetailHandler(detailsLink, resultCell);
					
					let linksDiv = document.createElement('div');
					linksDiv.appendChild(detailsLink);

					resultCell.appendChild(linksDiv);
				}
				
				return rowElement;
			});

			let title = getTableTitle(table);

			if (title.toLowerCase().indexOf('challenge') < 0) {
				title += ' (' + rows.length + ')';
			}

			let header = document.createElement('h2');
			header.appendChild(document.createTextNode(title));
			header.className = treasureClasses[table];

			let tableElement = document.createElement('table');
			tableElement.innerHTML = '<th>Roll</th><th>Result</th>';
			tableElement.className = treasureClasses[table];

			let tableSlider = document.createElement('div');
			tableSlider.appendChild(tableElement);
			tableSlider.className = 'slider';

			let viewButton = document.createElement('a');
			viewButton.className = 'view-button fas fa-chevron-down';
			header.appendChild(viewButton);

			viewButton.addEventListener('click', function() {
				if (tableSlider.style.maxHeight === '2px') {
					tableSlider.style.maxHeight = tableSlider.dataset.prevMaxHeight;
					viewButton.classList.remove('fa-chevron-up');
					viewButton.classList.add('fa-chevron-down');
					header.classList.remove('closed');
					

					setTimeout(function() {
						tableSlider.style.transitionDuration = '0';
						tableSlider.style.maxHeight = 'max-content';
						tableSlider.classList.remove('closed');
					}, 300);
				} else {
					let tableHeight = tableSlider.getBoundingClientRect().height + 'px';

					tableSlider.style.transitionDuration = '0';
					tableSlider.style.maxHeight = tableHeight;

					setTimeout(function() {
						tableSlider.style.transitionDuration = '.5s';
						tableSlider.style.maxHeight = '2px';
						tableSlider.classList.add('closed');	
					}, 15);

					tableSlider.setAttribute('data-prev-max-height', tableHeight);
					viewButton.classList.remove('fa-chevron-down');
					viewButton.classList.add('fa-chevron-up');
					
				}
			});

			rows.forEach(function(r) {
				tableElement.appendChild(r);
			});

			let fragment = document.createDocumentFragment();

			fragment.appendChild(header);
			fragment.appendChild(tableSlider);

			referencedTables = referencedTables.filter(function(t, i) {
				return referencedTables.indexOf(t) === i;
			});

			referencedTables.forEach(function(t) {
				fragment.appendChild(buildResultHTML(t, result));
			});	

			return fragment;
		}

		return document.createDocumentFragment();
	}

	window.rollBy = {
		table: rollOnTable,
		dice: rollDice
	}

	let tableSelect = document.getElementById('tableToRoll');

	let rollButton = document.getElementById('rollButton');
	rollButton.addEventListener('click', function() {
		if (tableSelect.value) {
			rollOnTable(tableSelect.value, true);	
		}
	});

	let viewButton = document.getElementById('viewButton');
	viewButton.addEventListener('click', function() {
		if (tableSelect.value) {
			tableOutput.innerText = '';
			renderTable(tableSelect.value);
		}
	});

	document.querySelector('.page-top').addEventListener('click', function() {
		window.smoothScroll(0);
	});

	document.addEventListener('click', function(e) {
		let target = e.target;

		if (!target.classList.contains('rollable')) {
			target = target.parentNode;
		}

		if (target && target.classList && target.classList.contains('rollable'))
		{
			let diceIcon = target.querySelector('.fa-dice');
			diceIcon.classList.add('fa-spin');
			let table = null;

			if (target.parentNode.tagName === 'TH') {
				table = target.parentNode.parentNode.parentNode;
				table.querySelectorAll('.selected').forEach(function(s) {
					s.classList.remove('selected');
				});
			}

			setTimeout(function() {
				diceIcon.classList.remove('fa-spin');
				let diceString = target.dataset.diceString;
				let roll = rollDice(diceString)
				target.querySelector('.dice-string').innerText = new Intl.NumberFormat().format(roll);

				if (target.parentNode.tagName === 'TH') {
					table.querySelectorAll('td:first-child').forEach(function(td) {
						let text = td.innerText;
						let range = text.split(/\s*-\s*/).map(function(n) {
							let num = parseInt(n);
							return num === 0 ? 100 : num;
						});

						if (range.length === 1) {
							range.push(range[0]);
						}

						if (roll >= range[0] && roll <= range[1]) {
							td.parentNode.classList.add('selected');
							td.appendChild(tableTopButton);
							window.smoothScroll(td.parentNode.previousElementSibling);
							return false;
						}
					});
				}
			}, 250);
		}
	});

	document.addEventListener('click', function(e) {
		let target = e.target;

		if (!target.classList.contains('table-top')) {
			target = target.parentNode;
		}

		if (target && target.classList && target.classList.contains('table-top')) {
			let elem = target.parentNode;
			while (elem && elem.tagName !== 'TABLE') {
				elem = elem.parentNode;
			}

			if (elem && elem.tagName === 'TABLE') {
				window.smoothScroll(elem);
			}
		}
	});

	document.addEventListener('click', function(e) {
		let target = e.target;

		if (!target.classList.contains('table-reference'))
		{
			target = target.parentNode;
		}

		if (target && target.classList && target.classList.contains('table-reference'))
		{
			let tableName = target.dataset.tableName;

			if (treasureTables[tableName]) {
				let headerElement = document.querySelector('h2 [data-table-name="' + tableName + '"]');
				
				if (headerElement)
				{	
					window.smoothScroll(headerElement);
				}
				else
				{
					renderTable(tableName);
					window.smoothScroll(document.querySelector('h2 [data-table-name="' + tableName + '"]'));
				}
			}
		}
	});
})();