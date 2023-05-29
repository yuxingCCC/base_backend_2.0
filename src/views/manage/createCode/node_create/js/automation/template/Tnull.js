
module.exports = createTnull = (data) => {
    // console.log(vueObj);
    return `<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="标题"> </el-dialog>
	</div>
</template>
<script>
export default {
	inheritAttrs: false,
	components: {},
	props: {},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		onOpen() {},
		onClose() {
			this.$emit("update:visible", false);
		},

		handelConfirm() {
			this.$emit("success");
			this.$message.success("操作成功!");
			this.onClose();
		},
	},
};
</script>
<style lang="scss" scoped>

</style>
`
}