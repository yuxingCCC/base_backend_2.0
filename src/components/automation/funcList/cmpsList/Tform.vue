<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners" @close="onClose" append-to-body width="700px" modal-append-to-body :close-on-click-modal="false">
			<el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="145px" style="width: 500px;">
				<el-form-item label="文件名" prop="fileName">
					<el-input v-model="formData.fileName" placeholder="请输入文件名" clearable :style="{ width: '100%' }">
						<template slot="prepend">Cmps</template>
						<template slot="append">.vue</template>
					</el-input>
				</el-form-item>
				<el-form-item label="是否添加头部按钮" :prop="formData.ishead ? 'headBtn' : ''">
					<el-radio v-model="formData.ishead" :label="true">是</el-radio>
					<el-radio v-model="formData.ishead" :label="false" @change="formData.headBtn = '',$refs.elForm.clearValidate()">否</el-radio>
					<el-input v-if="formData.ishead" v-model="formData.headBtn" placeholder="请输入头部按钮名称(如 新增 | 新增账号 )" clearable></el-input>
					<AutoTypeColor title="按钮颜色" v-if="formData.ishead" v-model="formData.headColor" :formData="formData" :type="1" />
				</el-form-item>

				<el-form-item label="是否添加操作按钮" :prop="formData.isOption ? 'optionBtn' : ''">
					<el-radio v-model="formData.isOption" :label="true">是</el-radio>
					<el-radio v-model="formData.isOption" :label="false" @change="formData.optionBtn = '',$refs.elForm.clearValidate()">否</el-radio>
					<el-input v-if="formData.isOption" v-model="formData.optionBtn" placeholder="请输入操作按钮名称(如 编辑 | 编辑账号 )" clearable></el-input>
					<AutoTypeColor title="按钮颜色" v-if="formData.isOption" v-model="formData.optionColor" :formData="formData" :type="2" />
				</el-form-item>

				<el-form-item label="新增/修改的接口">
					<el-radio v-model="formData.isApiTwo" :label="true">新增修改二合一</el-radio>
					<el-radio v-model="formData.isApiTwo" :label="false">新增修改分开</el-radio>
					<AutoSelectApi v-if="formData.isApiTwo" v-model="formData.updateUrl" title="新增/修改" :apiOptions="apiOptions" />
					<AutoSelectApi v-if="!formData.isApiTwo" v-model="formData.addUrl" title="新增接口" :apiOptions="apiOptions" />
					<AutoSelectApi v-if="!formData.isApiTwo" v-model="formData.updateUrl" title="修改接口" :apiOptions="apiOptions" style="margin-top: 6px;" />
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="onClose">取消</el-button>
				<el-button type="primary" @click="handelConfirm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import AutoSelectApi from "../../component/AutoSelectApi.vue";
import AutoTypeColor from "../../component/AutoTypeColor.vue";
import { getTform } from "../js/funcRequist";
export default {
	inheritAttrs: false,
	components: { AutoTypeColor, AutoSelectApi },
	props: {},
	data() {
		return {
			arr: [],
			apiOptions: [], // api 列表
			obdForm: {},
			formData: {
				fileName: "", // 文件名称
				ishead: true, // 是否添加头部按钮
				isApiTwo: true, // 是否二合一
				isOption: true, // 是否添加操作按钮
				headBtn: "", // 头部按钮
				optionBtn: "", // 操作按钮
				headColor: "primary", // 头部按钮颜色
				optionColor: "primary", // 操作按钮颜色
				updateUrl: [],
				addUrl: [],
			},
			rules: {
				fileName: { required: true, message: "请输入文件名", trigger: "blur" },
				optionBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
				headBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
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
		onClose() {
			this.$refs["elForm"].resetFields();
			this.formData = {
				ishead: true,
				isOption: true,
				isApiTwo: true,
				headColor: "primary",
				optionColor: "primary",
				updateUrl: [],
				addUrl: [],
			};
			this.$emit("update:visible", false);
		},

		handelConfirm() {
			let pageInfo = this.$store.state.common.pageInfo;
			this.$refs["elForm"].validate(async (valid) => {
				if (!valid) return;
				if (!this.formData.isApiTwo) {
					if (!this.formData.addUrl.length) return this.$message.error("请选择添加接口");
					if (!this.formData.updateUrl.length) return this.$message.error("请选择修改接口");
				}
				if (!this.formData.updateUrl.length) return this.$message.error("请选择添加接口");
				let res = await getTform({
					pageInfo,
					formData: this.formData,
				});
				if (res.data.status == 200) {
					console.log(res.data.body);
					this.$message.success(res.data.body);
				}
			});
		},
		
	},
};
</script>
<style lang="scss" scoped>
.select_box {
	.label {
		line-height: 14px;
	}
	.value {
		line-height: 16px;
		color: #888 !important;
		font-size: 12px;
		padding-bottom: 5px;
		border-bottom: 1px solid #00000015;
	}
}
</style>
<style>
.formPopperClass {
	height: 400px !important;
}
.formPopperClass .el-cascader-menu__wrap {
	height: 400px !important;
}
.formPopperClass .el-cascader-node {
	height: 40px !important;
}
</style>
