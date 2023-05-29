<template>
	<el-container>
		<LeftNav />
		<el-container id="container">
			<Header />
			<Main />
			<!-- <Footer /> -->
		</el-container>
		<Drawer />
		<Automation v-if="$envConfig.isShowTemplateBtn" />
	</el-container>
</template>

<script>
import Header from "@/components/models/Header";
import LeftNav from "@/components/models/LeftNav";
import Main from "@/components/models/Main";
import Drawer from "@/components/models/Drawer";
import Automation from "@/components/automation/Automation"; // 自动化脚本
// import Footer from '@/components/models/Footer'
import manage from "../mixins/models/manage.js";
export default {
	components: {
		Header,
		LeftNav,
		Main,
		Drawer,
		Automation,
		// Footer
	},
	data() {
		return {};
	},
	watch: {},
	mixins: [manage],
	mounted() {},
	methods: {},
	beforeDestroy() {},
};
</script>

<style>
#container {
	display: flex;
	flex-direction: column;
	width: 100%;
	box-sizing: border-box;
}
</style>

<style scoped></style>
