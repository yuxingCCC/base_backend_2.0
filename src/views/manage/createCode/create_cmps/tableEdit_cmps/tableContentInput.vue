<template>
	<div class="key_box">
		<span>字段：</span>
		<el-tooltip class="item" effect="dark" :content="itemObj.prop" placement="top">
			<el-autocomplete
				class="key_input"
				v-model="itemObj.prop"
				size="mini"
				placement="bottom-end"
				popper-class="input_popper_class"
				:fetch-suggestions="querySearch"
				placeholder="请输入字段"
				@select="handleInputSelect"
			></el-autocomplete>
		</el-tooltip>
		<!-- <el-input class="key_input" v-model="item.prop" size="mini" placeholder="请输入字段"></el-input> -->
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		tableData: {
			type: Object,
			default: () => ({}),
		},
		itemObj: Object,
	},
	methods: {
		querySearch(queryString, cb) {
			var restaurants = this.tableData.formData.data.oldTableModel;
			var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (restaurant) => {
				return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
			};
		},
		// 输入字段框选择后
		handleInputSelect(e) {
			console.log(e);
		},
	},
};
</script>

<style lang="scss" scoped>
.key_box {
	display: flex;
	align-items: center;

	.key_input {
		width: 65%;
		/deep/.el-input {
			background-color: #ffffff !important;
			border: none !important;
			padding: 0 !important;
		}
		/deep/.el-input__inner {
			font-size: 14px !important;
			background-color: #ffffff !important;
			border: none !important;
			padding: 0 !important;
		}
	}
}
</style>
