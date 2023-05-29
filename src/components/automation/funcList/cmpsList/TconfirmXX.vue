<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners" @close="close" append-to-body width="700px" modal-append-to-body :close-on-click-modal="false">
			<el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="145px" style="width: 500px;">
				<el-form-item label="函数名" prop="name">
					<el-input v-model="formData.name" placeholder="请输入函数名" :style="{ width: '60%' }">
						<template slot="prepend">handle</template>
						<!-- <template slot="append">.vue</template> -->
					</el-input>
					<span style="padding: 0 10px;font-size: 13px;">handle{{ formData.name }}</span>
				</el-form-item>
				<el-form-item label="提示语" prop="title">
					<el-input v-model="formData.title" clearable> </el-input>
				</el-form-item>
				<el-form-item label="操作按钮设置" prop="optionBtn">
					<el-input v-model="formData.optionBtn" placeholder="请输入操作按钮名称(如 删除 | 冻结 )" clearable></el-input>
					<AutoTypeColor title="按钮颜色" v-model="formData.optionColor" :formData="formData" :type="2" />
				</el-form-item>

				<el-form-item prop="url">
					<AutoSelectApi v-model="formData.url" title="接口" :apiOptions="apiOptions" style="margin-top: 6px;" />
				</el-form-item>

				<el-form-item >
					<span class="error">此模板只支持单接口操作, 默认传参 id </span>
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
import AutoSelectApi from "../../component/AutoSelectApi.vue";
import AutoTypeColor from "../../component/AutoTypeColor.vue";
import { getTconfirmXX } from "../js/funcRequist";
export default {
	inheritAttrs: false,
	components: { AutoTypeColor, AutoSelectApi },
	props: {},
	data() {
		return {
			apiOptions: [],
			obdForm: {},
			formData: {
				title:"此操作将永久删除该XXX, 是否继续?",
				name: "",
				optionBtn: "", // 操作按钮
				optionColor: "danger",
				url: [],
			},
			rules: {
				name: { required: true, message: "请输入函数名", trigger: "blur" },
				title: { required: true, message: "请输入提示", trigger: "blur" },
				optionBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
				url: { required: true, message: "请选择接口", trigger: "blur" },
			},
		};
	},
	computed: {},
	watch: {},
	created() {
		this.init();
	},
	mounted() {},
	methods: {
		async init() {
			[this.apiOptions] = await this.$common.getApiList()
		},
		close() {
			this.$refs["elForm"].resetFields();
			// this.formData = {
			// 	optionColor: "primary",
			// 	url: [],
			// };
			this.$emit("update:visible", false);
		},

		handelConfirm() {
			let pageInfo = this.$store.state.common.pageInfo;
			this.$refs["elForm"].validate(async (valid) => {
				if (!valid) return;
				let res = await getTconfirmXX({
					pageInfo,
					formData: this.formData,
				});
				if (res.data.status == 200) {
					console.log(res.data.body);
					this.$message.success(res.data.body);
					this.close;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped></style>
