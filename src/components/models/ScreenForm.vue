<template>
    <div class="screen_form">
        <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
            <div class="drawer" :style="isOpen?'':'maxHeight:174px;overflow:hidden;'">
                <el-form-item v-for="(item,index) in formList" :key="index">
                    <el-select v-if="item.type == 'select'" v-model="item.value" :placeholder="item.placeholder" clearable @change="search">
                        <el-option v-for="(selectItem,selectIndex) in item.data" :key="selectIndex" :value="selectItem.value" :label="selectItem.label"></el-option>
                    </el-select>
                    <el-input v-else-if="item.type == 'input'" v-model="item.value" :placeholder="item.placeholder" clearable></el-input>
                    <el-date-picker
                        v-else-if="item.type == 'daterange'"
                        v-model="item.value"
                        :editable="false"
                        @change="search()"
                        :type="item.dateType || 'daterange'"
                        range-separator="至"
                        :start-placeholder="item.startPlaceholder || '开始日期'"
                        :end-placeholder="item.endPlaceholder || '结束日期'"
                        clearable>
                    </el-date-picker>

                    <el-date-picker
                    v-else-if="item.type == 'date'"
                    v-model="item.value"
                    type="date"
                    :placeholder="item.placeholder">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
                <el-button @click="reset" type="primary" plain icon="el-icon-refresh-left">重置</el-button>
                <slot name="button"></slot>
            </el-form-item>
            <div v-if="showDrawer" class="arrow" @click="isOpen=!isOpen">
                <i :class="isOpen?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        formList: {
            type: Array,
            default: () => {
                return []
            }
        },
        // needTime: {
        //     type: Boolean,
        //     default: true
        // }
    },
    data() {
        return {
            load: false,
            date: [],
            isOpen: false
        }
    },
    created(){},
    mounted(){},
    watch: {},
    computed: {
        showDrawer() {
            let show = false;
            if(this.$store.state.isPhone&&this.formList.length > 3) {
                show = true;
            }
            return show;
        }
    },
    methods: {
        search(){
            let obj = {};
            if(this.formList.length > 0) {
                this.formList.forEach(item => {
                    if(item.type == 'input' || item.type == 'select') {
                        obj[item.key] = item.value;
                    } else if(item.type == 'daterange') {
                        if(item.value && item.value.length > 0) {
                            obj[item.key1] = this.$moment(item.value[0]).format('Y-MM-DD HH:mm:ss')
                            obj[item.key2] = this.$moment(item.value[1]).add(1, 'days').format('Y-MM-DD HH:mm:ss')
                        } else {
                            obj[item.key1] = ''
                            obj[item.key2] = ''
                        }
                    } else if(item.type == 'date') {
                        obj[item.key] = this.$moment(item.value).format('Y-MM-DD HH:mm:ss')
                    }

                })
            }
            // if(this.needTime) {
            //     obj.startTime = this.$moment(this.date[0]).format('Y-MM-DD HH:mm:ss')
            //     obj.endTime = this.$moment(this.date[1]).format('Y-MM-DD HH:mm:ss')
            // }
            this.$emit('search',obj);
        },
        reset() {
            this.formList.forEach(item => {
                if(item.type == 'daterange') {
                    item.value = [];
                } else {
                    item.value = '';
                }
            })
            this.search();
        }
    }
}
</script>

<style lang="scss" scoped>
.screen_form{
    .drawer {
        display: inline-block;
    }
    @media screen and (max-width: 768px) {
        .drawer {
            display: block;
        }
    }
    .arrow {
        background: #ecf5ff;
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 10px 0;
        margin-top: -10px;
        margin-bottom: 10px;
    }
    .arrow .el-icon-arrow-down {
        animation: floatBottom 1.2s infinite;
    }
    .arrow .el-icon-arrow-up {
        animation: floatTop 1.2s infinite;
    }
    @keyframes floatBottom {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(3px);
        }
        100% {
            transform: translateY(0);
        }
    }
    @keyframes floatTop {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(3px);
        }
        100% {
            transform: translateY(0);
        }
    }
}
</style>
