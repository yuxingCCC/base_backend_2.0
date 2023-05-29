<!--
	时间：2018-10-27
	描述：获取手机验证码
-->
<template>
	<el-button type="primary" size="small" @click="getCode" style="width: 120px;">{{codeText}}</el-button>
</template>

<script>
	import common from '@/utils/common'

	export default {
		props: {
			phone: {	// 手机号码
				type: String,
				required: true
			},		
			imgCode: { 	// 图片验证码
				type: String,
				required: true
			},	
			imgSign: String,	// 图片验证码签名
			postUrl: String,	// 自定义post 请求链接
			isCheckPhone: false,
			before: Function,	// 发送验证码前的回调,参数:发送验证码的回调
			phoneSign: String,	// 返回出去的短信验证码签名
			error: Function
		},

		data() {
			return {
				time: 60,
				flag: true,
				codeText: '获取验证码',
				setInt: ''
			}
		},
		
		mounted(){
			
		},

		watch: {
			time(value) {
				if(value == 0) {
					clearInterval(this.setInt);
					this.time = 60;
					this.codeText = '获取验证码';
					this.flag = true;
				}
			}
		},

		methods: {
			getCode() {
				if(!this.flag) {
					return;
				}
				if(this.postUrl){
					this.sendByPostUrl();
					return;
				}
				if( this.isCheckPhone && !common.isPhone(this.phone)) {
					this.$message.error('手机号码格式不正确')
					return;
				}
				if(this.before){
					this.before( ()=>{
						this.send();
					});
				} else{
					this.send()
				}
			},
			
			send(){
				let qs = require('qs')
				this.$axios.post('phone/phoneCode', qs.stringify({
					phone: this.phone,
					code: this.imgCode
				})).then(response => {
					if(response.data.message == "succ") {
						this.$message.success("短信验证码已发送, 请注意查收")
						this.flag = false
						this.time--
						this.codeText = this.time + ' s后获取'
						this.setInt = setInterval(() => {
							this.time--
							this.codeText = this.time + ' s后获取'
						}, 1000)
						this.$emit('update:phoneSign', response.headers.phonesign)
					} else {
						this.$message.error(response.data.result);
						if(this.error) this.error();
					}
				}).catch(error => {
					this.$message.error('验证码发送异常')
					if(this.error) this.error();
				})
			},
			
			sendByPostUrl(){
				this.$axios.post(this.postUrl, this.$qs.stringify({
					verifyCode: this.imgCode,
					verifySign: this.imgSign
				})).then(response => {
					if(response.data.message == "succ") {
						this.$message.success("短信验证码已发送, 请注意查收")
						this.flag = false
						this.time--
						this.codeText = this.time + ' s后重新获取'
						this.setInt = setInterval(() => {
							this.time--
							this.codeText = this.time + ' s后重新获取'
						}, 1000)
						this.$emit('update:phoneSign', response.headers.phoneSign)
					} else {
						this.$message.error(response.data.result)
					}
				}).catch(error => {
					this.$message.error('验证码发送异常')
				})
			}
		}
	}
</script>

<style>

</style>