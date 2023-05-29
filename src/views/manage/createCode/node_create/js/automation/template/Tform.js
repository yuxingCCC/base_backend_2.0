
module.exports = createTform = (data) => {
	// console.log(vueObj);
	return `<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners" @open="open" @close="close" :title="formData.id ? '编辑' : '新增'">
			<el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="145px" v-loading="load">
				<el-form-item label="账户名" prop="account">
					<el-input v-model="formData.account" placeholder="请输入账户名" :maxlength="15" show-word-limit clearable ></el-input>
				</el-form-item>
				<el-form-item label="名字" prop="name">
					<el-input v-model="formData.name" placeholder="请输入名字" :maxlength="11" show-word-limit clearable ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="handelConfirm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	inheritAttrs: false,
	components: {},
	props: {},
	data() {
		return {
			load: false,
			obdForm: {},
			formData: {
				account: "",
				name: "",
			},
			rules: {
				account: { required: true, message: "请输入账户名", trigger: "blur" },
				name: { required: true, message: "请输入名字", trigger: "blur" },
			},
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		open() {},
		// 关闭弹窗
		close() {
			this.$refs["elForm"].resetFields();
			this.formData = {};
			this.$emit("update:visible", false);
			this.load = false;
		},
		// 请求详情
		getDetail() {
			if (this.load) return;
			this.load = true;
			this.$request.post({
				url: "xx",
				params: {
					id: this.formData.id
				},
				success: (res) => {
					this.formData = res;
				},
				error: () => {},
				finally: () => {
					this.load = false;
				},
			});
		},
		// 确认
		handelConfirm() {
			this.$refs["elForm"].validate((valid) => {
				if (!valid) return;
				let form = JSON.parse(JSON.stringify(this.formData))
				${data.isApiTwo?'':`let url = !form.id ? "${data.addUrl[1]}" : "${data.updateUrl[1]}";`}
				if (this.load) return;
				this.load = true;
				this.$request.post({
					url: ${data.isApiTwo?`"${data.updateUrl[1]}"`:"url"},
					params: form,
					success: (res) => {
						this.$message.success("操作成功!");
						this.$emit("success");
						this.close();
					},
					error: () => {},
					finally: () => {
						this.load = false;
					},
				});
			});
		},
	},
};
</script>
<style lang="scss" scoped>

</style>
`
}