export let visualizers = {
	transformPoint: function(container, x, y, scale) {
		scale = scale || 1;
		let box = container.getBoundingClientRect();

		return {
			x: (x - box.x) / scale,
			y: (y - box.y) / scale
		};
	},
	place: function(container, x, y, scale) {
		let point = this.transformPoint(container, x, y, scale);
		let visualizer = document.createElement('div');
		visualizer.className = 'visualizer';
		container.appendChild(visualizer);

		visualizer.style.left = point.x + 'px';
		visualizer.style.top = point.y + 'px';
	},
	clear: function() {
		document.querySelectorAll('.visualizer').forEach((div) => div.parentNode.removeChild(div));
	}
};