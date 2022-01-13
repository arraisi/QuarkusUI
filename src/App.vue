<template>
	<div>
		<router-view v-if="loaded"></router-view>
	</div>
</template>

<style>
.pointer {
	cursor: pointer;
}
.loader {
	position: fixed;
	z-index: 888;
	top: 30%;
	left: 50%;
	transform: translateX(-50%);
}
div.app {
	margin: 0px;
}
div.banner {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9;
	padding: 5px 10px;
	border-radius: 0 0 5px 5px;
	font-family: "Open Sans", sans-serif;
}
.ellipsis {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>

<script>
/* eslint-disable no-console */

export default {
	data: function () {
		return {
			loaded: false
		};
	},
	mounted: function () {
		document.fonts.ready.then(
			function () {
				this.loaded = true;
			}.bind(this)
		);
	}
};
</script>