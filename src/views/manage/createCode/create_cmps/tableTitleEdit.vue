<template>
	<el-card shadow="never" class="card_box" :body-style="{ padding: '20px' }">
		<div class="table_title">
			<span>设置表格参数</span>
			<el-tooltip class="item" effect="dark" content="添加一个表格参数" placement="top-start">
				<i class="el-icon-circle-plus-outline" style="font-size:26px;cursor: pointer;margin-left: 10px;" @click="addTableItem"></i>
			</el-tooltip>
		</div>
		<div class="scroll_box">
			<div class="list_box" id="tableConfigOption">
				<template v-if="isRefresh">
					<div class="item_box" :index="index" :class="item.isShow ? '' : 'no_show'" v-for="(item, index) in tableData.tableModel" :key="index">
						<el-popover placement="top" width="160">
							<p>这是确定删除吗？删除后不可恢复!</p>
							<div style="text-align: right; margin: 0">
								<el-button type="primary" size="mini" @click="closeItem(item, index)">确定</el-button>
							</div>
							<div class="close_box" slot="reference">
								<i class="el-icon-close"></i>
							</div>
						</el-popover>
						<div class="item_centent_box">
							<el-tooltip class="item" effect="dark" :content="item.label" placement="top">
								<el-input v-model="item.label" placeholder="请输入label" size="normal"></el-input>
							</el-tooltip>
						</div>
						<div class="item_title_box">
							<table-content-input :tableData="tableData" :itemObj="item" />
							<div>
								<span v-if="item.isShow">生成：</span>
								<span v-if="!item.isShow" class="error">去除：</span>
								<el-switch size="mini" :width="20" v-model="item.isShow" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
							</div>
						</div>
						<div class="item_centent_type_box">
							<el-select v-model="item.typeObj.type" @change="typeSelect(item, index)">
								<el-option v-for="item in contentTypeOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</div>
						<div class="item_centent_data_box">
							<tableContentType :typeObj="item.typeObj" />
						</div>
					</div>
				</template>
			</div>
		</div>
	</el-card>
</template>

<script>
import Sortable from "../../../../utils/Sortable.min";
import TableContentInput from "./tableEdit_cmps/tableContentInput.vue";
import tableContentType from "./tableEdit_cmps/tableContentType.vue";
export default {
	components: {
		tableContentType,
		TableContentInput,
	},
	data() {
		return {
			sort: [],
			sortNum: 0, // 排序计数
			isRefresh: true,
			test: [],
			contentTypeOption: [
				{ label: "变量内容", value: "text", data: null },
				{ label: "时间组件", value: "time", data: "Y-MM-DD HH:mm" },
				{ label: "状态/类型", value: "type", data: [{ key: "1", value: "正常" }] },
				{ label: "空模板", value: "template", data: null },
			],
		};
	},
	props: {
		tableData: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		"tableData.tableModel"(newValue, oldValue) {
			if (this.sortNum == 0) this.sortNum = this.tableData.tableModel.length;
		},
	},

	created() {},
	mounted() {
		this.initSortable();
	},
	methods: {
		// 删除
		closeItem(item, index) {
			this.tableData.tableModel.splice(index, 1);
			this.tableData.tableModel.sort((a, b) => a.sort - b.sort);
			this.isRefresh = false;
			this.$nextTick(() => {
				this.isRefresh= true
			});
		},
		// 切换 类型
		typeSelect(item, index) {
			let data = this.contentTypeOption.find((item2) => item2.value == item.typeObj.type);
			item.typeObj.data = JSON.parse(JSON.stringify(data.data));
		},
		// 初始化 拖动
		initSortable() {
			const el = document.querySelector("#tableConfigOption");
			//创建拖拽对象
			this.sortable = Sortable.create(el, {
				animation: 150,
				// filter: ".ignore-elements",
				//拖拽完成，移除拖拽之前的位置上的元素，在拖拽之后的位置上添加拖拽元素
				onEnd: ({ newIndex, oldIndex, to }) => {
					let arr = [];
					for (let i = 0; i < to.childNodes.length; i++) {
						arr.push(to.childNodes[i].attributes.index.value);
					}
					this.tableData.tableModel.forEach((item, index) => {
						item.sort = arr.findIndex((item2) => item2 == index);
					});
				},
			});
		},
		// 添加 一个表格
		addTableItem() {
			this.tableData.tableModel.push({
				isShow: true,
				label: "",
				prop: "",
				sort: this.sortNum++,
				typeObj: { type: "text", data: null },
				data: null,
				type: "text",
			});
		},
	},
};
</script>
<style lang="scss">
.item_centent_box {
	background-color: #f5f7fa;

	.el-input {
		background-color: #f5f7fa !important;
		border: none !important;
	}
	.el-input__inner {
		background-color: #f5f7fa !important;
		border: none !important;
	}
}
.input_popper_class {
	width: 130px !important;
}
</style>
<style lang="scss" scoped>
.card_box {
	margin-top: 12px;
	overflow: auto;
}
.title_box {
	font-size: 14px;
	span {
		margin-right: 10px;
		color: #888;
		font-size: 13px;
	}
}
.table_title {
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 10px;
}
.scroll_box {
	height: 80%;
	margin: 0 auto;
	border-radius: 4px;

	.list_box {
		display: flex;
		flex-wrap: wrap;
		font-size: 14px;

		span {
			color: #888;
			font-size: 13px;
		}

		.item_box {
			max-width: 145px;
			border: 1px solid #00000015;
			border-left: 0px solid #00000015;
			position: relative;
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
			.item_title_box {
				box-sizing: border-box;
				padding: 6px 10px;
			}

			.item_centent_box,
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
			}
		}
		.item_box:nth-child(1) {
			border: none;
			border: 1px solid #00000015;
		}

		.item_box:nth-last-child(1) {
			border: none;
			border-right: 1px solid #00000015;
			border-top: 1px solid #00000015;
			border-bottom: 1px solid #00000015;
		}
		.no_show {
			opacity: 0.6;
			filter: contrast(1.02);
		}
		.add_item_box {
			min-height: 163px;
			width: 150px;
			max-width: 147px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #00000066;
			border: 1px solid #00000015;
			box-sizing: border-box;
		}
	}
}
</style>
