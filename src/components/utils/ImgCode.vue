<!--
	时间：2018-09-12
	描述：图片验证码
-->
<template>
	<div class="imgCodeMode" v-loading="showCode">
		<img :src="codeUrl" @click="getImgCode"/>
	</div>
</template>

<script>
	export default{
		props:{
			sign: String
		},

		data(){
			return{
				codeUrl:'',
				showCode: true
			}
		},

		mounted(){
			this.getImgCode();
		},

		methods:{
			getImgCode(){
				this.showCode = true;
				this.$axios.get('public/verifyCode?'+Math.random(),{responseType: 'arraybuffer'}).then( (res)=>{
				  	// 后端需要的响应头中的信息参数赋值
					let codeImg =  'data:image/png;base64,' + btoa(
						new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
					)
					this.codeUrl = codeImg
					this.$emit('update:sign', res.headers.sign)
					this.showCode = false;
				}).catch((error) => {
				  console.log(error);
					this.showCode = false;
				})
			}
		}

	}
</script>

<style scoped>
	.imgCodeMode{
		height: 38px;
		padding: 0px !important;
		box-sizing: border-box;
		position: relative;
	}
	.imgCodeMode img{
		height: 100% !important;
    width: 100%;
		cursor: pointer;
		box-sizing: border-box;
		padding: 0px !important;
		margin: 0px !important;
		transition: all 2s;
		position: relative;
	}
	.el-loading-spinner .circular{
		margin: auto;
	}
</style>
