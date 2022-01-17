<template>
	<v-col>
		<v-card class="py-6" rounded="lg" color="rgba(255, 255, 255, 0.75) !important" style="backdrop-filter: blur(10px)">
			<v-card-title class="px-8 py-0">
				Shop
				<v-spacer></v-spacer>
			</v-card-title>
			<v-divider class="mx-8 my-4"></v-divider>
			<!-- Data table -->
			<v-data-table class="mx-8 px-8 elevation-1" :search="search" :headers="headers" :items="data" sort-by="id">
				<template v-slot:top>
					<!-- Toolbar -->
					<v-toolbar flat rounded="lg" class="pt-2 mb-2 dt-toolbar">
						<v-text-field v-model="search" prepend-icon="mdi-magnify" hide-details="true" dense label="Search" clearable style="max-width: 400px"></v-text-field>
						<v-spacer></v-spacer>

						<!-- Dialog edit -->
						<v-dialog v-model="dialog" max-width="500px">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on"> <v-icon>mdi-plus</v-icon> Add Product</v-btn>
							</template>
							<v-card>
								<v-card-title>
									<span class="text-h5">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-row>
											<v-col cols="6">
												<v-select v-model="editedItem.product" :items="products" label="Product" item-text="name"></v-select>
											</v-col>
											<v-col cols="6">
												<v-text-field v-model="editedItem.quantity" label="Quantity" type="number"></v-text-field>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
									<v-btn color="blue darken-1" text @click="save"> Save </v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<!-- Dialog edit end -->

						<!-- Dialog checkout -->
						<v-btn color="primary" dark class="mb-2 ml-2" @click="checkout"> Checkout </v-btn>

						<!-- <v-dialog v-model="dialog" max-width="500px">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="primary" dark class="mb-2 ml-2" v-bind="attrs" v-on="on"> Checkout </v-btn>
							</template>
							<v-card>
								<v-card-title>
									<span class="text-h5">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-row>
											<v-col cols="6">
												<v-select v-model="editedItem.product" :items="products" label="Product" return-object item-text="name"></v-select>
											</v-col>
											<v-col cols="6">
												<v-text-field v-model="editedItem.quantity" label="Quantity" type="number"></v-text-field>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
									<v-btn color="blue darken-1" text @click="save"> Save </v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog> -->
						<!-- Dialog checkout end -->

						<!-- Dialog delete -->
						<v-dialog v-model="dialogDelete" max-width="550px">
							<v-card>
								<v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
									<v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<!-- Dialog delete end -->
					</v-toolbar>
					<!-- Toolbar end -->
				</template>
				<template v-slot:[`item.total`]="{ item }">
					{{ item.product.price * item.quantity }}
				</template>
				<template v-slot:[`item.active`]="{ item }">
					<span v-if="item.active == true">Unpaid</span>
					<span v-else>Paid</span>
				</template>
				<!-- <template v-slot:[`item.full_name`]="{ item }">{{ item.first_name }} {{ item.last_name }}</template> -->
				<template v-slot:[`item.actions`]="{ item }">
					<v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
					<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
				</template>
			</v-data-table>
			<!-- Data table end -->
		</v-card>
	</v-col>
</template>

<style>
.dt-toolbar .v-toolbar__content,
.v-toolbar__extension {
	padding: 4px 0px;
}
</style>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";

export default {
	data: () => ({
		loading: true,
		search: "",
		options: {},
		products: [],
		data: [],
		dialog: false,
		dialogDelete: false,
		headers: [
			{ text: "ID", value: "id" },
			{ text: "Name", value: "product.name" },
			{ text: "Price", value: "product.price" },
			{ text: "Quantity", value: "quantity" },
			{ text: "Total", value: "total" },
			{ text: "Status", value: "active" },
			{ text: "Actions", value: "actions", sortable: false }
		],
		editedIndex: -1,
		editedItem: {
			id: null,
			map: null,
			product: { id: null },
			person: { id: null },
			quantity: 0
		},
		defaultItem: {
			id: null,
			map: null,
			product: { id: null },
			person: { id: null },
			quantity: 0
		}
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "New Item" : "Edit Item";
		}
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		}
	},

	created() {
		this.initialize();
	},

	methods: {
		initialize() {
			this.loading = true;
			axios.get(`/shop/list`).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				this.data = response.data;
			});
			this.listProduct();
		},

		listProduct() {
			axios.get(`/product/list`).then((response) => {
				//Then injecting the result to datatable parameters.
				this.products = response.data;
			});
		},

		editItem(item) {
			this.editedIndex = this.data.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			this.editedIndex = this.data.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},

		deleteItemConfirm() {
			axios.delete(`/shop/${this.editedItem.id}`).then((response) => {
				this.closeDelete();
			});
		},

		close() {
			this.dialog = false;
			this.loading = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
			this.initialize();
		},

		closeDelete() {
			this.dialogDelete = false;
			this.loading = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
			this.initialize();
		},

		save() {
			this.editedItem.person.id = this.$store.state.principal.id;
			this.loading = true;
			if (this.editedIndex > -1) {
				// update
				axios.put(`/shop/qty`, this.editedItem).then((response) => {
					this.close();
				});
			} else {
				axios.post(`/shop`, this.editedItem).then((response) => {
					this.close();
				});
			}
		},

		checkout() {
			axios
				.put(`/shop/checkout/dummy`, {
					id: this.$store.state.principal.id
				})
				.then((response) => {
					this.close();
				});
		}
	}
};
</script>