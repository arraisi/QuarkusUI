<template>
	<v-col>
		<v-card class="py-6" rounded="lg" color="rgba(255, 255, 255, 0.75) !important" style="backdrop-filter: blur(10px)">
			<v-card-title class="px-8 py-0">
				Product
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
								<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> New Product </v-btn>
							</template>
							<v-card>
								<v-card-title>
									<span class="text-h5">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-row>
											<v-col cols="12">
												<v-text-field v-model="editedItem.name" label="Name*" required></v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field v-model="editedItem.price" label="Price*" append-icon="mdi-currency-usd" type="number" required></v-text-field>
											</v-col>
											<v-col cols="6">
												<v-text-field v-model="editedItem.quantity" label="Stock*" type="number" required></v-text-field>
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

						<!-- Dialog delete -->
						<v-dialog v-model="dialogDelete" max-width="550px">
							<v-card>
								<v-card-title class="text-h5">Are you sure you want to delete this product?</v-card-title>
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
		dialog: false,
		dialogDelete: false,
		headers: [
			{ text: "ID", value: "id" },
			{ text: "Name", value: "name" },
			{ text: "Price", value: "price" },
			{ text: "Stock", value: "quantity" },
			{ text: "Actions", value: "actions", sortable: false }
		],
		data: [],
		editedIndex: -1,
		editedItem: {
			id: null,
			quantity: 0,
			price: 0
		},
		defaultItem: {
			id: null,
			quantity: 0,
			price: 0
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
			axios.get(`/product/list`).then((response) => {
				//Then injecting the result to datatable parameters.
				this.loading = false;
				this.data = response.data;
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
			axios.delete(`/product/${this.editedItem.id}`).then((response) => {
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
			this.loading = true;
			if (this.editedIndex > -1) {
				axios.put(`/product`, this.editedItem).then((response) => {
					this.close();
				});
			} else {
				axios.post(`/product`, this.editedItem).then((response) => {
					this.close();
				});
			}
		}
	}
};
</script>