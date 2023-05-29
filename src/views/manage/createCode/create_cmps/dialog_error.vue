<template>
    <div>
        <el-dialog title="监测异常" :visible.sync="show" width="30%" @close="close">
            <span>预览文件已生成,请在 {{conutDown}} 秒点击确认无异常</span>
            <span slot="footer">
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getCreateTableCheck } from '../js/mergeJs';

export default {
    props: {
        id: {
            type: Number
        }
    },
    components: {},
    data() {
        return {
            show: false,
            timer:null,
            conutDown:3
        };
    },
    mounted () {
    },
    updated () {
    },
    methods: {
        
        name() {},
        // 关闭弹窗后
        close() {
            this.show = false;
        },
        // 监测异常
        monitor(){
          this.timer = setTimeout(() => {
            this.show = false;
            this.$message.warning("已取消生成预览文件");
          }, this.conutDown*1000);
        },
        // 确认弹窗
        confirm(){
            clearTimeout(this.timer)
            getCreateTableCheck().then(res=>{
              this.show = false;
              this.$message.success("预览文件已生成")
            })
        }
    }
};
</script>

<style>
</style>