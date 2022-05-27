(function() {
	let site = 'https://www.dndbeyond.com/';
	let page = site + 'sources/tftyp/a1/the-sunless-citadel';
	let descriptionOutput = document.getElementById('descriptionOutput');

	function showArea(id) {
		if (locationData[id]) {
			descriptionOutput.innerHTML = locationData[id].html;
			descriptionOutput.querySelectorAll('a').forEach(function(l) {
				let idSplit = l.href.split(/#/g);
				let id = (idSplit && idSplit.length && idSplit.length > 1) ? idSplit[1] : false;

				if (id && locationData[id]) {
					l.addEventListener('click', function(e) {
						showArea(id);
						e.preventDefault();
						return false;
					});
				} else {
					l.href = site + l.href.replace(/^https?:\/\/(.+?)\//i, '');
					l.target = '_blank';
				}
			});
		}
	}

	window.map = {
		showArea: showArea
	}
})();