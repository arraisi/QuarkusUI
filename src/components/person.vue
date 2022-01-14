<template>
	<v-container fluid>
		<v-col>
			<v-data-table
				class="elevation-2"
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
				<template v-slot:[`item.active`]="{ item }">
					<v-icon color="success" v-if="item.active == true">mdi-check</v-icon>
					<v-icon color="primary" v-else>mdi-minus</v-icon>
				</template>
			</v-data-table>
		</v-col>
	</v-container>
</template>

<script>
import axios from "axios";

export default {
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
				this.data = response.data.data;
			});
		},
		personDatatables() {
			this.loading = true;
			const { sortBy, sortDesc, page, itemsPerPage } = this.options;
			let pageIndex = page - 1;
			axios.get(`/person/datatables?sortBy=${sortBy[0]}&sortDesc=${sortDesc[0]}&pageIndex=${pageIndex}&pageSize=${itemsPerPage}`).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				this.data = response.data.item1;
				this.serverItemsLength = response.data.item2;
			});
		}
	},
	//this will trigger in the onReady State
	mounted() {
		this.$store.state.title = "People";
		this.personList();
		this.personDatatables();
	}
};
</script>
