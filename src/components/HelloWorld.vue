<template>
	<v-container fluid>
		<v-col>
			<h1 style="text-align: center">Person</h1>
			<v-data-table
				:footer-props="{
					'items-per-page-options': [2, 4, 8]
				}"
				:items-per-page="2"
				:headers="headers"
				:items="data"
				:options.sync="options"
				:server-items-length="serverItemsLength"
				:loading="loading"
				:sort-by.sync="sortBy"
				:sort-desc.sync="sortDesc"
			>
				<template v-slot:item.logo="{ item }">
					<img :src="item.airline.logo" style="width: 10%" />
				</template>
				<template v-slot:item.website="{ item }">
					<a :href="item.airline.website">{{ item.airline.website }}</a>
				</template>
			</v-data-table>
		</v-col>
	</v-container>
</template>

<script>
import axios from "axios";

export default {
	name: "HelloWorld",
	data: () => ({
		loading: true,
		data: [],
		options: {},
		headers: [
			{ text: "ID", value: "id" },
			{ text: "Name", value: "name" },
			{ text: "Email", value: "email" },
			{ text: "Active", value: "active" }
		],
		sortBy: "id",
		sortDesc: false,
		serverItemsLength: 0
	}),
	//this one will populate new data set when user changes current page.
	watch: {
		options: {
			handler() {
				this.personDatatables();
			}
		},
		deep: true
	},
	methods: {
		//Reading data from API method.
		personList() {
			this.loading = true;
			axios.get("/person/list").then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				// console.log("response: ", response);
				// console.log("response data: ", response.data);
				this.data = response.data.data;
			});
		},
		personDatatables() {
			this.loading = true;
			const { page, itemsPerPage } = this.options;
			let pageIndex = page - 1;
			axios.get(`/person/datatables?pageIndex=${pageIndex}&pageSize=${itemsPerPage}`).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				console.log("response: ", response);
				this.data = response.data.item1;
				this.serverItemsLength = response.data.item2;
				// console.log("data: ", this.data);
			});
		}
	},
	//this will trigger in the onReady State
	mounted() {
		this.personList();
		this.personDatatables();
	}
};
</script>
