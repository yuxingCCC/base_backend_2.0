<template>
    <div id="authority_menu">
        <main-head></main-head>
        <main-content>
            <div :style="$store.state.isPhone?'':'width: 620px;'">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom: 20px;" size="medium" />
                <div class="tools">
                    <el-button size="mini" type="primary" @click="openMenuForm" v-if="isShowOperation" v-role="'/admin/adMenu/add'">添加</el-button>
                    <el-button size="mini" type="danger" @click="del" :loading="delLoad" :disabled="disabledDel" v-if="isShowOperation" v-role="'/admin/adMenu/delete'">删除
                    </el-button>
                    <el-tooltip class="item" effect="dark" content="拖动菜单可进行排序" placement="right">
                    <span class="theme font_size14 pointer" style="margin-left: 15px;">排序<i class="el-icon-question" style="margin-left: 2px;"></i></span>
                    </el-tooltip>
                    <div>
                        <div class="color" style="background-color: #606266;"></div>
                        <div>菜单栏</div>
                    </div>
                    <div>
                        <div class="color" style="background-color: #E6A23C;"></div>
                        <div>二级页面</div>
                    </div>
                    <div>
                        <div class="color" style="background-color: #409EFF;"></div>
                        <div>权限</div>
                    </div>
                </div>
                <el-tree :data="menuData" node-key="id" ref="menu" highlight-current :show-checkbox="isShowOperation"
                         :filter-node-method="filterNode" draggable :allow-drag="allowDrag" :allow-drop="allowDrop"
                         @node-drop="nodeDrop"
                         @check="handleCheckChange">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span v-if="data.type == 1">{{ node.label }}</span>
                        <span v-if="data.type == -1" class="warning">{{ node.label }}</span>
                        <span v-if="data.type == 2" class="theme">{{ node.label }}</span>
                        <span class="operation">
                            <el-button type="text" size="mini" @click="openMenuForm(data)" v-if="data.type != 2 && isShowOperation" v-role="'/admin/adMenu/add'">添加</el-button>
                            <el-button type="text" size="mini" @click="openUpdate(data)" style="color: #E6A23C;" v-role="'/admin/adMenu/update'">修改</el-button>
                        </span>
                    </div>
                </el-tree>
            </div>
        </main-content>

        <el-dialog title="添加菜单" :visible.sync="menuVisible" width="500px" center :close-on-click-modal="false">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="94px" class="demo-ruleForm" :disabled="addLoad">
                <el-form-item label="添加目标：">
                    {{ formData.parentId == -1 ? '根菜单' : formData.parentName }}
                </el-form-item>
                <el-form-item label="类型：" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="1" v-if="formData.parentFlag == 1">菜单栏</el-radio>
                        <el-radio label="-1" v-if="formData.parentFlag == 1 && formData.parentId != -1">普通页面</el-radio>
                        <el-radio label="2" v-if="formData.parentId != -1">权限</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="formData.type != 2 ? '菜单名称：': '权限名称：'" prop="menuName">
                    <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item :label="formData.type != 2 ? '菜单路由：':'权限路径：'" prop="requestUrl"
                              v-if="formData.parentId != -1">
                    <el-input v-model="formData.requestUrl"
                              :placeholder="formData.type != 2 ? '请输入菜单路由：':'请输入权限路径：'" />
                </el-form-item>
                <el-form-item label="组件路径：" prop="component" v-if="formData.type != 2 && formData.parentId != -1">
                    <el-input v-model="formData.component" placeholder="请输入页面组件路径" />
                </el-form-item>
                <el-form-item label="菜单图标：" prop="menuIcon" v-if="formData.type == 1 && formData.parentId == -1">
                    <el-input placeholder="请输入图标icon名称" v-model="formData.menuIcon"
                              class="input-with-select" />
                </el-form-item>
            </el-form>
            <span slot="footer">
				<el-button @click="menuVisible = false" :disabled="addLoad">取 消</el-button>
				<el-button type="primary" @click="add" :loading="addLoad">确 定</el-button>
			</span>
        </el-dialog>

        <!-- 修改菜单弹窗 -->
        <el-dialog title="修改" :visible.sync="updateVisible" width="500px" center :close-on-click-modal="false">
            <el-form :model="formData" :rules="rules" ref="updateFormData" label-width="94px" class="demo-ruleForm"
                     :disabled="addLoad">
                <el-form-item label="类型：" prop="type" v-if="isShowOperation">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="1">菜单栏</el-radio>
                        <el-radio label="-1" v-if="formData.parentId != -1 ">普通页面</el-radio>
                        <el-radio label="2" v-if="formData.parentId != -1">权限</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="formData.type != 2 ? '菜单名称：': '权限名称：'" prop="menuName">
                    <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item :label="formData.type != 2 ? '页面路由：':'权限路径：'" prop="requestUrl"
                              v-if="isShowOperation && formData.parentId != -1">
                    <el-input v-model="formData.requestUrl"
                              :placeholder="formData.type != 2 ? '请输入页面路由：':'请输入权限路径：'" />
                </el-form-item>
                <el-form-item label="组件路径：" prop="component"
                              v-if="isShowOperation && formData.type != 2 && formData.parentId != -1">
                    <el-input v-model="formData.component" placeholder="请输入页面组件路径" />
                </el-form-item>
                <el-form-item label="菜单图标：" prop="menuIcon"
                              v-if="formData.type == 1 && formData.parentId == -1 && isShowOperation">
                    <el-input placeholder="请输入图标icon名称" v-model="formData.menuIcon"
                              class="input-with-select" />
                </el-form-item>
            </el-form>
            <span slot="footer">
				<el-button @click="updateVisible = false" :disabled="updateLoad">取 消</el-button>
				<el-button type="primary" @click="update" :loading="updateLoad">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 菜单数据
            menuData: [],
            filterText: '',
            // 是否显示操作按钮
            isShowOperation: this.$envConfig.isShowMenuOpertionBtn,
            menuVisible: false,
            updateVisible: false,
            formData: {
                parentId: '',
                parentName: '',
                menuName: '',
                requestUrl: '',
                component: '',
                menuIcon: '',
                type: '1'
            },
            rules: {
                menuName: {
                    message: '请输入菜单名称',
                    required: true,
                    trigger: 'blur'
                },
                requestUrl: {
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        console.log(value, this.formData.type)
                        if(!value && this.formData.parentId !== -1 && this.formData.type == 1){
                            callback('请输入路由')
                        }
                        if (value === '' && this.formData.type == 2) {
                            callback('请输入权限路径')
                        } else {
                            callback()
                        }
                    }
                },
                menuIcon: {
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.select && value === '') {
                            callback('请输入菜单图标路径或名称')
                        } else {
                            callback()
                        }
                    }
                },
                type: {
                    required: true,
                    trigger: 'change',
                    message: '请选择类型'
                }
            },
            select: '',
            addLoad: false,
            delLoad: false,
            disabledDel: true,
            updateLoad: false,
            tempNode: null
        };
    },

    watch: {
        filterText(val) {
            this.$refs.menu.filter(val);
        },
    },

    mounted() {
        this.getTreeData();

    },

    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        // 复选框被点击时回调
        handleCheckChange(data, node) {
            if (node.checkedKeys.length < 1) {
                this.disabledDel = true
            } else {
                this.disabledDel = false
            }
        },

        // 判断节点是否可以拖拽
        allowDrag(node) {
            if (node.data.type === 2) {
                return false
            }
            return true
        },

        // 判断拖拽节点是否可以放在目标节点上
        allowDrop(draggingNode, dropNode, type) {
            if (draggingNode.data.parentId == dropNode.data.parentId && type != 'inner') {
                return true
            }
            return false
        },

        // 拖拽菜单完成回调
        nodeDrop(draggingNode, dropNode, dropType, ev) {
            this.$request.post({
                url: 'admin/adMenu/setSort',
                params: {
                    draggingId: draggingNode.data.id,
                    dropId: dropNode.data.id,
                    parentId: draggingNode.data.parentId,
                    dropType: dropType
                },
                success: result => {
                    this.$message.success('操作成功')
                }
            })
        },

        // 获取菜单
        getTreeData() {
            this.$request.post({
                url: "admin/adMenu/allList",
                success: res => {
                    this.menuData = res;
                    let menuMap = {};
                    // 获取根节点数据
                    let data = res.filter(value => value.parentId === -1);
                    let parents = [];
                    data.forEach(item => {
                        parents.push({
                            id: item.id,
                            label: item.menuName,
                            type: item.type,
                            parentId: item.parentId,
                            requestUrl: item.requestUrl,
                            menuIcon: item.menuIcon,
                            component: item.component
                        })
                    })

                    // 获取子节点数据
                    let childrens = res.filter(value => value.parentId !== -1);

                    // 生成树
                    this.menuData = this.$common.translator(parents, childrens, current => {
                        // 定义树结构
                        return {
                            id: current.id,
                            label: current.menuName,
                            type: current.type,
                            parentId: current.parentId,
                            requestUrl: current.requestUrl,
                            children: current.children,
                            component: current.component
                            // disabled: parent.id == 24 || parent.id == 25 || parent.id == 26,
                        }
                    })
                }
            });
        },

        // 打开菜单
        openMenuForm(data) {
            if (!data.parentId) {
                this.formData.parentId = -1;
                this.formData.parentName = '根菜单';
                this.formData.parentFlag = 1
            } else {
                this.formData.parentId = data.id;
                this.formData.parentName = data.label;
                this.formData.parentFlag = data.type;
                this.tempNode = data
            }
            this.formData.requestUrl = ''
            this.formData.menuName = ''
            this.formData.menuIcon = ''
            this.formData.type = '1'
            this.select = ''
            this.menuVisible = true
            var interval = setInterval(() => {
                if (this.$refs.formData) {
                    this.$refs.formData.resetFields()
                    clearInterval(interval)
                } else {
                }
            }, 100)
        },

        // 添加菜单
        add() {
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    if (this.addLoad) {
                        return
                    }
                    this.addLoad = true
                    this.$request.post({
                        url: 'admin/adMenu/add',
                        params: this.formData,
                        success: result => {
                            const newChild = {
                                id: result.id,
                                parentId: result.parentId,
                                label: result.type === 2 ? result.menuName + " (权限)" : result.menuName,
                                type: result.type,
                                requestUrl: result.requestUrl,
                                menuIcon: result.menuIcon,
                                component: result.component,
                                children: []
                            }
                            if (result.parentId === -1) {
                                this.menuData.push(newChild)
                            } else {
                                if (!this.tempNode.children) {
                                    this.tempNode.children = []
                                }
                                this.tempNode.children.push(newChild);
                            }
                            this.$message.success('添加成功')
                            this.menuVisible = false
                            this.getMenuAll()

                        },
                        finally: () => {
                            this.addLoad = false
                        }
                    })
                } else {
                    return false;
                }
            });
        },

        // 删除菜单
        del() {
            this.$prompt('菜单删除后不可恢复, 如确定请输入"确认删除" 继续操作', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({
                         value
                     }) => {
                if (value === '确认删除') {
                    var ids = this.$refs.menu.getCheckedKeys();
                    if (ids.length < 1) {
                        this.$message.error('至少选择一个菜单节点进行删除')
                        return;
                    }
                    if (this.delLoad) {
                        return;
                    }
                    this.delLoad = true
                    this.$request.post({
                        url: 'admin/adMenu/delete',
                        type: 'array',
                        params: {
                            ids
                        },
                        success: result => {
                            this.$message.success('删除成功')
                            this.menuData.splice(0)
                            this.getMenuAll()
                            this.getTreeData();
                        },
                        finally: () => {
                            this.delLoad = false
                        }
                    })
                }
            })
        },

        openUpdate(data) {
            console.log(data)
            this.tempNode = data
            this.updateVisible = true
            this.formData.id = data.id
            this.formData.menuName = data.type === 2 ? data.label.replace('(权限)', '').trim() : data.label.trim();
            this.formData.type = data.type.toString();
            this.formData.requestUrl = data.requestUrl;
            this.formData.parentId = data.parentId;
            this.formData.component = data.component;
            this.formData.menuIcon = data.menuIcon
        },

        // 修改操作
        update() {
            this.$refs['updateFormData'].validate((valid) => {
                if (valid) {
                    if (this.updateLoad) {
                        return
                    }
                    this.updateLoad = true;
                    this.$request.post({
                        url: 'admin/adMenu/update',
                        params: this.formData,
                        success: result => {
                            if (!this.tempNode.children) {
                                this.tempNode.children = []
                            }
                            this.tempNode.label = result.type === 2 ? result.menuName + ' (权限)' : result.menuName;
                            this.tempNode.requestUrl = result.requestUrl;
                            this.tempNode.menuIcon = result.menuIcon;
                            this.tempNode.type = result.type;

                            this.$message.success('修改成功');
                            this.updateVisible = false
                            this.getMenuAll()
                        },
                        finally: () => {
                            this.updateLoad = false
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        // 请求所有菜单
		getMenuAll(){
			this.$request.post({
				url: 'admin/adMenu/allList',
				success: (res) => {
					sessionStorage.setItem('menuList', JSON.stringify(res));
					this.$pubsub.publish('refreshMenuData')
				},
				error:()=>{},
				finally:()=>{}
			});
		}
    },
}
</script>

<style>
#authority_menu .custom-tree-node {
    display: flex;
    width: 530px;
    justify-content: space-between;
    align-items: center;
}

#authority_menu .el-select .el-input {
    width: 130px;
}

#authority_menu .input-with-select .el-input-group__prepend {
    background-color: #fff;
}

#authority_menu .el-dialog--center .el-dialog__body {
    padding-bottom: 0 !important;
}
</style>

<style scoped>
.operation {
    float: right;
}

.tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    line-height: 40px;
}

.tools > div {
    display: flex;
    align-items: center;
    margin-left: 20px;
    font-size: 14px;
}

.color {
    width: 10px;
    height: 10px;
    display: flex;
    margin-right: 5px;
}
</style>
