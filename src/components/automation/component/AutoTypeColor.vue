<template>
	<div class="row_left_box">
		<div class="lebel_box">{{title}}</div>
		<div class="content">
			<el-radio-group v-model="active"  size="mini" @change="change">
				<el-radio-button v-for="(item, index) in list" :key="index" :label="item.value"></el-radio-button>
			</el-radio-group>
			<el-button :type="active" size="small" v-if="type==1">{{formData.headBtn}}</el-button>
			<el-button :type="active" size="small" plain v-if="type==2">{{formData.optionBtn}}</el-button>
			<el-button :type="active" size="small" plain v-if="type==3">{{btnName}}</el-button>
		</div>
	</div>
</template>

<script>
export default {
    model: {
		prop: "value",
		event: "input"
	},
    props: {
        formData: {
            type:Object,
            default:()=>{}
        },
        type:Number,
        value:String,
		title:String,
		btnName:String,
		
    },
	watch:{
		value(){
			this.active = this.value
		}
	},
    mounted() {
        this.active = this.value
    },
	data() {
		return {
			active: "primary",
			list: [
				{ value: "primary", color: "$--color-primary" },
				{ value: "success", color: "$--color-success" },
				{ value: "warning", color: "$--color-warning" },
				{ value: "danger", color: "$--color-danger" },
				{ value: "info", color: "$--color-info" },
			],
		};
	},
	methods: {  
		change(e) {
			this.$emit("input", e);
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
</style>
