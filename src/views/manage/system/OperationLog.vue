<template>
    <div id="system_operation_log">
        <main-head />
        <main-content>
            <screen-form :formList="formList" @search="search" />
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="adId" label="账号id" align="center" min-width="80"/>
                <el-table-column label="账号" prop="account" align="center" min-width="100"/>
                <el-table-column prop="phone" label="手机号码" align="center" min-width="80"/>
                <el-table-column prop="roleName" label="角色" align="center" min-width="100"/>
                <el-table-column prop="apiName" label="操作功能" align="center" min-width="150"/>
                <el-table-column prop="apiValue" label="操作数据" align="center" min-width="200"/>
                <el-table-column label="操作时间" align="center" min-width="100">
                    <template slot-scope="scope">
                        <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm" />
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="page"
                    background
                    :small="$store.state.isPhone"
                    :layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                    :page-size.sync="params.pageSize"
                    :current-page.sync="params.pageNo"
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
                params: {
                    startTime: '',
                    endTime: '',
                    pageSize: 10,
                    pageNo: 1
                },
                formList: [
                    {
                        type: 'input',
                        key: 'adId',
                        placeholder: '账号id'
                    },
                    {
                        type: 'input',
                        key: 'account',
                        placeholder: '账号'
                    },
                    {
                        type: 'input',
                        key: 'phone',
                        placeholder: '手机号码'
                    },
                    {
                        type: 'select',
                        key: 'roleId',
                        placeholder: '选择角色',
                        data: [],
                        value: ''
                    },
                    {
                        type: 'daterange',
                        dateType: 'datetimerange',
                        value: [],
                        key1: 'startTime',
                        key2: 'endTime',
                        startPlaceholder: '开始时间',
                        endPlaceholder: '结束时间',
                    }
                ],
                total: 0,
                load: false,
                date: [],
            };
        },

        created() {
            this.search();
            this.getRoleList();
        },

        methods: {
            // 获取列表
            getList() {
                if (this.load) {
                    return;
                }
                this.load = true;
                this.$request.post({
                    url: 'system/operationLog/getList',
                    params: this.params,
                    success: result => {
                        this.list = result.list;
                        if (this.params.isCount) {
                            this.total = result.total
                        }
                    },
                    finally: () => {
                        this.load = false
                    }
                })
            },

            // 获取角色列表
            getRoleList() {
                this.$request.post({
                    url: 'admin/adRole/list',
                    params: {
                        pageNo: 1,
                        pageSize: 10000
                    },
                    success: result => {
                        let list = [];
                        result.list.forEach(item =>{
                            list.push({
                                value: item.id,
                                label: item.roleName
                            })
                        });
                        this.formList[this.formList.findIndex(item => item.key === 'roleId')].data = list;
                    }
                })
            },

            search(obj) {
                if(obj){this.params = Object.assign(this.params,obj)}
                this.params.isCount = true;
                this.params.pageNo = 1;
                this.getList()
            }
        }
    }

</script>

<style>
</style>
