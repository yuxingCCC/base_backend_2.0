<template>
	<div>
		<el-dialog v-bind="$attrs" v-on="$listeners" @close="close" append-to-body width="700px" modal-append-to-body :close-on-click-modal="false">
			<el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="145px" style="width: 500px;">
				<el-form-item label="文件名" prop="fileName">
					<el-input v-model="formData.fileName" placeholder="请输入文件名" clearable :style="{ width: '100%' }">
						<template slot="prepend">Child</template>
						<template slot="append">.vue</template>
					</el-input>
				</el-form-item>
				<el-form-item label="页面名称" prop="pageName">
					<el-input v-model="formData.pageName" placeholder="请输入文件名" clearable :style="{ width: '100%' }"> </el-input>
				</el-form-item>
				<el-form-item label="路由">
					<span style="color:#999">{{ routerUrl }}</span>
				</el-form-item>
				<el-form-item label="是否添加头部按钮" :prop="formData.ishead ? 'headBtn' : ''">
					<el-radio v-model="formData.ishead" :label="true">是</el-radio>
					<el-radio v-model="formData.ishead" :label="false" @change="formData.headBtn = ''">否</el-radio>
					<el-input v-if="formData.ishead" v-model="formData.headBtn" placeholder="请输入头部按钮名称(如 新增 | 新增账号 )" clearable></el-input>
					<AutoTypeColor title="按钮颜色" v-if="formData.ishead" v-model="formData.headColor" :formData="formData" :type="1" />
				</el-form-item>

				<el-form-item label="是否添加操作按钮" :prop="formData.isOption ? 'optionBtn' : ''">
					<el-radio v-model="formData.isOption" :label="true">是</el-radio>
					<el-radio v-model="formData.isOption" :label="false" @change="formData.optionBtn = ''">否</el-radio>
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
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="handelConfirm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import AutoTypeColor from "../../component/AutoTypeColor.vue";
import AutoSelectApi from "../../component/AutoSelectApi.vue";

import { getTformPage } from "../js/funcRequist";
export default {
	inheritAttrs: false,
	components: { AutoTypeColor,AutoSelectApi },
	props: {},
	data() {
		return {
			apiOptions:[],
			obdForm: {},
			formData: {
				pageName: "", // 页面名称
				fileName: "",
				ishead: true, // 是否添加头部按钮
				isOption: true, // 是否添加操作按钮
				headBtn: "", // 头部按钮
				optionBtn: "", // 操作按钮
				headColor: "primary",
				optionColor: "primary",

				isApiTwo:true,
				updateUrl: [],
				addUrl: [],
			},
			rules: {
				pageName: { required: true, message: "请输入页面名称", trigger: "blur" },
				fileName: { required: true, message: "请输入文件名", trigger: "blur" },
				optionBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
				headBtn: { required: true, message: "请输入按钮名称", trigger: "blur" },
			},
		};
	},
	computed: {
		routerUrl() {
			let routerPath = this.$store.state.common.pageInfo.path.split("/");
			routerPath.splice(routerPath.length - 1, 1);
			return routerPath.join("/") + "/Child" + this.formData.fileName;
		},
	},
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
			this.formData = {
				ishead: false,
				isOption: false,
				headColor: "primary",
				optionColor: "primary",
			};
			this.$emit("update:visible", false);
		},

		handelConfirm() {
			let pageInfo = this.$store.state.common.pageInfo;
			this.$refs["elForm"].validate(async (valid) => {
				if (!valid) return;
				let res = await getTformPage({
					pageInfo,
					formData: this.formData,
				});
				if (res.data.status == 200) {
					console.log(res.data.body);
					this.$message.success(res.data.body);
					await this.createMenu(pageInfo)
					this.close();
				}
			});
		},
		//生成子菜单
		createMenu(pageInfo) {
			return new Promise((resolve, reject) => {
				let requestUrl = pageInfo.path.split("/");
				requestUrl.splice(requestUrl.length - 1, 1);
				requestUrl = requestUrl.join("/") + "/Child" + this.formData.fileName;
				let component = pageInfo.component.split("/")
				component.splice(component.length - 1, 1);
				component = component.join("/") + "/Child" + this.formData.fileName;
				let menuList = JSON.parse(window.sessionStorage.getItem('menuList'))||[]

				let parentId = menuList.find(item=>item.component==pageInfo.component)?.parentId
				this.$request.post({
					url: "admin/adMenu/add",
					params: {
						parentId,
						menuName: this.formData.pageName,
						requestUrl,
						component,
						type: -1,
						parentFlag: 1,
					},
					success: (res) => {
						resolve(res);
						this.getMenuAll();
						this.$message.success("成功生成页面");
						
					},
					error: (err) => {
						reject(err);
					},
				});
			});
		},
		// 请求所有菜单
		getMenuAll(){
			this.$request.post({
				url: 'admin/adMenu/allList',
				success: (res) => {
					sessionStorage.setItem('menuList', JSON.stringify(res));
					this.$pubsub.publish('refreshMenuData')
					setTimeout(() => {
						window.location.reload(); 
					}, 1000);
				},
				error:()=>{},
				finally:()=>{}
			});
		}
	},
};
</script>
<style lang="scss" scoped></style>
