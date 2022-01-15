<template>
	<v-app>
		<v-app-bar style="padding-left: 55px" absolute :color="$store.state.principal.map.dark_mode ? '#FF6D00' : 'white'" elevate-on-scroll scroll-target="#scrolling-techniques-7">
			<v-toolbar-title :style="{ paddingLeft: '8px', color: $store.state.principal.map.dark_mode ? 'white' : 'primary' }"><b>Quarkus UI</b></v-toolbar-title>
			<v-spacer></v-spacer>
			<!-- <v-toolbar-title class="subtitle" style="color: #03045E; padding-right: 56px; font-size: 1rem"><b>{{ title }}</b></v-toolbar-title>
			<v-spacer></v-spacer> -->
			<v-switch dense hide-details="true" v-model="$store.state.principal.map.dark_mode" @change="onChangeTheme()" inset>
				<template v-slot:label>
					<span class="dark-label">Dark mode</span>
				</template>
			</v-switch>
			<v-divider class="mx-4" inset vertical></v-divider>
			<v-btn small class="mr-1" icon @click="logout">
				<v-icon color="primary">mdi-exit-to-app</v-icon>
			</v-btn>
		</v-app-bar>
		<v-navigation-drawer absolute permanent expand-on-hover>
			<v-list>
				<v-list-item class="px-2">
					<v-list-item-avatar>
						<v-img v-if="$store.state.principal.gender == 'Male'" src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
						<v-img v-else src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
					</v-list-item-avatar>
				</v-list-item>

				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title class="text-h6"> {{ $store.state.principal.name }} </v-list-item-title>
						<v-list-item-subtitle>{{ $store.state.principal.email }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list nav dense>
				<v-list-item to="/person" link>
					<v-list-item-icon>
						<v-icon>mdi-account-multiple</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Person</v-list-item-title>
				</v-list-item>
				<v-list-item to="/product" link>
					<v-list-item-icon>
						<v-icon>mdi-storefront</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Product</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-sheet id="scrolling-techniques-7" class="overflow-y-auto" max-height="100vh">
			<v-main :style="{ backgroundColor: $store.state.principal.map.dark_mode ? '#03045E' : '#F8F8F8', paddingLeft: '56px', paddingTop: '63px', paddingBottom: '0px', minHeight: '100vh', display: 'flex', flexDirection: 'row' }">
				<v-container fluid>
					<router-view :key="$route.fullPath"></router-view>
				</v-container>
			</v-main>
		</v-sheet>

		<v-dialog v-model="showEditPassword" max-width="500">
			<v-card style="padding-bottom: 10px">
				<v-card-title>Change password</v-card-title>
				<v-form ref="formEditPassword" class="px-5">
					<v-text-field v-model="currentPassword" label="Current password" type="password"></v-text-field>
					<v-text-field v-model="newPassword" label="New password" type="password"></v-text-field>
					<v-text-field v-model="confirmNewPassword" label="Confirm new password" type="password"></v-text-field>
				</v-form>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="showEditPassword = false">Cancel</v-btn>
					<v-btn @click="editPassword" color="primary">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="$store.state.notification.show" max-width="500">
			<v-card style="padding: 20px">
				<div style="display: flex; justify-content: space-between">
					<h2 style="margin-bottom: 10px">{{ $store.state.notification.title }}</h2>
					<v-btn icon color="secondary" @click="hideNotification">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</div>

				<template v-if="$store.state.notification.content && $store.state.notification.content.type === 'NOTIFICATION'">
					<div style="color: #c42126; font-size: 14px" :key="item" v-for="item in $store.state.notification.content.fieldErrorList" v-html="item"></div>
					<div style="color: #ed5025; font-size: 14px" :key="item" v-for="item in $store.state.notification.content.errorList" v-html="item"></div>
					<div style="color: #e26026; font-size: 14px" :key="item" v-for="item in $store.state.notification.content.noticeList" v-html="item"></div>
				</template>
				<template v-else>
					<div style="color: #e26026; font-size: 14px" v-html="$store.state.notification.content"></div>
				</template>
				<div style="text-align: center; margin-top: 20px">
					<v-btn color="primary" elevation="0" @click="hideNotification">Close</v-btn>
				</div>
			</v-card>
		</v-dialog>

		<img v-show="$root.loader.value" src="loader.svg" class="loader" />
	</v-app>
</template>

<style scoped>
.v-list .v-list-item--active {
	color: #000269;
}
.dark-label {
	font-size: 1rem;
	font-weight: 500;
}
</style>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";

export default {
	data: function () {
		return {
			drawer: true,
			showEditPassword: false,
			currentPassword: null,
			newPassword: null,
			confirmNewPassword: null,
			showProfile: false,
			mini: true
			// title: ""
		};
	},
	watch: {
		mini: function (o) {
			if (o) {
				this.showProfile = false;
			}
		}
		// $route: {
		// 	immediate: true,
		// 	handler(to, from) {
		// 		this.title = to.meta.title || "";
		// 	}
		// }
	},
	methods: {
		onChangeTheme() {
			let principal = this.$store.state.principal;
			let person = {
				id: principal.id,
				map: principal.map
			};
			this.loading = true;
			axios.put(`/person/map`, person).then((response) => {
				this.loading = false;
			});
		},
		editPassword() {
			axios
				.post("/system/password/edit", {
					currentPassword: this.currentPassword,
					newPassword: this.newPassword,
					confirmNewPassword: this.confirmNewPassword
				})
				.then(() => {
					this.$refs.formEditPassword.reset();
					this.showEditPassword = false;
				})
				.catch(() => {});
		},
		logout() {
			this.$router.push("/");
			// this.$store
			// 	.dispatch("logout")
			// 	.then(() => {
			// 		this.$router.push("/");
			// 	})
			// 	.catch(() => {});
		},
		hideNotification() {
			if (this.$store.state.notification.title === "Unauthorized") {
				this.$store.commit("hideNotification");
				this.$router.push("/");
			} else {
				this.$store.commit("hideNotification");
			}
		}
	}
};
</script>