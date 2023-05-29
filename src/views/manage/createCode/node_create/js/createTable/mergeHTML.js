module.exports = createfile = (vueObj) => {
    // console.log(vueObj);
    return `
<template>
	<div>
		<main-head>
            <!-- dashan top 按钮 -->
			${vueObj.btnList_T}
		</main-head>
		<main-content>
			<!-- 筛选 -->
			<screen-form v-if="formList.length" :formList="formList" @search="search" />
			<!-- 表格 -->
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
${vueObj.tableColumnList_T}
				<el-table-column label="操作" align="center" class-name="operation" min-width="100px" fixed="right">
					<template slot-scope="scope">
                        <!-- dashan table 按钮 -->
${vueObj.tableBtnList_T}
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				background
				:layout="$store.state.isPhone ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
				:page-size.sync="params.pageSize"
				:current-page.sync="params.pageNo"
				:total="total"
				@size-change="search"
				@current-change="getList"
				class="page"
			>
			</el-pagination>
		</main-content>
	</div>
</template>

<script>
export default {
	components: {},
    data() {
        return {
            list: [],
            load: false,
            params: ${vueObj.getListParmas_S},
            formList: [
${vueObj.screenDateFormList_S}
            ],
            total: 0,
${vueObj.dataList_S}
        };
    },
	watch: {},
	created() {},
    mounted() {
        this.search();
    },
    methods: {
        search(obj) {
            if (obj) this.params = Object.assign(this.params, obj);
            this.params.pageNo = 1;
            this.getList();
        },
        // 获取列表
        getList() {
            this.load = true;
            this.$request.post({
                url: "${vueObj.getListUrl_S}",
                params:this.params,
                success: (result) => {
                    this.list = result.list;
                    this.total = result.total;
                },
                finally: () => {
                    this.load = false;
                },
            });
        },
    },
};
</script>



<style lang="scss" scoped>

</style>
`

};

