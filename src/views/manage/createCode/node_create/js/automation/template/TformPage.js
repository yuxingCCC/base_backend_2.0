
module.exports = createTform = (data) => {
	// console.log(vueObj);
	return `<template>
	<div>
		<main-head>
			<el-page-header @back="onBack" :content="id ? '编辑' : '新增'"> </el-page-header>
		</main-head>
		<main-content>
			<el-form :model="formData" ref="elForm" :rules="rules" label-width="120px" :inline="false" v-loading="load" size="small" style="max-width: 700px;">
				<el-form-item label="昵称" prop="name">
					<el-input v-model="formData.name" placeholder="请输入昵称"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="price">
					<el-input v-model="formData.price" placeholder="请输入价格"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" plain @click="onSubmit">完成</el-button>
					<el-button type="danger" plain @click="onClear">清空</el-button>
				</el-form-item>
			</el-form>
		</main-content>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			id: "",
			formData: {},
			rules: {
				name: { message: "请输入名称", required: true, trigger: "blur" },
				price: { message: "请输入价格", required: true, trigger: "blur" },
			},
			load: false,
		};
	},
	watch: {},
	created() {
		this.id = this.$route.query.id || "";
		if (this.id) this.getDetail();
	},
	mounted() {},
	methods: {
		// 清空
		onClear() {
			this.$refs["elForm"].resetFields();
			this.formData = {};
			this.load = false;
		},
		//提交
		onSubmit() {
			this.$refs["elForm"].validate((valid) => {
				if (!valid || this.load) return;
				this.load = true;
				let form = JSON.parse(JSON.stringify(this.formData));
				${data.isApiTwo?'':`let url = !this.id ? "${data.addUrl[1]}" : "${data.updateUrl[1]}";`}
				this.$request.post({
					url: ${data.isApiTwo?`"${data.updateUrl[1]}"`:"url"},
					params: form,
					success: (res) => {
						this.$message.success("操作成功")
						this.onBack()
					},
					error: () => {},
					finally: () => {
						this.load = false;
					},
				});
			});
		},
		// 请求详情
		getDetail() {
			this.load = true;
			this.$request.post({
				url: "xxxxxx",
				params: {
					id: this.id,
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
		onBack() {
			this.$router.back();
		},
	},
};
</script>

<style lang="scss" scoped></style>
`
}