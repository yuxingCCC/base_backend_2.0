<!--
	时间：2018-11-16
	描述：图片放大
-->
<template>
	<div class="image_viewer">
    <el-image-viewer v-if="isShow" :url-list="urlList" :on-close="onClose"/>
	</div>
</template>

<script>
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

	export default {
		props: {
      // 是否展示
      show: {
        type: Boolean,
        required: true
      },

      // 图片url集合
      urlList: {
        type: Array,
        required: true
      }
    },

    components:{
      ElImageViewer
    },

    data(){
      return {
        isShow: false
      }
    },

    watch:{
      show(value){
        this.isShow = value
      }
    },

		mounted() {
      console.log(this.urlList)
		},

		methods: {
      onClose(){
        this.isShow = false
        this.$emit('update:show', false)
      }
    }
	}
</script>

<style>
.image_viewer .el-icon-circle-close {
  color: white;
}
</style>

<style scoped>

</style>
