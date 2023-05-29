<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners" @close="close" append-to-body width="700px" modal-append-to-body :close-on-click-modal="false" top="60px">
			<el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="145px" style="width: 600px;">
				<el-form-item label="模板">
					<el-radio-group v-model="templateActive" @change="handldtemplate">
						<el-radio-button :label="1">无</el-radio-button>
						<el-radio-button :label="2">审核</el-radio-button>
						<el-radio-button :label="3">上下架</el-radio-button>
						<el-radio-button :label="4">冻结解冻</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="接口" prop="url">
					<AutoSelectApi v-model="formData.url" title="" :apiOptions="apiOptions" @change="changeApi" />
					<el-divider v-if="!formData.url.length"></el-divider>
				</el-form-item>
				<el-form-item label="选择字段" prop="status" v-if="formData.url.length">
					<el-select v-model="formData.status" placeholder="选择字段 (如 status)" clearable filterable style="width: 350px;">
						<el-option v-for="item in tempApiData.data.parameters" :key="item.name" :label="item.description + ' - ' + item.name" :value="item.name"> </el-option>
					</el-select>
					<el-divider></el-divider>
				</el-form-item>

				<el-form-item label="第一个按钮配置" prop="oneBtn">
					<el-col :span="4" :offset="0">按钮名称:</el-col>
					<el-col :span="8" :offset="0"> <el-input v-model="formData.oneBtn" placeholder="( 通过 | 上架 )" clearable></el-input> </el-col>
					<el-col :span="4" :offset="0" style="margin-left: 10px;">{{ formData.status ? formData.status : "status" }}:</el-col>
					<el-col :span="7" :offset="0"> <el-input v-model="formData.oneData" placeholder="如 1 为通过" clearable></el-input> </el-col>
				</el-form-item>
				<el-form-item label="按钮颜色"> <AutoTypeColor v-model="formData.oneColor" :btnName="formData.oneBtn" :type="3" /> </el-form-item>
				<el-form-item label="提示语" prop="oneTitle" style="margin-top: -12px;">
					<el-input v-model="formData.oneTitle" clearable> </el-input>
				</el-form-item>
				<el-form-item label="显示状态" prop="oneShow" style="margin-top: -5px;">
					<el-input v-model="formData.oneShow" placeholder="比如为状态为 1 的时候才显示该按钮" clearable style="width: 250px;"> </el-input>
					<el-popover placement="top-end" width="400" trigger="hover" :open-delay="500">
						<div>v-if="scope.row.status == {{ formData.oneShow }}" ({{ formData.oneShow }}) 就是现在输入的参数</div>
						<i slot="reference" class="el-icon-question" style="font-size: 20px;margin-left: 16px;"> </i>
					</el-popover>
				</el-form-item>
				<el-form-item label="填写原因" style="margin-top: -12px;">
					<el-radio v-model="formData.oneisReason" :label="true">开启</el-radio>
					<el-radio v-model="formData.oneisReason" :label="false">关闭</el-radio>
					<el-divider></el-divider>
				</el-form-item>

				<el-form-item label="第二个按钮配置" prop="twoBtn">
					<el-col :span="4" :offset="0">按钮名称:</el-col>
					<el-col :span="8" :offset="0"> <el-input v-model="formData.twoBtn" placeholder="( 不通过 | 下架 )" clearable></el-input> </el-col>
					<el-col :span="4" :offset="0" style="margin-left: 10px;">{{ formData.status ? formData.status : "status" }}:</el-col>
					<el-col :span="7" :offset="0"> <el-input v-model="formData.twoData" placeholder="如 -1 为不通过" clearable></el-input> </el-col>
				</el-form-item>
				<el-form-item label="按钮颜色"> <AutoTypeColor v-model="formData.twoColor" :btnName="formData.twoBtn" :type="3" /> </el-form-item>
				<el-form-item label="提示语" prop="twoTitle" style="margin-top: -12px;">
					<el-input v-model="formData.twoTitle" clearable> </el-input>
				</el-form-item>
				<el-form-item label="显示状态" prop="twoShow" style="margin-top: -5px;">
					<el-input v-model="formData.twoShow" placeholder="比如为状态为 1 的时候才显示该按钮" clearable style="width: 250px;"> </el-input>
					<el-popover placement="top-end" width="400" trigger="hover" :open-delay="500">
						<div>v-if="scope.row.status == {{ formData.twoShow }}" ({{ formData.twoShow }}) 就是现在输入的参数</div>
						<i slot="reference" class="el-icon-question" style="font-size: 20px;margin-left: 16px;"> </i>
					</el-popover>
				</el-form-item>
				<el-form-item label="填写原因" style="margin-top: -12px;">
					<el-radio v-model="formData.twoisReason" :label="true">开启</el-radio>
					<el-radio v-model="formData.twoisReason" :label="false">关闭</el-radio>
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
import AutoTypeColor from "../../component/AutoTypeColor.vue";
import AutoSelectApi from "../../component/AutoSelectApi.vue";

import { getTtwoReason  } from "../js/funcRequist";
export default {
	inheritAttrs: false,
	components: { AutoTypeColor, AutoSelectApi },
	props: {},
	data() {
		return {
			templateActive: 1,
			tempApiData: {},
			apiList: [],
			apiOptions: [],
			obdForm: {},
			formData: {
				oneBtn: "通过",
				oneColor: "success",
				oneTitle: "此操作将通过审核, 是否继续?",
				twoBtn: "不通过",
				twoColor: "danger",
				twoTitle: "请填写拒绝原因",
				oneData: "",
				twoData: "",
				url: [],
				status: "",
				oneisReason: false,
				twoisReason: true,
				oneShow: "",
				twoShow: "",
			},
			rules: {
				url: { required: true, message: "请选择接口", trigger: "blur" },
				status: { required: true, message: "请选择字段", trigger: "blur" },
				oneBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
				twoBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
				oneTitle: { required: true, message: "请输入提示语", trigger: "blur" },
				twoTitle: { required: true, message: "请输入提示语", trigger: "blur" },
				oneShow: { required: true, message: "请输入显示状态", trigger: "blur" },
				twoShow: { required: true, message: "请输入显示状态", trigger: "blur" },
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
		/**选择api后 */
		changeApi(e) {
			this.tempApiData = this.apiList.find((item) => item.urlName == e[1]);
			let data = this.tempApiData.data.parameters.find((item) => item.name == "status" || item.name == "type") || {};
			this.formData.status = data.name;
		},
		async init() {
			[this.apiOptions, this.apiList] = await this.$common.getApiList();
		},
		close() {
			this.$refs["elForm"].resetFields();

			this.$emit("update:visible", false);
		},

		handelConfirm() {
			let pageInfo = this.$store.state.common.pageInfo;
			this.$refs["elForm"].validate(async (valid) => {
				if (!valid) return;
				let name = this.formData.url[1].split("/");
				this.formData.name = name[name.length - 1];

				console.log(this.formData);
				let res = await getTtwoReason({
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
		// 模板选择
		handldtemplate(e) {
			e == 1 &&
				(this.formData = {
					oneBtn: "",
					oneColor: "success",
					oneTitle: "此操作将xxx, 是否继续?",
					twoBtn: "",
					twoColor: "danger",
					twoTitle: "请填写拒绝原因",
					oneData: "",
					twoData: "",
					url: [],
					status: "",
					oneisReason: false,
					twoisReason: true,
					oneShow: "",
					twoShow: "",
				});
			e == 2 &&
				(this.formData = {
					oneBtn: "通过",
					oneColor: "success",
					oneTitle: "此操作将通过审核, 是否继续?",
					twoBtn: "不通过",
					twoColor: "danger",
					twoTitle: "请填写拒绝原因",
					oneData: "1",
					twoData: "-1",
					url: [],
					status: "status",
					oneisReason: false,
					twoisReason: true,
					oneShow: "0",
					twoShow: "0",
				});
			e == 3 &&
				(this.formData = {
					oneBtn: "上架",
					oneColor: "success",
					oneTitle: "此操作将上架, 是否继续?",
					twoBtn: "下架",
					twoColor: "warning",
					twoTitle: "请填写下架原因",
					oneData: "1",
					twoData: "-1",
					url: [],
					status: "status",
					oneisReason: false,
					twoisReason: true,
					oneShow: "-1",
					twoShow: "1",
				});
			e == 4 &&
				(this.formData = {
					oneBtn: "解冻",
					oneColor: "success",
					oneTitle: "此操作将解冻, 是否继续?",
					twoBtn: "冻结",
					twoColor: "warning",
					twoTitle: "请填写冻结原因",
					oneData: "1",
					twoData: "-1",
					url: [],
					status: "status",
					oneisReason: false,
					twoisReason: true,
					oneShow: "-1",
					twoShow: "1",
				});
		},
	},
};
</script>
<style lang="scss" scoped></style>
