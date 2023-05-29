<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners"  @close="close" append-to-body width="700px" modal-append-to-body :close-on-click-modal="false">
			<el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="145px" style="width: 500px;">
				<el-form-item label="文件名" prop="fileName">
					<el-input v-model="formData.fileName" placeholder="请输入文件名" clearable :style="{ width: '100%' }">
						<template slot="prepend">Cmps</template>
						<template slot="append">.vue</template>
					</el-input>
				</el-form-item>
				<el-form-item label="是否添加头部按钮" :prop="formData.ishead ? 'headBtn' : ''">
					<el-radio v-model="formData.ishead" :label="true">是</el-radio>
					<el-radio v-model="formData.ishead" :label="false" @change="formData.headBtn = ''">否</el-radio>
					<el-input v-if="formData.ishead" v-model="formData.headBtn" placeholder="请输入头部按钮名称(如 新增 | 新增账号 )" clearable></el-input>
					<AutoTypeColor title="按钮颜色" v-if="formData.ishead" v-model="formData.headColor" :formData="formData" :type="1"/>
				</el-form-item>

				<el-form-item label="是否添加操作按钮" :prop="formData.isOption ? 'optionBtn' : ''">
					<el-radio v-model="formData.isOption" :label="true">是</el-radio>
					<el-radio v-model="formData.isOption" :label="false" @change="formData.optionBtn = ''">否</el-radio>
					<el-input v-if="formData.isOption" v-model="formData.optionBtn" placeholder="请输入操作按钮名称(如 编辑 | 编辑账号 )" clearable></el-input>
					<AutoTypeColor title="按钮颜色" v-if="formData.isOption" v-model="formData.optionColor" :formData="formData" :type="2"/>
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
import AutoTypeColor from '../../component/AutoTypeColor.vue';
import { getTnull } from "../js/funcRequist";
export default {
	inheritAttrs: false,
	components: {AutoTypeColor},
	props: {},
	data() {
		return {
			obdForm: {},
			formData: {
				fileName: undefined,
				ishead: false, // 是否添加头部按钮
				isOption: false, // 是否添加操作按钮
				headBtn: "", // 头部按钮
				optionBtn: "", // 操作按钮
				headColor:"primary",
				optionColor:"primary",

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
	created() {},
	mounted() {},
	methods: {
		close() {
			this.$refs["elForm"].resetFields();
			this.formData = {
				ishead: false,
				isOption: false,
				headColor:"primary",
				optionColor:"primary",
			};
			this.$emit("update:visible", false);
		},

		handelConfirm() {
			let pageInfo = this.$store.state.common.pageInfo;
			this.$refs["elForm"].validate(async (valid) => {
				if (!valid) return;
				let res = await getTnull({
					pageInfo,
					formData: this.formData,
				});
				if (res.data.status == 200) {
					console.log(res.data.body);
					this.$message.success(res.data.body);
					this.close()
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>

</style>
