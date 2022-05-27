(function() {
	var rolling = false,
		rollButton = document.getElementById('doIt'),
		diceDisplay = document.querySelector('.dice'),
		diceIcons = document.querySelectorAll('.dice .fas'),
		terribleDisplay = document.querySelector('tr.minus-2 td:first-child'),
		legendaryDisplay = document.querySelector('tr.plus-8 td:first-child'),
		fatePointsDisplay = document.querySelector('.fate-points'),
		refreshValueInput = document.getElementById('refreshValue'),
		stored = localStorage.getItem('fate'),
		stored = stored ? JSON.parse(stored) : null,
		fatePoints = 0,
		rollAnimationCount = 8,
		rollAnimationIntervalTime = 100,
		diceIconClasses = [
			'fas fa-minus',
			'',
			'fas fa-plus'
		],
		pointIconClasses = [
		    "book-skull",
		    "chess",
		    "chess-bishop",
		    "chess-board",
		    "chess-king",
		    "chess-knight",
		    "chess-pawn",
		    "chess-queen",
		    "chess-rook",
		    "diamond",
		    "dice",
		    "dice-d20",
		    "dice-d6",
		    "dice-five",
		    "dice-four",
		    "dice-one",
		    "dice-six",
		    "dice-three",
		    "dice-two",
		    "dragon",
		    "dungeon",
		    "gamepad",
		    "ghost",
		    "hand-fist",
		    "hat-wizard",
		    "headset",
		    "heart",
		    "puzzle-piece",
		    "ring",
		    "scroll",
		    "shield-halved",
		    "skull-crossbones",
		    "square-full",
		    "vr-cardboard",
		    "wand-sparkles"
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

	function addFatePoint() {
		var iconIndex = Math.floor(Math.random() * pointIconClasses.length),
			icon = pointIconClasses[iconIndex],
			element = document.createElement('div');

		element.innerHTML = `<div class="fate-point added"><div><span class="fas fa-${icon}"></span></div></div>`;
		element.addEventListener('click', function() {
			if (!element.firstChild.matches('.spending')) {
				element.firstChild.classList.add('spending');
				fatePoints--;
				console.log(fatePoints);
				save();

				setTimeout(function() {
					element.parentNode.removeChild(element);
				}, 300)
			}
		});

		fatePoints++;
		save();
		fatePointsDisplay.appendChild(element);
		setTimeout(function() {
			element.firstChild.classList.remove('added');
		});
	}

	function save() {
		localStorage.setItem('fate', JSON.stringify({
			fatePoints: fatePoints,
			refreshValue: parseInt(refreshValueInput.value)
		}))
	}

	rollButton.addEventListener('click', function() {
		var rollAnimationInterval,
			selected = document.querySelector('tr.selected');

		if (!rolling) {
			rolling = true;

			diceDisplay.classList.add('show');
			rollButton.classList.add('rolling');

			if (selected) {
				document.querySelector('tr.selected').classList.remove('selected');	
			}

			terribleDisplay.innerText = '-2';
			legendaryDisplay.innerText = '+8';

			rollAnimationInterval = setInterval(function() {
				diceIcons[0].className = diceIconClasses [fateDie() + 1];
				diceIcons[0].style.transform = 'rotate(' + randomRotation() + 'deg)';
				
				diceIcons[1].className = diceIconClasses [fateDie() + 1];
				diceIcons[1].style.transform = 'rotate(' + randomRotation() + 'deg)';
				
				diceIcons[2].className = diceIconClasses [fateDie() + 1];
				diceIcons[2].style.transform = 'rotate(' + randomRotation() + 'deg)';

				diceIcons[3].className = diceIconClasses [fateDie() + 1];
				diceIcons[3].style.transform = 'rotate(' + randomRotation() + 'deg)';
			}, rollAnimationIntervalTime);

			setTimeout(function() {
				var result = roll();

				diceIcons[0].className = diceIconClasses [result.dice[0] + 1];
				diceIcons[0].style.transform = 'rotate(0deg)';
				
				diceIcons[1].className = diceIconClasses [result.dice[1] + 1];
				diceIcons[1].style.transform = 'rotate(0deg)';
				
				diceIcons[2].className = diceIconClasses [result.dice[2] + 1];
				diceIcons[2].style.transform = 'rotate(0deg)';

				diceIcons[3].className = diceIconClasses [result.dice[3] + 1];
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
				rollButton.classList.remove('rolling');
			}, rollAnimationIntervalTime * rollAnimationCount);
		}
	});

	document.getElementById('add').addEventListener('click', addFatePoint);

	document.getElementById('refresh').addEventListener('click', function(e) {
		var refreshValue = parseInt(refreshValueInput.value);

		fatePointsDisplay.innerHTML = '';
		fatePoints = 0;

		while (refreshValue--) {
			addFatePoint();
		}
	});

	refreshValueInput.addEventListener('change', function() {
		save();
	});

	if (stored) {
		if (stored.fatePoints && stored.fatePoints > 0) {
			while (stored.fatePoints--) {
				addFatePoint();
			}	
		}

		if (stored.refreshValue) {
			refreshValueInput.value = stored.refreshValue;
		}
	}
})();