import { Map } from './map.js';

let scale = 1.55;
let output = document.getElementById('display');
let map = window.map = new Map({
	image: 'barovia-map.jpg',
	imageScale: scale,
	start: {
		background: {
			scale: scale,
			position: {
				x: -7591,
				y: -2401
			}
		}
	}
});
map.render(output);