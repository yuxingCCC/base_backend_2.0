<template>
    <el-dialog title="选择图标" :visible.sync="showVisible" width="1210px" @close="close">
       <div class="icon_base_box">
         <div v-for="(item, index) in iconList" :key="index" class="icon_box" @click="handClick(item)">
            <i :class="item" style="font-size: 53px;"></i>
        </div>
       </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        show: false,
        parentMenuIcon:'',
    },
    data() {
        return {
            iconList:require('./iconList')
        };
    },
    
    methods: {
        handClick(item){
            this.$emit('update:parentMenuIcon',item)
            this.close()
        },
        close(){
            this.$emit('show_event', false)
        }
    },
    computed: {
        showVisible: {
            get: function () {
                return this.show;
            },
            set: function (val) {
                return false;
            }
        }
    },
    watch: {
        show(newValue, oldValue) {
            if (this.show) {
                // 每次打开 执行
            }
        }
    },
    model: {
        prop: 'show',
        event: 'show_event'
    }
};
</script>

<style>
</style>
<style lang="scss" scoped>
.icon_base_box{
    display: flex;
    flex-wrap: wrap;
}
.icon_box{
    margin: 6px;
    cursor: pointer;
}

</style>