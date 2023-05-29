<template>
	<el-card shadow="never" class="test_card" style="">
		<test v-if="isTest" />
		<el-button type="primary" class="text_btn" size="small" @click="refreshView">刷新表格</el-button>
	</el-card>
</template>

<script>
import test from "./test_cmps/test2.vue";

export default {
	components: {
		test,
	},
	data() {
		return {
			isTest: true,
		};
	},
	methods: {
		refreshView() {
			this.isTest = false;
			setTimeout(() => {
				this.isTest = true;
			}, 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.text_btn {
	position: absolute;
	right: 10px;
	top: 10px;
}
.test_card {
	border-color: #409eff88;
	height: 400px;
	max-height: 400px;
	overflow: auto;
	position: relative;
}
</style>
