<template>
	<div class="row_left_box">
		<div class="lebel_box">{{ title }}</div>
		<div class="content">
			<el-cascader v-model="arr" placeholder="请选择接口" filterable style="width: 350px;" :options="apiOptions" @change="handleChange" popper-class="formPopperClass">
				<div slot-scope="{ node, data }">
					<span v-if="node.children.length">{{ data.label }}</span>
					<span v-if="node.children.length"> ({{ data.children.length }}) </span>
					<div v-if="!node.children.length" class="select_box">
						<div class="label">{{ data.label }}</div>
						<div class="value">{{ data.value }}</div>
					</div>
				</div>
			</el-cascader>
		</div>
	</div>
</template>

<script>
export default {
	model: {
		prop: "value",
		event: "input"
	},
	watch:{
		value(){
			this.arr = this.value
		}
	},
	props: {
		value:Array,
		apiOptions: {
			type: Array,
			default: () => [],
		},
		type: Number,
		title: String,
	},

	data() {
		return {
			arr: [],
		};
	},
	methods: {
		handleChange(e) {
			this.$emit("input", e);
			this.$emit("change", e);
		},
		
	},
};
</script>

<style lang="scss" scoped>
.row_left_box {
	position: relative;
	left: -120px;
	width: 160%;
	display: flex;
	.lebel_box {
		width: 108px;
		text-align: right;
		padding-right: 12px;
	}
	.content {
		flex: 1;
	}
}

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
.formPopperClass .el-cascader__suggestion-list{
	max-height: 400px !important;

}
</style>
