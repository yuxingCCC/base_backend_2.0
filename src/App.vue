<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
import app from "./mixins/models/app.js";

export default {
	mixins:[app], // 适配代码
	created() {},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss">
@import url("./assets/css/element-ui.css");
@import url("./assets/css/public.css"); // 公共类
@import url("./assets/fonts/icon.css"); // ui
@import url("./assets/css/adaptive.css"); // 移动端适配代码
</style>
