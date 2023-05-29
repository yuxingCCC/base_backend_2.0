<template>
	<div>
		<el-popover v-for="(item, index) in list" :key="index" placement="top-start" width="200" :open-delay="500" trigger="hover">
			<el-link type="primary" :href="item.href" target="_blank">使用说明链接</el-link>
			<div>{{ item.title }}</div>
			<el-button slot="reference" :type="item.type" size="small" @click="handClick(item, index)">{{ item.btnText }}</el-button>
		</el-popover>
		<template v-for="(item, index) in list">
			<component v-if="item.show" :key="item.btnText" :title="item.btnText" :is="item.cmps" :visible.sync="item.show" />
		</template>
	</div>
</template>

<script>
import funcList from "./js/funcList.js";
export default {
	data() {
		return {
			activeObj: {},
			show: false,
			list: funcList,
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {},
		handClick(item, index) {
			this.activeObj = JSON.parse(JSON.stringify(item));
			// this.activeIndex = index
			item.show = true;
			// this.show = true
		},
	},
};
</script>

<style lang="scss" scoped></style>
