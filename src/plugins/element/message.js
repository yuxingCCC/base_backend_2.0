/**
 * 封装message 消息提示
 */
import { Message } from 'element-ui'

export default { 
	success(msg){
		Message({
			showClose: true,
          	message: msg,
          	type: 'success'
		})
	},

	error(msg){
		Message({
			showClose: true,
	        message: msg,
	        type: 'error'
		})
	},
	
	warning(msg){
		Message({
			showClose: true,
	        message: msg,
	        type: 'warning'
		})
	},
	
	defaultMsg(msg){
		Message({
			showClose: true,
	        message: msg
		})
	}
}
