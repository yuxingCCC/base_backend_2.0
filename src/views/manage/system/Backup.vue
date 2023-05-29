<template>
    <div id="system_data">
        <main-head >
            <el-button slot="after" plain type="primary" size="medium" @click="backUp" :loading="backUpLoading" v-role="'/system/sysDbBackup/admin/backUp'">备份数据</el-button>
        </main-head>

        <main-content>
            <screen-form :formList="formList" @search="search" />
            <el-table :data="list" v-loading="loading">
                <el-table-column label="编号" prop="id" align="center"></el-table-column>
                <el-table-column label="备注" prop="remark" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.status === 1">备份成功</el-tag>
                        <el-tag type="danger" v-if="scope.row.status === -1">备份失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="备份时间" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm:ss" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="restore(scope.row.id)" v-if="scope.row.status === 1" v-role="'/system/sysDbBackup/admin/retore'">
                            回滚数据
                        </el-button>
                        <el-button type="danger" plain size="small" @click="del(scope.row.id)" v-role="'/system/sysDbBackup/admin/delete'">删除</el-button>
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
            params: {
                pageNo: 1,
                pageSize: 10,
                isCount: true,
            },
            formList: [
                {
                    type: 'daterange',
                    value: [],
                    key1: 'startTime',
                    key2: 'endTime'
                }
            ],
            loading: false,
            backUpLoading: false,
            total: 0,
            list: [],
            date: []
        };
    },

    watch: {},

    mounted() {
        this.search()
    },

    methods: {
        search(obj){
            console.log(obj)
            if(obj) {this.params = Object.assign(this.params,obj)}
            this.params.pageNo = 1
            this.params.isCount = true
            this.getList()
        },

        getList() {
            this.loading = true
            this.$request.post({
                url: 'system/sysDbBackup/admin/list',
                params: this.params,
                success: result => {
                    this.list = result.list
                    if (this.params.isCount) {
                        this.params.isCount = false
                        this.total = result.total
                    }
                },
                finally: () => {
                    this.loading = false
                }
            })
        },

        backUp() {
            if (this.backUpLoading) {
                return;
            }
            this.backUpLoading = true
            this.$request.post({
                url: 'system/sysDbBackup/admin/backUp',
                success: result => {
                    this.$message.success('数据备份成功')
                    this.search()
                },
                finally: () => {
                    this.backUpLoading = false
                }
            })
        },

        del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.post({
                    url: 'system/sysDbBackup/admin/delete',
                    params: {
                        id
                    },
                    success: result => {
                        this.$message.success('删除成功')
                        if (this.list.size < 2 && this.params.pageNo > 1) {
                            this.params.pageNo = this.params.pageNo - 1
                        }
                        this.params.isCount = true
                        this.getList()
                    }
                })
            })
        },

        restore(id) {
            this.$confirm('是否回滚到当前阶段数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var uid = (new Date()).getTime().toString();
                PubSub.publish('showNotify', {title: '提示', message: '数据回滚中, 请稍后...', uid})
                this.$request.post({
                    url: 'system/sysDbBackup/admin/restore',
                    params: {
                        id,
                        uid
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

</style>
