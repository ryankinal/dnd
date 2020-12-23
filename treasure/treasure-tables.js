(function () {
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

	function rollOnTable(name, render)
	{
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
							let matches = row[j].matchAll(/(\d*d\d+(?:[+-]\d+)?)\s*\([\d,]+\)\s*([\d,]+ gp (?:gems(tones)?|art objects))/ig);
							let match = matches.next();

							while (match && !match.done)
							{
								let die = match.value[1];
								let table = match.value[2];
								let roll = 1;

								if (table.indexOf('gems') === table.length - 4)
								{
									table += 'tones';
								}

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

			/*document.querySelectorAll.forEach(function(table) {
				let tableHeight = table.getBoundingClientRect().height;
				table.parentNode.style.maxHeight = tableHeight + 'px';
			})*/
		}

		return results;
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
					let creatorLink = document.createElement('a');
					creatorLink.appendChild(document.createTextNode('+Make/Intended User'));
					creatorLink.className = 'detail-link';

					let historyLink = document.createElement('a');
					historyLink.appendChild(document.createTextNode('+History'));
					historyLink.className = 'detail-link';

					let propertyLink = document.createElement('a');
					propertyLink.appendChild(document.createTextNode('+Minor Property'));
					propertyLink.className = 'detail-link';

					let quirkLink = document.createElement('a');
					quirkLink.appendChild(document.createTextNode('+Quirk'));
					quirkLink.className = 'detail-link';
					
					let linksDiv = document.createElement('div');
					linksDiv.appendChild(creatorLink);
					linksDiv.appendChild(historyLink);
					linksDiv.appendChild(propertyLink);
					linksDiv.appendChild(quirkLink);

					resultCell.appendChild(linksDiv);

					creatorLink.addEventListener('click', function() {
						let table = 'who created it or was intended to use it?';
						let creatorResult = rollOnTable(table)[table][0].result;
						
						let creatorDiv = document.createElement('div');
						creatorDiv.className = 'detail';

						let rerollLink = document.createElement('a');
						rerollLink.className = 'fas fa-dice';
						rerollLink.addEventListener('click', function() {
							text.style.visibility = 'hidden';
							rerollLink.classList.add('fa-spin');

							setTimeout(function() {
								let creatorResult = rollOnTable(table)[table][0].result;
								text.innerHTML = creatorResult;
								text.style.visibility = 'visible';
								rerollLink.classList.remove('fa-spin');
							}, 500);
						});

						let label = document.createElement('b');
						label.appendChild(rerollLink);
						label.appendChild(document.createTextNode(' Make/Intended User'));

						let text = document.createElement('div');
						text.innerText = creatorResult;

						creatorDiv.appendChild(label);
						creatorDiv.appendChild(text);

						resultCell.appendChild(creatorDiv);

						creatorLink.remove();
					});

					historyLink.addEventListener('click', function() {
						let table = 'what is a detail from its history?';
						let tableResult = rollOnTable(table)[table][0].result;
						
						let historyDiv = document.createElement('div');
						historyDiv.className = 'detail';

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
							}, 500);
						});

						let label = document.createElement('b');
						label.appendChild(rerollLink);
						label.appendChild(document.createTextNode(' History'));

						let text = document.createElement('div');
						text.innerText = tableResult;

						historyDiv.appendChild(label);
						historyDiv.appendChild(text);

						resultCell.appendChild(historyDiv);

						historyLink.remove();
					});

					propertyLink.addEventListener('click', function() {
						let table = 'what minor property does it have?';
						let tableResult = rollOnTable(table)[table][0].result;
						
						let propertyDiv = document.createElement('div');
						propertyDiv.className = 'detail';

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
							}, 500);
						});

						let label = document.createElement('b');
						label.appendChild(rerollLink);
						label.appendChild(document.createTextNode(' Minor Property'));

						let text = document.createElement('div');
						text.innerText = tableResult;

						propertyDiv.appendChild(label);
						propertyDiv.appendChild(text);

						resultCell.appendChild(propertyDiv);

						propertyLink.remove();
					});

					quirkLink.addEventListener('click', function() {
						let table = 'what quirk does it have?';
						let tableResult = rollOnTable(table)[table][0].result;

						let quirkDiv = document.createElement('div');
						quirkDiv.className = 'detail';

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
							}, 500);
						});

						let label = document.createElement('b');
						label.appendChild(rerollLink);
						label.appendChild(document.createTextNode(' Quirk: '));

						let text = document.createElement('div');
						text.innerText = tableResult;

						quirkDiv.appendChild(label);
						quirkDiv.appendChild(text);

						resultCell.appendChild(quirkDiv);

						quirkLink.remove();
					});
				}
				
				return rowElement;
			});

			let title = treasureTableNames.filter(function(n) {
				return n.toLowerCase() === table;
			}).join('');

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
				if (tableSlider.style.maxHeight === '0px') {
					tableSlider.style.maxHeight = tableSlider.dataset.prevMaxHeight;
					viewButton.classList.remove('fa-chevron-up');
					viewButton.classList.add('fa-chevron-down');
					header.classList.remove('closed');
					tableSlider.classList.remove('closed');

					setTimeout(function() {
						tableSlider.style.transitionDuration = '0';
						tableSlider.style.maxHeight = 'max-content';
					}, 300);
				} else {
					let tableHeight = tableSlider.querySelector('table').getBoundingClientRect().height + 'px';

					tableSlider.style.transitionDuration = '0';
					tableSlider.style.maxHeight = tableHeight;

					setTimeout(function() {
						tableSlider.style.transitionDuration = '.5s';
						tableSlider.style.maxHeight = '0px';
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
})();