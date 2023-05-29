<template>
	<div>
		<el-card shadow="never" :body-style="{ padding: '20px' }" class="card_box">
			<div slot="header">
				<b style="font-size: 18px;">设置页面属性</b>
				<el-button style="float: right;" type="success" size="mini" @click="createFile">生成文件</el-button>
			</div>
			<el-form label-position="right" ref="form" label-width="120px" :rules="rules" :model="form">
				<el-row :gutter="20">
					<el-col :span="24" :offset="0">
						<el-form-item label="生成父级菜单" prop="isCreateParentMenu">
							<el-radio v-model="form.isCreateParentMenu" :label="1" @change="form.parentId = ''">是</el-radio>
							<el-radio v-model="form.isCreateParentMenu" :label="2">否</el-radio>
						</el-form-item>
					</el-col>
					<el-col :span="10" :offset="0" v-if="form.isCreateParentMenu == 1">
						<el-form-item label="根菜单名称" prop="parentMenuName">
							<el-input v-model="form.parentMenuName" placeholder="左侧父级菜单名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset="0" v-if="form.isCreateParentMenu == 1">
						<el-form-item label="根菜单图标" prop="parentMenuName">
							<div style="display: flex;">
								<i :class="form.parentMenuIcon" style="font-size: 30px;margin-right: 20px;"></i>
								<el-button type="primary" size="mini" @click="selectIconShow = true">选择</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="8" :offset="0" v-if="form.isCreateParentMenu == 1">
						<el-form-item label="操作" >
							<el-button type="success" size="small" @click="createParentMenu(form)">生成根菜单</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="18" :offset="0" v-if="form.isCreateParentMenu == 2">
						<el-form-item label="父级菜单" prop="parentId">
							<el-select v-model="form.parentId" placeholder="选择生成在某个菜单下" clearable filterable @change="parentSelect">
								<el-option v-for="item in menuList" :key="item.id" :label="item.menuName" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="form.isCreateMenu==1?12:24" :offset="0">
						<el-form-item label="生成菜单" prop="isCreateMenu">
							<el-radio v-model="form.isCreateMenu" :label="1">是</el-radio>
							<el-radio v-model="form.isCreateMenu" :label="2" @change="form.menuName = ''">否</el-radio>
						</el-form-item>
					</el-col>
					<el-col :span="12" :offset="0" v-if="form.isCreateMenu==1">
						<el-form-item label="菜单的名称" prop="menuName" >
							<el-input v-model="form.menuName" placeholder="左侧菜单名称"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12" :offset="0">
						<el-form-item label="父文件夹位置" prop="folder">
							<el-input v-model="form.folder" placeholder="该模块文件夹名称(如:authority)" @input="componentInput($event, 1)">
								<template slot="prepend">manage/</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :offset="0">
						<el-form-item label="文件夹" prop="fileFolderName">
							<el-input v-model="form.fileFolderName" placeholder="文件文件夹名称(如:account)" @input="componentInput($event, 2)"> </el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :offset="0">
						<el-form-item label="文件名" prop="fileName">
							<el-input v-model="form.fileName" placeholder="文件名称(如:List 或者 AccountList) 将会覆盖同级同名文件" @input="componentInput($event, 2)"> </el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :offset="0">
						<el-form-item label="路由" prop="requestUrl">
							<el-input v-model="form.requestUrl" placeholder="路由将自动根据文件路径生成, 方便找到页面文件所在" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20"> </el-row>
				<el-row :gutter="20">
					<!-- <el-col :span="12" :offset="0">
						<el-form-item label="路由" prop="requestUrl">
							<el-input v-model="form.requestUrl" :disabled="true"></el-input>
						</el-form-item>
					</el-col> -->
				</el-row>
			</el-form>
			<main-content>
				<!-- <el-button type="primary" size="small" @click="null">复制代码</el-button> -->
			</main-content>
		</el-card>
		<dialogIcon v-model="selectIconShow" :parentMenuIcon.sync="form.parentMenuIcon" />
	</div>
</template>

<script>
import { createTableFile } from "../js/createTable";
import DialogIcon from "./tableForm_cmps/DialogIcon.vue";
export default {
	components: { DialogIcon },
	props: {
		tableData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			selectIconShow: false,

			form: {
				isCreateMenu: 1, // 是否生成菜单 1是 2否
				menuName: "", // 菜单名称
				requestUrl: "", // 路由
				folder: "", // 模块文件夹
				fileName: "", // 文件名称

				fileFolderName: "", // 文件文件夹名称
				isCreateParentMenu: 2, // 是否生成父级菜单 1是 2否
				parentId: "", // 父级Id
				parentMenuName: "", // 父级菜单名称
				parentMenuIcon: "", // 父级菜单图标
			},
			rules: {
				parentId: { required: true, message: "请选择父级菜单", trigger: "blur" },
				parentMenuName: { required: true, message: "请输入父级菜单名称", trigger: "blur" },
				fileFolderName: { required: true, message: "请输入文件夹名称", trigger: "blur" },
				menuName: { required: true, message: "请输入表格的名称", trigger: "blur" },
				folder: { required: true, message: "请输入文件夹名字", trigger: "blur" },
				fileName: { required: true, message: "请输入文件名称", trigger: "blur" },
			},
			menuList: [],
		};
	},
	created() {
		let menuList = sessionStorage.getItem("menuList") || [];
		this.menuList = JSON.parse(menuList).filter((item) => item.parentId == -1);
	},
	methods: {
		// 选择父级 --
		parentSelect(e) {},
		// 输入
		componentInput(e, type) {
			this.form.requestUrl = "/" + this.form.folder + "/" + this.form.fileFolderName + "/" + this.form.fileName;
		},
		// 确认生成
		createFile() {
			this.$refs.form.validate(async (valid) => {
				if (!valid) return;
				this.tableData.fileForm = this.form;
				if(this.form.isCreateMenu==1)await this.createMenu(this.form)
				createTableFile(this.tableData)
					.then((res) => {
						this.$message.success("成功生成文件")
						setTimeout(() => {
							window.location.reload(); 
						}, 1500);
					})
					.catch((err) => {
						this.$message.error(err);
					});
			});
		},
		//生成子菜单
		createMenu(data) {
			return new Promise((resolve, reject) => {
				let component = "manage" + data.requestUrl;
				this.$request.post({
					url: "admin/adMenu/add",
					params: {
						parentId: data.parentId,
						menuName: data.menuName,
						requestUrl: data.requestUrl,
						component: component,
						type: 1,
						parentFlag: 1,
					},
					success: (res) => {
						resolve(res);
						this.getMenuAll()
						this.$message.success("成功生成菜单")
					},
					error: (err) => {
						reject(err);
					},
				});
			});
		},
		// 生成父菜单
		createParentMenu(data) {
			if(!data.parentMenuName)return this.$message.error("请输入根菜单名称")
			if(!data.parentMenuIcon)return this.$message.error("请选择菜单图标")
			return new Promise((resolve, reject) => {
				this.$request.post({
					url: "admin/adMenu/add",
					params: {
						parentId: -1,
						menuName: data.parentMenuName,
						menuIcon: data.parentMenuIcon,
						type: 1,
						parentFlag: 1,
					},
					success: (res) => {
						resolve(res);
						this.form.isCreateParentMenu = 2
						this.form.parentId = res.id
						this.getMenuAll()
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
					this.menuList = res.filter((item) => item.parentId == -1);
					this.$message.success("生成根菜单成功!")
					
				},
				error:()=>{},
				finally:()=>{}
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.card_box {
	margin-top: 12px;
}
</style>
