const form = document.querySelector('form');
const out = document.querySelector('.output');
const maxOutput = document.querySelector('#maxDamage')
const averageOutput = document.querySelector('#avgDamage');
const weaponInput = document.querySelector('[name=weapon]');
const weaponRollOutput = document.querySelector('.weapon-roll');
const abilitiesOutput = document.querySelector('.abilities-field');

const labels = {
	rolled: 'Rolled',
	bonuses: 'Bonuses',
	piercing: 'Piercing',
	thunder: 'Thunder'
};

const rolls = {
	prince: {
		name: "The Prince's Dagger",
		die: 4,
		dice: 1,
		bonus: 5,
		crit: 7,
		type: 'piercing',
		category: 'weapon',
		selected: true
	},
	rat: {
		name: "Rat Skull Dagger (off hand)",
		die: 4,
		dice: 1,
		bonus: 0,
		type: 'piercing',
		category: 'weapon'
	},
	bow: {
		name: "Shortbow",
		die: 6,
		dice: 1,
		bonus: 4,
		type: 'piercing',
		category: 'weapon'
	},
	sneakAttack: {
		name: "Sneak Attack",
		die: 6,
		dice: 4,
		type: 'piercing',
		selected: true
	},
	screamingSpirits: {
		name: "Screaming Spirits",
		die: 8,
		dice: 1,
		type: 'thunder',
		selected: true
	}
};

Object.keys(rolls).forEach((key) => {
	let rollText = rolls[key].dice + 'd' + rolls[key].die + (rolls[key].bonus ? ' + ' + rolls[key].bonus : '');

	if (rolls[key].crit) {
		rollText += ' (+ ' + rolls[key].crit + ' on crit)';
	}

	if (rolls[key].category === 'weapon') {
		const option = document.createElement('option');
		option.innerHTML = rolls[key].name + ' - <span class="weapon-roll">' + rollText + '</span>';
		option.value = key;
		option.selected = rolls[key].selected;
		weaponInput.appendChild(option);
	} else {
		const label = document.createElement('label');
		label.innerHTML = `<input type="checkbox" checked="${rolls[key].selected ? 'checked' : ''}" name="${key}"> ${rolls[key].name} <div class="ability-roll">${rollText}</div>`;

		abilitiesOutput.appendChild(label);
	}
});

const critLabel = document.createElement('label');
critLabel.innerHTML = '<input type="checkbox" name="crit"> Critical Hit <div class="ability-roll">2x Dice</div>';
abilitiesOutput.appendChild(critLabel);

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

function calculateDamage() {
	const data = new FormData(form);
	const crit = data.get('crit') ? true : false;

	const output = data.keys()
		.reduce((output, key) => {
			let value = data.get(key);

			if (value === 'on') {
				value = key;
			}

			const roll = rolls[value];

			if (roll) {
				const rollResult = {
					name: key,
					label: roll.name,
					total: 0,
					bonuses: 0,
					average: 0,
					type: roll.type,
					dice: [],
					die: roll.die
				};

				rollResult.average = (roll.dice + roll.dice * roll.die * (crit ? 2 : 1)) / 2;
				output.totals.average += rollResult.average;
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
				bonuses: 0,
				average: 0
			},
			rolls: []
		});

	output.totals.average += output.totals.bonuses;

	console.log(output.totals);

	return output;
}

function onChange() {
	const output = calculateDamage();
	maxOutput.innerHTML = output.totals.max;
	averageOutput.innerHTML = output.totals.average;
}

form.addEventListener('change', onChange);

form.addEventListener('submit', (e) => {
	out.innerHTML = '<div class="rolling"><span class="fas fa-droplet fa-beat" style="--fa-animation-duration: 0.5s"></span></div>';

	const output = calculateDamage();

	setTimeout(() => {
		out.innerHTML = '';

		const totalDetailsOutput = Object.keys(output.totals).map((key) => {
				return key !== 'total' && key !== 'max' && key !== 'average' && output.totals[key] ? `<div>${labels[key]}: ${output.totals[key]}</div>` : null;
			});

		const totalsContainer = document.createElement('div');
		totalsContainer.className = 'result totals-result';
		totalsContainer.innerHTML = `<div class="result-main">
										<div class="result-label">Total Damage</div>
										<div class="result-value">
											${output.totals.total}
											<!-- <div class="sub-value">Max: ${output.totals.max}</div> -->
										</div>
									</div>
									<div class="result-details">${totalDetailsOutput.join('')}</div>`

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
								<div>Rolled ${roll.dice.length}d${roll.die}: ${roll.dice.join(' + ')}</div>
								<div>${roll.bonuses ? 'Bonuses: ' + roll.bonuses : ''}</div>
							</div>`;

			out.appendChild(elem);
		});
	}, 1000);
	

	e.preventDefault();
	return false;
});

onChange();