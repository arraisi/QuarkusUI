import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: "#03045E",
				secondary: "#FF6D00",
				accent: "#C2185B",
				error: "#FF5400",
				info: "#00B4D8",
				success: "#0077B6",
				warning: "#FF9E00"
			}
		}
	}
});