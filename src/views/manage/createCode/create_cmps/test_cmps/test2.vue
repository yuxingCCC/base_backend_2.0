
<template>
	<div>
		<main-head>
            <!-- dashan top 按钮 -->
			
		</main-head>
		<main-content>
			<!-- 筛选 -->
			<screen-form v-if="formList.length" :formList="formList" @search="search" />
			<!-- 表格 -->
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column label="登录时间" prop="loginTime" align="center" >
					<template slot-scope="scope">
						<timer :date="scope.row.loginTime" format="Y-MM-DD HH:mm" />
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" align="center" >
					<template slot-scope="scope">
						<timer :date="scope.row.createTime" format="Y-MM-DD HH:mm" />
					</template>
				</el-table-column>
				<el-table-column label="" prop="roleId" align="center" />
				<el-table-column label="备注" prop="remark" align="center" />
				<el-table-column label="角色名称" prop="roleName" align="center" />
				<el-table-column label="ID" prop="id" align="center" />
				<el-table-column label="账号" prop="account" align="center" />
				<el-table-column label="状态" prop="status" align="center" />
				<el-table-column label="操作" align="center" class-name="operation" min-width="100px" fixed="right">
					<template slot-scope="scope">
                        <!-- dashan table 按钮 -->

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
            params: {"endTime":"","id":"","isCount":true,"keyWord":"","pageNo":1,"pageSize":10,"sortKey":"","startTime":"","status":""},
            formList: [

            ],
            total: 0,
			
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
                url: "/admin/adInfo/list",
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
