<template>
	<div>
		<main-content>
			<el-row :gutter="20">
				<el-col :span="24" :offset="0">
					<el-row :gutter="20">
						<!-- 预览组件 -->
						<tableTextView />
					</el-row>
					<el-row :gutter="20">
						<!-- 搜索栏配置 -->
						<table-list-params-data :tableData="tableData"></table-list-params-data>
					</el-row>
					<el-row :gutter="20">
						<!-- 表格属性配置 -->
						<tableTitleEdit :tableData="tableData" />
					</el-row>
					<el-row :gutter="20">
						<!-- 菜单文件生成表单 -->
						<tableCreateForm :tableData="tableData" />
					</el-row>
				</el-col>
			</el-row>
			<!-- <div style="margin-bottom: 10px;">
				<el-button type="primary" size="small" @click="onCreate">预览</el-button>
			</div> -->
		</main-content>

		<dialog-error ref="dialogError" />
	</div>
</template>

<script>
import { createTablePreview } from "./js/createTable.js";

import tableTextView from "./create_cmps/tableTextView.vue"; // 预览
import dialogError from "./create_cmps/dialog_error.vue"; // 监测文件生成异常
import tableListParamsData from "./create_cmps/tableListParamsData.vue"; // 表格参数即筛选器配置
import tableTitleEdit from "./create_cmps/tableTitleEdit.vue"; // 编辑表格标题
import tableCreateForm from "./create_cmps/tableCreateForm.vue"; // 表单
export default {
	components: {
		tableListParamsData,
		tableTitleEdit,
		dialogError,
		tableTextView,
		tableCreateForm,
	},
	data() {
		return {
			tableData: {
				url: "", // 表格接口地址
				parameters: {}, // 输入的请求参数
				formData: {}, // 接口数据对象
				formScreenList: [], // 筛选的数据对象
				tableModel: [], // 表格数据
				fileForm: {}, // 生成文件表单的对象
			},

			watchCreate: this.debounce(this.onCreate, 200), // 防抖
		};
	},
	watch: {
		tableData: {
			handler: function(newValue, oldValue) {
				this.watchCreate(1);
			},
			deep: true,
		},
	},
	created() {},
	methods: {
		//节流
		debounce(func, delay) {
			let timer = null;
			return function(...args) {
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => {
					func.apply(this, args);
				}, delay);
			};
		},
		onCreate(type) {
			createTablePreview({ type, ...this.tableData })
				.then((res) => {
					if (!type) this.$refs.dialogError.show = true;
					if (!type) this.$refs.dialogError.monitor();
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
