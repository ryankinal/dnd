import { API } from '../app/scripts/api.js'

const loginEmailInput = document.querySelector('#loginEmail');
const loginPasswordInput = document.querySelector('#loginPassword');
const loginButton = document.querySelector('#loginButton');
const api = new API();

loginButton.addEventListener('click', async () => {
	const email = loginEmailInput.value;
	const password = loginPasswordInput.value;

	if (!email) {
		loginEmailInput.classList.add('error');
	}

	if (!password) {
		loginPasswordInput.classList.add('error');
	}

	if (email && password) {
		const auth = await api.auth(email, password);

		if (auth) {
			window.location = '../'
		}
	}
});