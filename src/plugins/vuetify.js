import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: "#0b0915",
				secondary: "#f3f3f3",
				accent: "#f4640e",
				error: "#9d0e0c",
				info: "#82c6d4",
				success: "#4dab64",
				warning: "#f1a84e"
			}
		}
	}
});