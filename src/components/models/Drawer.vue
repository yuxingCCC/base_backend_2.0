<template>
	<el-drawer title="设置选项" :visible.sync="drawer" direction="rtl" :before-close="handleClose" id="tools" size="320px">
		<div class="content">
			<div @click="dialogVisible = true">
				<i class="el-icon-lock"></i>
				<span>设置密码</span>
			</div>
			 <!-- <div>
				<i class="icon-default-home"></i>
				<span>默认首页</span>
			</div>
			<div>
				<i class="icon-theme"></i>
				<span>主题色</span>
			</div>
			<div>
				<i class="icon-menu"></i>
				<span>菜单设置</span>
			</div>
			<div>
				<i class="icon-tabs"></i>
				<span>选项卡设置</span>
			</div> -->
		</div>
		<div class="drawer_bottom">
			<div class="left"></div>
			<div class="exit" @click="exit">
				<i class="icon-exit"></i>退出登录
			</div>
		</div>
		<el-dialog
			title="修改密码"
			:visible.sync="dialogVisible"
			width="25%"
			@close="closeDialog"
			append-to-body>
			<el-form label-width="100px">
				<el-form-item label="原密码：">
					<el-input @keyup.enter.native="submit" type="password" placeholder="原密码" v-model="formData.oldPassword"></el-input>
				</el-form-item>
				<el-form-item label="新密码：">
					<el-input @keyup.enter.native="submit" type="password" placeholder="新密码" v-model="formData.newPassword"></el-input>
				</el-form-item>
				<el-form-item label="确认密码：">
					<el-input @keyup.enter.native="submit" type="password" placeholder="确认密码" v-model="againPassword"></el-input>
				</el-form-item>
				<el-form-item label="图片验证码：">
					<el-input @keyup.enter.native="submit" placeholder="图片验证码" v-model="formData.verifyCode" maxlength="4"></el-input>
					<ImgCode ref="imgCode" :sign.sync="formData.verifySign" />
				</el-form-item>
			</el-form>
			<div class="align-center">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
		</el-dialog>
	</el-drawer>
</template>

<script>
import ImgCode from '@/components/utils/ImgCode'
import rsa from '@/utils/rsa'
	export default {
		components:{
			ImgCode
		},
		data() {
			return {
				drawer: false,
				dialogVisible: false,
				againPassword:'',
				formData:{
					newPassword:'',
					oldPassword:'',
					verifyCode:'',
					verifySign:'',
				},
			};
		},

		watch: {},

		mounted() {
			this.$pubsub.subscribe('openDrawer', msg => {
				this.drawer = true
			})
		},

		methods: {
			closeDialog(){
				this.formData = {
					newPassword:'',
					oldPassword:'',
					verifyCode:'',
					verifySign:'',
				}
				this.againPassword = ''
			},
			handleClose(done) {
				done()
			},
			submit(){
				if(this.formData.oldPassword==''){
					this.$message.error('原密码不能为空')
					return
				}
				if(this.formData.newPassword==''){
					this.$message.error('新密码不能为空')
					return
				}
				if(this.againPassword==''){
					this.$message.error('确认密码不能为空')
					return
				}
				if(this.formData.verifyCode==''){
					this.$message.error('图片验证码不能为空')
					return
				}
				if(this.formData.newPassword!=this.againPassword){
					this.$message.error('两次密码输入不一致')
					return
				}
				let newPassword = rsa.encryptByPublicKey(this.formData.newPassword)
				let oldPassword = rsa.encryptByPublicKey(this.formData.oldPassword)
				let verifyCode = this.formData.verifyCode
				this.$request.post({
					url: '/admin/adInfo/updatePassword',
					params: {
						newPassword,
						oldPassword,
						verifyCode,
						verifySign: this.formData.verifySign,
					},
					success: res=> {
						this.$message.success('操作成功')
						this.$router.push('/login')
					},
					allError: (e) => {
						this.$refs.imgCode.getImgCode();
					},
				})
			},
			exit(){
				this.$confirm('确认退出登录?', '提示').then(()=>{
					location.href = '/admin/login'
				})
			}
		}

	}
</script>

<style>
	#tools .el-drawer__header span,
	#tools .el-drawer {
		outline: none !important;
	}
	#tools .el-drawer__header{
		border-bottom: 1px solid;
		border-image:linear-gradient(to right, white ,#666666, white) 1 1 20;
		padding-bottom: 20px !important;
		margin-bottom: 0px !important;
	}
</style>

<style scoped>
	.content {
		padding: 20px;
		display: flex;
		flex-wrap: wrap;
	}

	.content>div{
		width: 25%;
		padding:5% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: all .3s;

	}

	.content>div:hover{
		background-color: #f1f1f1;
		cursor: pointer;
	}

	.content>div i{
		font-size: 36px;
		width: 36px;
		height: 36px;
		color: #666666;
	}
	.content>div span{
		font-size: 14px;
		color: #666666;
		margin-top: 5px;
	}

	.drawer_bottom{
		position: absolute;
		bottom: 0px;
		line-height: 60px;
		height: 60px;
		width: 100%;
		border-top: 1px solid;
		border-image:linear-gradient(to right, white ,#666666, white) 1 1 20;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		color: #666666;
		padding: 0px 20px;
	}

	.drawer_bottom>div{
		display: flex;
		align-items: center;
	}

	.exit{
		cursor: pointer;
	}

	.drawer_bottom .icon-exit{
		font-size: 22px;
		margin-right: 6px;
	}
	.imgCodeMode{
		height: 40px;
		width: 92px;
		top: 0;
		right: 0;
		position: absolute;
	}
</style>
