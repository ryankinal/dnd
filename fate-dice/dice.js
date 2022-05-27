(function() {
	var rolling = false,
		diceDisplay = document.querySelector('.dice'),
		diceIcons = document.querySelectorAll('.dice .fas'),
		terribleDisplay = document.querySelector('tr.minus-2 td:first-child'),
		legendaryDisplay = document.querySelector('tr.plus-8 td:first-child'),
		rollAnimationCount = 8,
		rollAnimationIntervalTime = 100,
		iconClasses = [
			'fas fa-minus',
			'',
			'fas fa-plus'
		];

	function fateDie() {
		return Math.floor(Math.random() * 3) - 1;
	}

	function randomRotation() {
		return Math.floor(Math.random() * 360);
	}

	function roll() {
		var dice = [
				fateDie(),
				fateDie(),
				fateDie(),
				fateDie()
			],
			total = dice.reduce(function(prev, curr) {
				return prev + curr;
			}, 0);

		return {
			dice: dice,
			total: total
		};
	}

	function getLevelClass(total) {
		var sign = '';

		total = Math.max(total, -2);
		total = Math.min(total, 8);

		if (total > 0) {
			sign = 'plus-';
		} else if (total < 0) {
			sign = 'minus';
		}

		return sign + (total === 0 ? 'zero' : String(total));
	}

	document.getElementById('doIt').addEventListener('click', function() {
		var rollAnimationInterval,
			selected = document.querySelector('tr.selected');

		if (!rolling) {
			rolling = true;

			diceDisplay.classList.add('show');

			if (selected) {
				document.querySelector('tr.selected').classList.remove('selected');	
			}

			terribleDisplay.innerText = '-2';
			legendaryDisplay.innerText = '+8';

			rollAnimationInterval = setInterval(function() {
				diceIcons[0].className = iconClasses[fateDie() + 1];
				diceIcons[0].style.transform = 'rotate(' + randomRotation() + 'deg)';
				
				diceIcons[1].className = iconClasses[fateDie() + 1];
				diceIcons[1].style.transform = 'rotate(' + randomRotation() + 'deg)';
				
				diceIcons[2].className = iconClasses[fateDie() + 1];
				diceIcons[2].style.transform = 'rotate(' + randomRotation() + 'deg)';

				diceIcons[3].className = iconClasses[fateDie() + 1];
				diceIcons[3].style.transform = 'rotate(' + randomRotation() + 'deg)';
			}, rollAnimationIntervalTime);

			setTimeout(function() {
				var result = roll();

				diceIcons[0].className = iconClasses[result.dice[0] + 1];
				diceIcons[0].style.transform = 'rotate(0deg)';
				
				diceIcons[1].className = iconClasses[result.dice[1] + 1];
				diceIcons[1].style.transform = 'rotate(0deg)';
				
				diceIcons[2].className = iconClasses[result.dice[2] + 1];
				diceIcons[2].style.transform = 'rotate(0deg)';

				diceIcons[3].className = iconClasses[result.dice[3] + 1];
				diceIcons[3].style.transform = 'rotate(0deg)';

				clearInterval(rollAnimationInterval);

				document.querySelector('tr.' + getLevelClass(result.total)).classList.add('selected');

				if (result.total < -2) {
					terribleDisplay.innerText = result.total;
				}

				if (result.total > 8) {
					legendaryDisplay.innerText = '+' + result.total;
				}

				rolling = false;
			}, rollAnimationIntervalTime * rollAnimationCount);
		}
	});
})();