const form = document.querySelector('form');
const out = document.querySelector('.output');
const labels = {
	total: 'Total (with bonuses)',
	rolled: 'Rolled',
	weapon: 'Weapon',
	bonuses: 'Bonuses',
	piercing: 'Piercing',
	thunder: 'Thunder',
	sneakAttack: 'Sneak Attack',
	screamingSpirits: 'Screaming Spirits',
	max: 'Max Damage'
};

const rolls = {
	prince: {
		name: "The Prince's Dagger",
		die: 4,
		dice: 1,
		bonus: 5,
		crit: 7,
		type: 'piercing'
	},
	rat: {
		name: "Rat Skull Dagger",
		die: 4,
		dice: 1,
		bonus: 0,
		type: 'piercing'
	},
	bow: {
		name: "Shortbow",
		die: 6,
		dice: 1,
		bonus: 4,
		type: 'piercing'
	},
	sneakAttack: {
		name: "Sneak Attack",
		die: 6,
		dice: 4,
		type: 'piercing'
	},
	screamingSpirits: {
		name: "Screaming Spirits",
		die: 8,
		dice: 1,
		type: 'thunder'
	}
};

document.querySelectorAll('input[type=checkbox]').forEach((input) => {
	input.addEventListener('input', () => {
		if (input.checked) {
			input.parentNode.classList.add('selected');
		} else {
			input.parentNode.classList.remove('selected');
		}
	});

	if (input.checked) {
		input.parentNode.classList.add('selected');
	}
});

form.addEventListener('submit', (e) => {
	const data = new FormData(form);
	const crit = data.get('crit') ? true : false;

	out.innerHTML = '<div class="rolling"><span class="fas fa-droplet fa-beat-fade"></span></div>';

	const output = data.keys()
		.reduce((output, key) => {
			let value = data.get(key);

			if (value === 'on') {
				value = key;
			}

			console.log(key, value)

			const roll = rolls[value];
			console.log(roll);

			if (roll) {
				console.log(roll);
				const rollResult = {
					name: key,
					label: roll.name,
					total: 0,
					bonuses: 0,
					type: roll.type,
					dice: []
				};

				output.totals[roll.type] = output.totals[roll.type] || 0;

				for (let i = 0; i < roll.dice * (crit ? 2 : 1); i++) {
					let result = Math.floor(Math.random() * roll.die) + 1;
					
					// Totals
					output.totals.total += result;
					output.totals.max += roll.die;
					output.totals.rolled += result;
					output.totals[roll.type] += result;

					// Dice
					rollResult.dice.push(result)
					rollResult.total += result;
				}

				if (roll.bonus) {
					// Totals
					output.totals.total += roll.bonus;
					output.totals[roll.type] += roll.bonus;
					output.totals.max += roll.bonus;
					output.totals.bonuses += roll.bonus;

					// Dice
					rollResult.bonuses += roll.bonus;
					rollResult.total += roll.bonus;
				}

				if (roll.crit && crit) {
					// Totals
					output.totals.total += roll.crit;
					output.totals[roll.type] += roll.crit;
					output.totals.max += roll.crit;
					output.totals.bonuses += roll.crit;

					// Dice
					rollResult.bonuses += roll.crit;
					rollResult.total += roll.crit;
				}

				output.rolls.push(rollResult);
			}

			return output;
		}, {
			totals: {
				total: 0,
				rolled: 0,
				max: 0,
				bonuses: 0
			},
			rolls: []
		});

	setTimeout(() => {
		out.innerHTML = '';

		const totalDetailsOutput = Object.keys(output.totals).map((key) => {
				console.log(key, output.totals[key], labels[key]);
				return key !== 'total' && key !== 'max' && output.totals[key] ? `<div>${labels[key]}: ${output.totals[key]}</div>` : null;
			});

		const totalsContainer = document.createElement('div');
		totalsContainer.className = 'result totals-result';
		totalsContainer.innerHTML = `<div class="result-main">
										<div class="result-label">Total Damage</div>
										<div class="result-value">
											${output.totals.total}
											<div class="sub-value">Max: ${output.totals.max}</div>
										</div>
									</div>
									<div class="result-details">${totalDetailsOutput.join('')}</div>`

		console.log(output);

		out.appendChild(totalsContainer);

		const breakDownHeader = document.createElement('div');
		breakDownHeader.className = 'result-header';
		breakDownHeader.innerHTML = '<h2>Breakdown</h2>';

		out.appendChild(breakDownHeader);

		output.rolls.forEach((roll) => {
			let elem = document.createElement('div');
			elem.className = 'result roll-result';
			elem.innerHTML = `<div class="result-main">
								<div class="result-label">${roll.label}</div>
								<div class="result-value">
									${roll.total}
									<div class="sub-value">${roll.type}</div>
								</div>
							</div>
							<div class="result-details">
								<div>Rolled: ${roll.dice.join(' + ')}</div>
								<div>${roll.bonuses ? 'Bonuses: ' + roll.bonuses : ''}</div>
							</div>`;

			out.appendChild(elem);
		});
	}, 500);
	

	e.preventDefault();
	return false;
});