<template>
	<v-col>
		<v-card class="py-6" rounded="lg">
			<v-row no-gutters class="px-8 d-flex flex-row" align="center">
				<h3>Product</h3>
				<v-spacer></v-spacer>
				<v-text-field class="px-4" v-model="search" append-icon="mdi-magnify" hide-details="true" dense label="Search" clearable style="max-width: 400px"></v-text-field>
				<v-btn
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
				</v-btn>
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
				<template v-slot:[`item.edit`]="{ item }">
					<v-btn tile small icon @click="edit(item)" class="no-background-hover mr-0">
						<v-icon color="info">mdi-square-edit-outline</v-icon>
					</v-btn>
				</template>
			</v-data-table>
		</v-card>

		<!---Edit Sales--->
		<v-dialog v-model="submition.show" persistent max-width="600px">
			<v-card>
				<v-card-title>
					<span class="text-h5">Edit Product</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<v-text-field v-model="product.name" label="Name*" required></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<v-text-field append-icon="mdi-currency-usd" v-model="product.price" label="Price*" type="number" required></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="6">
								<v-text-field v-model="product.quantity" label="Stock*" type="number" required></v-text-field>
							</v-col>
						</v-row>
						<small>*indicates required field</small>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" text @click="submition.show = false"> Close </v-btn>
					<v-btn
						color="info"
						text
						@click="
							submition.show = false;
							submition.update ? update() : save();
						"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-col>
</template>

<script>
/* eslint-disable no-unused-vars */
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
			{ text: "Price", value: "price" },
			{ text: "Stock", value: "quantity" },
			{ text: "", value: "edit", sortable: false, align: "center", class: "edit" }
		],
		submition: { show: false, status: false, update: false },
		product: {
			quantity: 0,
			price: 0
		}
	}),
	//this one will populate new data set when user changes current page.
	watch: {
		options: {
			handler() {
				this.productDatatables();
			}
		},
		deep: true
	},
	methods: {
		list() {
			this.loading = true;
			axios.get(`/product/list`).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				this.data = response.data;
			});
		},
		add() {
			this.product = {};
			this.product.quantity = 0;
			this.product.price = 0;
		},
		edit(item) {
			this.product = item;
			this.submition.show = true;
			this.submition.update = true;
		},
		save() {
			this.loading = true;
			axios.post(`/product`, this.product).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				this.submition.show = false;
				this.productDatatables();
			});
		},
		update() {
			this.loading = true;
			axios.put(`/product`, this.product).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				this.submition.show = false;
				this.submition.update = false;
			});
		}
	},
	//this will trigger in the onReady State
	mounted() {
		this.list();
	}
};
</script>
