<template>
	<div>
		<!-- 时间选择器 -->
		<div class="time_box" v-if="typeObj.type == 'time'">
			<el-select v-model="typeObj.data">
				<el-option v-for="item in timeOptions" :key="item.value" :label="item.value" :value="item.value"> </el-option>
			</el-select>
		</div>
		<!-- 类型 / 状态 -->
		<div class="type_box" v-if="typeObj.type == 'type'">
			<el-popover placement="top" width="210" trigger="click">
				<div>
					<span style="margin-right: 15px;">设置条件</span>
					<i style="font-size: 15px;cursor: pointer;" class="el-icon-circle-plus-outline " @click="typehandEdit(1)"></i>
				</div>
				<div class="type_title_box">
					<div>label</div>
					<div>value</div>
				</div>
				<div v-for="(item, index) in typeObj.data" :key="index" class="obj_itme_input_box">
					<el-input class="inputs" v-model="item.value" size="mini" style="width:100px"></el-input>
					<span style="margin: 0 10px;">:</span>
					<el-input class="inputs" v-model="item.key" size="mini" style="width:60px"></el-input>
					<i style="font-size: 15px;margin-left: 6px;cursor: pointer;" v-if="index!=0" class="el-icon-remove-outline" @click="typehandEdit(2,index)"></i>
				</div>
				<el-button style="margin: 0 auto" size="mini" type="primary" slot="reference">设置条件</el-button>
			</el-popover>
		</div>
		<!-- 文本 -->
		<div class="text_box" v-if="typeObj.type == 'text'">text</div>
		<!-- 空模板 -->
		<div class="text_box" v-if="typeObj.type == 'template'">template</div>
		<!-- 输入框 -->
		<div class="text_box" v-if="typeObj.type == 'input'">input</div>
		<!-- 日期选择 -->
		<div class="text_box" v-if="typeObj.type == 'date'">date</div>
		<!-- 时间筛选 -->
		<div class="text_box" v-if="typeObj.type == 'daterange'">daterange</div>
		<!-- 时间日期筛选 -->
		<div class="text_box" v-if="typeObj.type == 'datetimerange'">datetimerange</div>
	</div>
</template>

<script>
export default {
	props: {
		typeObj: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			timeOptions: [{ value: "Y-MM-DD HH:mm:ss" }, { value: "Y-MM-DD HH:mm" }, { value: "Y-MM-DD" }],
		};
	},
	methods: {
		// 类型\状态 新增一条
		typehandEdit(type,index) {
            if(type==1)this.typeObj.data.push({ kee: "", value: "" });
            if(type==2)this.typeObj.data.splice(index,1)
			
		},
	},
};
</script>

<style lang="scss" scoped>
.type_box {
	display: flex;
	justify-content: center;
	.obj_itme_input_box {
	}
}
.obj_itme_input_box {
    margin-bottom: 8px;
}
.type_title_box {
	display: flex;
	width: 67%;
	padding-left: 10px;
	justify-content: space-between;
	margin-bottom: 10px;
}
.time_box {
	/deep/.el-input,
	/deep/.el-input__inner {
		background-color: #ffffff !important;
		border: none !important;
		font-size: 12px !important;
	}
}
.text_box{
	padding:  0 10px;
}
</style>
