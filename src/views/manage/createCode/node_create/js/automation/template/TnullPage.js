
module.exports = createTnullPage = (data) => {
    return `<template>
	<div>
		<main-head>
			<el-page-header @back="onBack" content="${data.formData.pageName}"> </el-page-header>
		</main-head>
		<main-content>
			内容
		</main-content>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			load: false,
		};
	},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		onBack() {
			this.$router.back();
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
`
}