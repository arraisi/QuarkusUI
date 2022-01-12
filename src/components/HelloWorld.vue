<template>
	<v-container fluid>
		<v-col>
			<h1 style="text-align: center">Datatable with 3rd Party API</h1>
		</v-col>
	</v-container>
</template>

<script>
import axios from "axios";

export default {
	name: "HelloWorld",
	data: () => ({
		loading: true,
		data: []
	}),
	methods: {
		//Reading data from API method.
		readDataFromAPI() {
			this.loading = true;
			axios.get("/person/list").then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
        console.log('response: ', response);
        console.log("response data: ", response.data);
				this.data = response.data.data;
			});
		}
	},
	//this will trigger in the onReady State
	mounted() {
		this.readDataFromAPI();
	}
};
</script>
