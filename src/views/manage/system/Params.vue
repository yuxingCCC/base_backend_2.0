<template>
    <div id="sys_params">
        <main-head></main-head>

        <main-content>
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="id" label="id" align="center"/>
                <el-table-column prop="name" label="参数名" align="center"/>
                <el-table-column prop="value" label="参数值" align="center"/>
                <el-table-column prop="remark" label="备注" align="center"/>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="100px">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="update(scope.row.id)" v-role="'/system/sysParams/admin/update'">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page"
                background
                :small="$store.state.isPhone"
                :layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                :current-page.sync="params.pageNo"
                :page-size.sync="params.pageSize"
                :total="total"
                @size-change="search"
                @current-change="getList"
            >
            </el-pagination>
        </main-content>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            load: false,
            params: {
                pageSize: 10,
                pageNo: 1,
                isCount: true
            },
            total: 0,
        };
    },

    mounted() {
        this.search()
    },

    methods: {
        search(){
            this.params.pageNo = 1
            this.params.isCount = true
            this.getList()
        },

        getList() {
            this.load = true
            this.$request.post({
                url: 'system/sysParams/admin/list',
                params: this.params,
                success: result => {
                    if (this.params.isCount) {
                        this.total = result.total
                    }
                    this.params.isCount = false
                    this.list = result.list
                },
                finally: () => {
                    this.load = false
                }
            })
        },

        update(id) {
            this.$prompt('请输入参数值', '修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S/,
                inputErrorMessage: '请输入参数值'
            }).then(({value}) => {
                this.load = true
                this.$request.post({
                    url: 'system/sysParams/admin/update',
                    params: {
                        id,
                        value
                    },
                    success: result => {
                        this.$message.success('更新成功')
                        this.getList()
                    },
                    finally: () => {
                        this.load = false
                    }
                })
            })
        }
    }

}
</script>

<style>

</style>

<style scoped>
.page {
    text-align: right;
    margin-top: 20px;
}
</style>
