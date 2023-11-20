(function() {
	var recentTimers = localStorage.getItem('recentTimers'),
		savedTimers = localStorage.getItem('savedTimers'),
		searchResults = [],
		timers = savedTimers ? JSON.parse(savedTimers) : [],
		nameInput = document.getElementById('name'),
		durationInput = document.getElementById('duration'),
		startButton = document.getElementById('start'),
		tickButton = document.getElementById('tick'),
		clearButton = document.getElementById('clear'),
		controls = document.getElementById('controls'),
		timerOutput = document.getElementById('timers'),
		searchOutput = document.getElementById('recentTimers'),
		noTimers = document.getElementById('noTimers'),
		clockIcon = ' <span class="fa fa-clock"></span> ',
		thirtyDays = 60 * 60 * 24 * 30 * 1000,
		now = Date.now();

	if (typeof recentTimers === 'string') {
		recentTimers = JSON.parse(recentTimers);

		if (recentTimers.filter) {
			recentTimers = recentTimers.filter(function(timer) {
				return now - timer.time < thirtyDays;
			});
		}
	}

	function saveTimers() {
		if (timers && timers.length) {
			localStorage.setItem('savedTimers', JSON.stringify(timers.map(function(timer) {
				return {
					name: timer.name,
					duration: timer.duration
				};
			})));
		} else {
			localStorage.removeItem('savedTimers');
		}

		if (recentTimers && recentTimers.length) {
			localStorage.setItem('recentTimers', JSON.stringify(recentTimers.map(function(timer) {
				return {
					name: timer.name,
					duration: timer.duration,
					time: Date.now()
				};
			})));
		} else {
			localStorage.removeItem('savedTimers');
		}
	}

	function renderTimers(rerender) {
		if (rerender) {
			timerOutput.innerHTML = '';
		}

		timers = timers.filter(function(timer) {
			console.log(timer);
			return timer.duration > 0;
		});

		console.log(timers);

		if (timers && timers.length) {
			noTimers.style.opacity = 0;
			noTimers.style.display = 'none';
			timerOutput.style.display = 'block';
			controls.style.display = 'flex';

			timers.sort(function(a, b) {
				return a.duration - b.duration;
			});
	
			timers.forEach(function(timer) {
				var display = renderTimer(timer);
	
				if (typeof display === 'object') {
					timerOutput.appendChild(display);
				}
			});
		} else {
			controls.style.display = 'none';
			timerOutput.style.display = 'none';
			noTimers.style.display = 'block';
			noTimers.style.opacity = 1;
		}
	}

	function renderTimer(timer) {
		var display = timer.display || document.createElement('div');

		if (timer.display) {
			display.querySelector('.duration').innerHTML = timer.duration + clockIcon;
			result = true;
		} else {
			display.classList.add('timer');
			display.innerHTML = `<div class="name">${timer.name} <span class="remove fa fa-trash"></span></div>
				<div class="duration">${timer.duration} ${clockIcon}</div>`;

			display.querySelector('.remove').addEventListener('click', function() {
				display.classList.add('expired');
				timers.splice(timers.indexOf(timer), 1);
				saveTimers();
				
				if (timers.length < 1) {
					setTimeout(function() {
						renderTimers(true);
					}, 500);
				}
			});

			display.querySelector('.duration').addEventListener('click', function() {
				tick(timer);
			});

			result = display;
		}

		display.classList.remove('expired', 'expiring');

		if (timer.duration < 1) {
			setTimeout(function() {
				display.classList.add('expired');
			}, 500);
		} else if (timer.duration === 1) {
			display.classList.add('expiring');
		}

		timer.display = display;

		return display;
	}

	function tick(target) {
		var remove = false
			set = timers;

		timers.forEach(function(timer) {
			if (!target || timer == target) {
				timer.duration--;

				if (timer.duration < 1) {
					remove = true;
				}

				var display = renderTimer(timer);

				if (display) {
					display.classList.add('ticked');
					
					setTimeout(function() {
						display.classList.remove('ticked');
					}, 200);
				}
			}
		});

		if (remove) {
			timers = timers.filter(function(timer) {
				return timer.duration > 0;
			});

			if (timers.length === 0) {
				setTimeout(function() {
					renderTimers();
				}, 1000)
			}
		}

		console.log(JSON.stringify(timers));

		saveTimers();	
	}

	function addTimer() {
		var name = nameInput.value,
			duration = parseInt(durationInput.value);

		if (name && duration.toString() === durationInput.value) {
			recentTimers = recentTimers ? recentTimers.filter(function(timer) {
				return timer.name.toLowerCase() !== name.toLowerCase();
			}) : [];

			recentTimers.push({
				name: name,
				duration: duration,
				time: Date.now()
			});
			
			timers.push({
				name: name,
				duration: duration
			});

			nameInput.value = '';
		}

		renderSearchResults([]);
		renderTimers(true);
		saveTimers();
	}

	function renderSearchResults(results) {
		searchOutput.innerHTML = '';

		if (results && results.length) {
			results.slice(0, 5).forEach(function(timer) {
				var div = document.createElement('div');
				div.classList.add('timer');
				div.innerHTML = `<div class="name">${timer.name}</div>
				<div class="duration">${timer.duration} ${clockIcon}</div>`;

				div.addEventListener('click', function() {
					timers.push({
						name: timer.name,
						duration: timer.duration
					});

					renderSearchResults([]);
					renderTimers(true);
					saveTimers();

					nameInput.value = '';
				});
	
				searchOutput.appendChild(div);
			});
		}
	}

	function searchRecentTimers(value) {
		searchResults = recentTimers ? recentTimers.filter(function(timer) {
			return timer.name.match(new RegExp(value, 'gi'));
		}) : [];

		searchResults.sort(function(a, b) {
			return b.time - a.time;
		});

		return searchResults;
	}

	startButton.addEventListener('click', addTimer);
	tickButton.addEventListener('click', function() {
		tick();
	});
	clearButton.addEventListener('click', function() {
		timers.forEach(function(timer) {
			timer.duration = 0;
			timer.display && timer.display.classList.add('expired');

			setTimeout(function() {
				renderTimers();
			}, 500);
		});

		timers = [];
		saveTimers();
	});

	nameInput.addEventListener('keyup', function(e) {
		if (e.key === 'Enter') {
			addTimer();
		} else {
			if (nameInput.value) {
				renderSearchResults(searchRecentTimers(nameInput.value));
			} else {
				renderSearchResults([]);
			}
		}
	});

	durationInput.addEventListener('keyup', function(e) {
		if (e.key === 'Enter') {
			addTimer();
		} else {
			if (nameInput.value) {
				renderSearchResults(searchRecentTimers(nameInput.value));
			} else {
				renderSearchResults([]);
			}
		}
	});

	renderTimers();
})();