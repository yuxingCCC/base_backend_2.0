<template>
    <div id="finance_profit">
        <main-head />
        <main-content>
            <screen-form :formList="formList" @search="search" />
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="id" label="id" align="center"/>
                <el-table-column label="收益金额" width="140" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.money | money | permil }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="origin" label="收益来源" align="center"/>
                <el-table-column prop="remark" label="备注" align="center"/>
                <el-table-column label="创建时间" align="center">
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
                    type: 'daterange',
                    value: [],
                    key1: 'startTime',
                    key2: 'endTime'
                }
            ],
            total: 0,
            load: false,
            date: [],
        };
    },

    created() {
        this.search()
    },

    methods: {
        // 获取列表
        getList() {
            if (this.load) {
                return;
            }
            this.load = true
            this.$request.post({
                url: 'admin/adProfit/list',
                params: this.params,
                success: result => {
                    this.list = result.list
                    if (this.params.isCount) {
                        this.total = result.total
                    }
                },
                finally: () => {
                    this.load = false
                }
            })
        },

        search(obj) {
            if(obj){this.params = Object.assign(this.params,obj)}
            this.params.isCount = true
            this.params.pageNo = 1
            this.getList()
        }
    }
}

</script>

<style>
</style>
