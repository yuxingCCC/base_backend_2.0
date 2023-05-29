<!-- 用户反馈 -->
<template>
    <div id="user_advice">
        <main-head>
            <el-button slot="after" size="medium" type="primary" plain @click="allRead()" v-role="'/system/sysAdvice/admin/setAllRead'">一键已读</el-button>
        </main-head>

        <main-content>
            <screen-form :formList="formList" @search="search" />
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="id" label="id" width="90" align="center"></el-table-column>
                <el-table-column prop="usId" label="用户id" width="120" align="center"></el-table-column>
                <el-table-column prop="content" label="反馈内容" align="center"></el-table-column>
                <el-table-column label="反馈图片" width="250" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.imgs">
                            <img :src="$common.getUrl()+item" alt="" v-for="(item, index) in scope.row.imgs.split(',')">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="reply" label="回复内容" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.reply || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isRead" label="已读?" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isRead == 0 && scope.row.status == 0" class="error">未读</span>
                        <span v-else class="gray">已读</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="error">未回复</span>
                        <span v-if="scope.row.status == 1" class="success">已回复</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="150" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right" min-width="100px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="reply(scope.row.id)" v-if="scope.row.status === 0" v-role="'/system/sysAdvice/admin/reply'">
                            回复
                        </el-button>
                        <span v-else>--</span>
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
            formList: [
                {
                    type: 'input',
                    placeholder: '用户id',
                    key: 'usId',
                    value: ''
                },
                {
                    type: 'daterange',
                    value: [],
                    key1: 'startTime',
                    key2: 'endTime'
                }
            ],
            formOpen: false,
            list: [],
            params: {
                pageNo: 1,
                pageSize: 10,
                usId: '',
                startTime: '',
                endTime: '',
            },
            total: 0,
            load: false,
            date: [],
            dialogVisible: false
        };
    },

    mounted() {
        this.search()
    },

    computed: {
        formStyle() {
            var style = this.$store.state.isPhone?'display:block;':'display:inline;'
            style += this.$store.state.isPhone && !this.formOpen?'max-height:116px;overflow:hidden;':''
            return style;
        },
    },

    methods: {
        search(obj){
            if(obj) {this.params = Object.assign(this.params,obj)}
            this.params.pageNo = 1
            this.getList()
        },

        // 获取列表
        getList() {
            this.load = true
            this.params.type = 1
            this.$request.post({
                url: 'system/sysAdvice/admin/list',
                params: this.params,
                success: result => {
                    this.list = result.list
                    this.total = result.total
                },
                finally: () => {
                    this.load = false
                }
            })
        },

        // 一键已读
        allRead() {
            if (this.load) {
                return;
            }
            this.load = true;
            this.$request.post({
                url: 'system/sysAdvice/admin/setAllRead',
                success: result => {
                    this.$message.success('操作成功');
                    this.load = false;
                    this.getList();
                },
                finally: () => {
                    this.load = false
                }
            })
        },

        // 回复
        reply(id) {
            let index = this.list.findIndex(item => {
                return item.id = id
            });
            this.$prompt('输入回复信息', '回复', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S/,
                inputErrorMessage: '请输入回复内容'
            }).then(({value}) => {
                this.load = true;
                this.$request.post({
                    url: 'system/sysAdvice/admin/reply',
                    params: {
                        id,
                        content: value
                    },
                    success: result => {
                        this.$message.success('回复成功')
                        this.list[index].status = 1
                        this.list[index].reply = value
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

</style>
