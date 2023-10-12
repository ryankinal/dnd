(function() {
	var diceClasses = ['', 'fa-dice-one', 'fa-dice-two', 'fa-dice-three', 'fa-dice-four', 'fa-dice-five', 'fa-dice-six'],
		output = document.querySelector('.output'),
		diceOutput = document.querySelector('.output-dice'),
		totalOutput = document.querySelector('.output-total'),
		doIt = document.getElementById('doIt'),
		upButton = document.querySelector('.up'),
		downButton = document.querySelector('.down'),
		advantage = document.querySelector('[value=advantage]'),
		disadvantage = document.querySelector('[value=disadvantage]'),
		values = document.querySelector('.values'),
		modifier = 0;

	function d6()
	{
		return Math.floor(Math.random() * 6) + 1
	}

	function roll()
	{
		var rolls = [d6(), d6()];

		if (advantage.checked || disadvantage.checked)
		{
			rolls.push(d6());
		}

		return rolls;
	}

	function renderRolls(rolls, final)
	{
		var ignoreValue = [].concat(rolls).reduce(function(a, b) {
				if (advantage.checked) {
					return a < b ? a : b;
				} else if (disadvantage.checked) {
					return a > b ? a : b;
				}
			}, rolls[0]),
			markedLowest = false;

		html = [].concat(rolls).map(function(roll, index) {
			var ignored = '';

			if (final && !markedLowest && (advantage.checked || disadvantage.checked) && roll === ignoreValue) {
				markedLowest = true;
				ignored = ' ignored';
			}

			return `<div class="die${ignored}"><span class="fa ${diceClasses[roll]}"></span></div>`;
		}).join('\n<div class="plus">+</div>\n');

		if (modifier) {
			html += `\n<div class="plus">${modifier < 0 ? '-' : '+'} ${Math.abs(modifier)}</div>`;
		}
		
		return html;
	}

	function getTotal(rolls) {
		var	rollsCopy = [].concat(rolls),
			ignoreFirst = false;

		if (advantage.checked || disadvantage.checked) {
			ignoreFirst = true;

			rollsCopy.sort(function(a, b) {
				return advantage.checked ? a - b : b - a;
			});
		}

		if (ignoreFirst)
		{
			rollsCopy.shift();
		}

		return rollsCopy.reduce(function(a, b) {
			return a + b;
		}, 0) + modifier;
	}

	function setModifierTransform()
	{
		var val = (modifier - 5) * 50;
		values.style.transform = 'translateY(' + val + 'px)';
		console.log(modifier);
	}

	upButton.addEventListener('click', function() {
		if (modifier < 5)
		{
			modifier++;
			setModifierTransform();
		}
	});

	downButton.addEventListener('click', function() {
		if (modifier > -5) {
			modifier--;
			setModifierTransform();
		}
	});

	doIt.addEventListener('click', function() {
		doIt.classList.add('rolling');
		totalOutput.style.display = 'none';
		output.style.display = 'block';

		var animateInterval = setInterval(function() {
			diceOutput.innerHTML = renderRolls(roll());
			diceOutput.querySelectorAll('.die').forEach(function(die) {
				die.style.transform = 'rotateZ(' + Math.floor(Math.random() * 360) + 'deg)';
			});
		}, 60);

		setTimeout(function() {
			clearInterval(animateInterval);
		}, 300)

		setTimeout(function() {
			var hitText,
				rolls = roll(),
				total = getTotal(rolls);

			if (total <= 6) {
				hitText = 'MISS!';
			} else {
				hitText = 'HIT!';
			}

			doIt.classList.remove('rolling');
			diceOutput.innerHTML = renderRolls(rolls, true);
			totalOutput.innerHTML = `<div>${total}</div><div class="hit">${hitText}</div>`;
			totalOutput.style.display = 'block';
		}, 300);
	});
})();