<template>
	<v-col>
		<v-card class="py-6" rounded="lg" color="rgba(255, 255, 255, 0.75) !important" style="backdrop-filter: blur(10px)">
			<v-row no-gutters class="px-8 d-flex flex-row" align="center">
				<h3>Person</h3>
				<v-spacer></v-spacer>
				<v-text-field v-model="search" append-icon="mdi-magnify" hide-details="true" dense label="Search" clearable style="max-width: 400px"></v-text-field>
				<!-- <v-btn
					color="secondary"
					elevation="2"
					small
					rounded
					@click="
						add();
						submition.show = true;
					"
				>
					<v-icon>mdi-plus</v-icon> Add
				</v-btn> -->
			</v-row>
			<v-divider class="mx-8 my-4"></v-divider>
			<v-data-table
				class="mx-8 elevation-2"
				:footer-props="{
					'items-per-page-options': [50, 100, 200, -1]
				}"
				:search="search"
				:items-per-page="50"
				:headers="headers"
				:items="data"
				:loading="loading"
			>
				<template v-slot:[`item.active`]="{ item }">
					<v-icon color="success" v-if="item.active == true">mdi-check</v-icon>
					<v-icon color="primary" v-else>mdi-minus</v-icon>
				</template>
			</v-data-table>
		</v-card>
	</v-col>
</template>

<script>
import axios from "axios";

export default {
	data: () => ({
		loading: true,
		search: "",
		data: [],
		options: {},
		headers: [
			{ text: "ID", value: "id" },
			{ text: "Name", value: "name" },
			{ text: "Email", value: "email" },
			{ text: "Active", value: "active" }
		]
	}),
	//this one will populate new data set when user changes current page.
	watch: {
		options: {
			handler() {
				this.personList();
			}
		},
		deep: true
	},
	methods: {
		//Reading data from API method.
		personList() {
			this.loading = true;
			axios.get("/person/list").then((response) => {
				this.loading = false;
				this.data = response.data;
			});
		}
		/* Server Side Data Table Pagination */
		// personDatatables() {
		// 	this.loading = true;
		// 	const { sortBy, sortDesc, page, itemsPerPage } = this.options;
		// 	let pageIndex = page - 1;
		// 	axios.get(`/person/datatables?sortBy=${sortBy[0]}&sortDesc=${sortDesc[0]}&pageIndex=${pageIndex}&pageSize=${itemsPerPage}`).then((response) => {
		// 		this.loading = false;
		// 		this.data = response.data.item1;
		// 		this.serverItemsLength = response.data.item2;
		// 	});
		// }
	},
	//this will trigger in the onReady State
	mounted() {
		this.$store.state.title = "People";
		this.personList();
		// this.personDatatables();
	}
};
</script>
