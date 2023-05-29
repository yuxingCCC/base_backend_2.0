// import ws from '@/utils/websocket'
import ws from "@/utils/websocket";

export default {
  data() {
		return {
			notify: {},
		};
	},
  mounted() {
    // 进行 websocket 初始化
			let id = sessionStorage.getItem('id');
			ws.Init(`ad-${id}`, message =>{
				console.log(message);
				message = JSON.parse(message);
				if (message.messageType === 'backUp'){
					if (message.content){
						this.$alert('数据回滚成功, 请重新登录', {
							confirmButtonText: '确定',
							callback: action => {
								this.$router.replace('/login')
							}
						});
					}else {
						this.$message.error('回滚失败')
					}
				}
			});

			this.$pubsub.subscribe('showNotify', (msg, data)=>{
				this.notify[data.uid] = this.$notify({
					title: data.title,
					message: data.message,
					duration: 0,
					position: 'bottom-right',
					showClose: false
				});
			})
  },

  methods: {
    
  },

  beforeDestroy() {
    ws.getWebSocket().close();
    // 取消订阅, 防止造成多次订阅
    this.$pubsub.unsubscribe('showNotify');
  },
}