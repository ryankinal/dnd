import { config } from './app/scripts/config.js';
import { API } from './app/scripts/api.js';

let emailInput = document.getElementById('loginEmail');
let passwordInput = document.getElementById('loginPassword');
let submit = document.getElementById('loginButton');
let api = new API();

submit.addEventListener('click', async function() {
	let email = emailInput.value;
	let password = passwordInput.value;

	if (email && password) {
		let data = {
			email: email,
			password: password
		};

		let response = await api.send('POST', '/users/auth', data, false);
		let loginData = response.body;

		if (loginData) {
			localStorage.setItem('access_token', loginData.accessToken);
			localStorage.setItem('refresh_token', loginData.refreshToken);
			localStorage.setItem('access_expires', Date.now() + (loginData.expiresIn * 1000));

			let response = await api.send('GET', '/users/me');
			let user = response.body;

			if (user) {
				localStorage.setItem('user_id', user.id);

				window.location = '/app/';
			}
		}
	}
	
	return;
});