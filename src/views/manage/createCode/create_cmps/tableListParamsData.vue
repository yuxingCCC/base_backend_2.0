<template>
	<el-card shadow="never" style="margin-top: 12px;" :body-style="{ padding: '20px' }">
		<div class="table_title">
			<span>设置搜索栏参数</span>
			<el-tooltip class="item" effect="dark" content="添加一个搜索参数" placement="top-start">
				<i class="el-icon-circle-plus-outline" style="font-size:26px;cursor: pointer;margin-left: 10px;" @click="addScreenItem"></i>
			</el-tooltip>
			<el-button type="primary" style="float: right;" size="mini" @click="isShow = !isShow">折叠</el-button>
		</div>
		<!-- <div class="title_base_box">
			<div class="title_item">描述</div>
			<div class="title_item">参数</div>
			<div class="title_item">生成筛选</div>
		</div> -->
		<el-form v-if="isShow" :model="tableData.parameters" label-position="top" id="form_seed" ref="form" :rules="rules" label-width="140px" :inline="false" size="small">
			<template v-if="isRefresh">
				<el-form-item :index="index" v-for="(item, index) in tableData.formData.data.parameters" :key="index" :prop="item.name">
					<div class="form_item_box">
						<el-popover placement="top" width="160">
							<p>这是确定删除吗？删除后不可恢复!</p>
							<div style="text-align: right; margin: 0">
								<el-button type="primary" size="mini" @click="closeItem(item, index)">确定</el-button>
							</div>
							<div class="close_box" slot="reference">
								<i class="el-icon-close"></i>
							</div>
						</el-popover>
						<el-tooltip class="item" effect="dark" :content="item.description" placement="top">
							<div class="form_label_box">
								<!-- {{ item.description + "：" }} -->
								<el-input class="item_input" v-model="item.description" size="small" placeholder="请输入提示"> </el-input>
							</div>
						</el-tooltip>
						<div class="key_box" style="padding:0 10px;line-height:22px">
							<span style="color:#999">字段：</span>
							<el-input class="key_input" v-model="item.name" size="mini" placeholder="请输入字段"></el-input>
						</div>
						<div style="padding:0 10px;line-height:20px;margin-bottom: 6px;">
							<!-- v-if="isShowcheckboxScreen(item.name)" -->
							<!-- @change="checkboxChange(index, item.name, $event)" -->
							<span style="color:#999">生成：</span>
							<el-switch v-model="item.isShow" :width="20" active-color="#13ce66" inactive-color="#ff494988"> </el-switch>
						</div>
						<div class="item_centent_type_box">
							<el-select v-model="item.typeObj.type" @change="typeSelect(item, index)">
								<el-option v-for="item in typeObjList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</div>
						<div class="item_centent_data_box">
							<tableContentType :typeObj="item.typeObj" />
						</div>
					</div>
				</el-form-item>
			</template>
		</el-form>
	</el-card>
</template>

<script>
import { getTableList } from "../js/mergeJs";
import Sortable from "../../../../utils/Sortable.min";
import babelData from "../js/babelData.js";
import tableContentType from "./tableEdit_cmps/tableContentType";
export default {
	components: {
		tableContentType,
	},
	props: {
		tableData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			isRefresh: true,
			isShow: true, // 是否折叠
			sortNum: 0, // 排序计数
			rules: {}, // 验证
			url: "", //  列表接口地址

			typeObjList: [
				{ label: "时间日期范围", value: "datetimerange", data: "" },
				{ label: "日期范围", value: "daterange", data: "" },
				{ label: "日期选择", value: "date", data: "" },
				{ label: "搜索框", value: "input", data: "" },
				{ label: "下拉框", value: "type", data: [{ key: "1", value: "正常" }] },
			],
		};
	},
	created() {
		this.init();
	},
	computed: {},
	watch: {
		"tableData.formData.data.parameters": {
			handler: function(newVlaue) {
				this.refreshData();
			},
			deep: true,
		},
	},
	methods: {
		// 删除
		closeItem(item, index) {
			this.tableData.formData.data.parameters.splice(index, 1);
			this.tableData.formData.data.parameters.sort((a, b) => a.sort - b.sort);
			this.isRefresh = false;
			this.$nextTick(() => {
				this.isRefresh= true
			});
		},
		// 切换 类型
		typeSelect(item, index) {
			let data = this.typeObjList.find((item2) => item2.value == item.typeObj.type);
			item.typeObj.data = JSON.parse(JSON.stringify(data.data));
		},
		// 更新数据
		refreshData() {
			this.tableData.formScreenList = this.tableData.formData.data.parameters.map((item) => {
				return {
					key: item.name,
					placeholder: item.description,
					isShow: item.isShow,
					typeObj: JSON.parse(JSON.stringify(item.typeObj)),
					sort: item.sort,
				};
			});
		},
		// 过滤掉不需要生成筛选的参数
		isShowcheckboxScreen(e) {
			const arr = ["pageNo", "pageSize", "isCount"];
			return arr.indexOf(e) === -1 ? true : false;
		},

		// 初始化
		async init() {
			// 获取url 传递的参数
			this.tableData.url = this.$route.query.url || "";
			// 获取缓存的数据
			let paths = JSON.parse(window.sessionStorage.getItem("APIpathsList"));
			// 查找对应的url
			this.tableData.formData = JSON.parse(JSON.stringify(paths.find((item) => item.urlName == this.tableData.url)));
			this.sortNum = this.tableData.formData.data.parameters.length;
			this.tableData.formData.data.parameters.forEach((item, index) => {
				// 初始化默认输入的参数
				this.$set(this.tableData.formData.data.parameters[index], "value", "");
				this.$set(this.tableData.formData.data.parameters[index], "sort", index);
				this.$set(this.tableData.formData.data.parameters[index], "typeObj", { type: "input", data: "" });
				if (babelData.ScreenListTypeObj[item.name]) item.typeObj = JSON.parse(JSON.stringify(babelData.ScreenListTypeObj[item.name]));
				if (item["x-example"]) item.value = item["x-example"];
				this.$set(this.tableData.parameters, item.name, item.value);
				//设置rules 规则 根据 required 类型设置规则
				if (item.required) {
					this.$set(this.rules, item.name, [{ required: true, message: "请输入" + item.description, trigger: "blur" }]);
				}
				this.$set(this.tableData.formData.data.parameters[index], "isShow", false);
			});
			this.tableData.formData.data.parameters = this.tableData.formData.data.parameters.filter((item) => item.name != "endTime" && item.name != "isCount");

			// 初始化表格label
			this.tableData.tableModel = await getTableList(this.tableData);
			this.tableData.formData.data.oldTableModel = this.tableData.tableModel.map((item) => ({ value: item.prop })) || [];
			// console.log(JSON.parse(JSON.stringify(this.tableData.formData.data.parameters)));

			// 初始化 拖动集合
			this.initSortable();
		},
		// 初始化 拖动
		initSortable() {
			const el = document.querySelector("#form_seed");
			//创建拖拽对象
			this.sortable = Sortable.create(el, {
				animation: 150,
				//拖拽完成，移除拖拽之前的位置上的元素，在拖拽之后的位置上添加拖拽元素
				onEnd: ({ newIndex, oldIndex, to }) => {
					let arr = [];
					for (let i = 0; i < to.childNodes.length; i++) {
						arr.push(to.childNodes[i].attributes.index.value);
					}
					this.tableData.formData.data.parameters.forEach((item, index) => {
						item.sort = arr.findIndex((item2) => item2 == index);
					});
				},
			});
		},
		// 添加一个搜索对象
		addScreenItem() {
			this.tableData.formData.data.parameters.push({
				description: "",
				format: "",
				in: "",
				name: "",
				required: false,
				isShow: true,
				sort: this.sortNum++,
				type: "",
				typeObj: {
					data: "",
					type: "input",
				},
				value: "",
			});
		},
	},
};
</script>

<style lang="scss" scoped>
#form_seed {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	.form_item_box {
		width: 145px;
		border: 1px solid #00000015;
		border-left: 1px solid #00000015;
		border-right: 1px solid #00000015;
		box-sizing: border-box;
		.close_box {
			position: absolute;
			right: 0;
			top: 0;
			height: 16px;
			width: 16px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #888;
			background-color: #f5ffff;
			z-index: 10;
			border-left: 1px solid #00000015;
			border-bottom: 1px solid #00000015;
			cursor: pointer;
		}
	}

	/deep/.el-form-item--small.el-form-item {
		margin-bottom: 0 !important;
	}
	/deep/.el-input {
		background-color: #f5f7fa !important;
		border: none !important;
	}
	/deep/.el-input__inner {
		background-color: #f5f7fa !important;
		border: none !important;
	}
	.key_box {
		display: flex;
		align-items: center;
		.key_input {
			width: 60%;
			font-size: 14px;
			/deep/.el-input {
				background-color: #ffffff !important;
				border: none !important;
				padding: 0 !important;
			}
			/deep/.el-input__inner {
				background-color: #ffffff !important;
				border: none !important;
				padding: 0 !important;
			}
		}
	}
}

.form_label_box {
	top: 0;
	right: 30px;
	// position: absolute;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.title_base_box {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	padding-bottom: 10px;
	border-bottom: 1px solid #00000015;
	.title_item {
		width: 20%;
		text-align: center;
		font-size: 14px;
		color: #666;
	}
}
.form_item_content_box {
	display: flex;
	align-items: center;
	.item_input {
		width: 100%;
	}
	.el-switch {
		margin-left: 10px;
	}
}
.table_title {
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 10px;
}
.form_value {
	background-color: #f5f7fa;
	display: flex;
	line-height: 32px;
	justify-content: center;
	align-items: center;
	height: 32px;
}

.item_centent_type_box {
	background-color: #f5f7fa;

	/deep/.el-input {
		background-color: #f5f7fa !important;
		border: none !important;
	}
	/deep/.el-input__inner {
		background-color: #f5f7fa !important;
		border: none !important;
	}
}
.item_centent_type_box {
	background-color: #fdf6ef !important;
	/deep/.el-input__inner,
	/deep/.el-input {
		background-color: #fdf6ef !important;
	}
}
.item_centent_data_box {
	box-sizing: border-box;
	line-height: 40px;
	height: 40px;
}
</style>
<style>
.el-form-item__label {
	position: relative;
}
</style>
