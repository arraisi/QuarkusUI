import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* eslint-disable */
// if (localStorage.getItem("principal") && JSON.parse(localStorage.getItem("principal")).token) {
// 	axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("principal")).token;
// }

export default new Vuex.Store({
	state: {
		// principal: (localStorage.getItem("principal") && JSON.parse(localStorage.getItem("principal"))) || {},
		notification: {
			title: null,
			content: {},
			show: false
		},
		title: ''
	},
	mutations: {
		showNotification(state, { title, content }) {
			state.notification.title = title;
			state.notification.content = content;
			state.notification.show = true;
		},
		hideNotification(state) {
			state.notification.show = false;
			state.notification.title = null;
			state.notification.content = {};
		},
		debug(state) {
			console.log("localStorage principal: " + localStorage.getItem("principal") + " state: " + JSON.stringify(state, null, 4));
		}
	},
	actions: {
		// login({ commit }, body) {
		// 	const params = new URLSearchParams();
		// 	params.append("email", body.email);
		// 	params.append("password", body.password);

		// 	return new Promise((resolve, reject) => {
		// 		axios
		// 			.post("/api/login", params, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
		// 			.then(response => {
		// 				let principal = response.data;
		// 				if (principal && principal.token) {
		// 					commit("login", principal);
		// 					resolve({ response: response, principal: principal });
		// 				}
		// 			})
		// 			.catch(error => reject(error.message));
		// 	});
		// },
	},
	modules: {
	},
	getters: {
		// isAuthenticated: state => state.principal && state.principal.token
	}
})
