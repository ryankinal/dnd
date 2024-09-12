export let visualizer = {
	place: function(container, x, y) {
		let box = container.getBoundingClientRect();
		let visualizer = document.createElement('div');
		visualizer.className = 'visualizer';
		self.container.appendChild(visualizer);

		visualizer.style.left = ((x - box.x) / self.transform.scale) + 'px';
		visualizer.style.top = ((y - box.y) / self.transform.scale) + 'px';
	},
	clear: function() {
		document.querySelectorAll('.visualizer').forEach((div) => div.parentNode.removeChild(div));
	}
};