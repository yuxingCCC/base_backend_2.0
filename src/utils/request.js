import axios from '@/config/http'
import message from '@/utils/message'

/**
 * 常规 axios 操作封装
 */
export default {
	/**
	 * @url: 路径
	 * @params: 参数
	 * @headers: 请求头
	 * @type:array : 允许参数为数组
	 * @closeErrInfo: 是否关闭错误信息弹出
	 * @success: 成功的钩子
	 * @error: 失败的钩子
	 * @then: 请求成功的钩子
	 * @catch: 请求失败的钩子
	 * @allError: 所有错误执行的钩子
	 * @finally: 无论成功或者失败都会执行的钩子
	 */
	post(data) {
		let qs = require('qs')
		let params = data.type == "array" ? qs.stringify(data.params, {
			arrayFormat: 'repeat'
		}) : (Object.prototype.toString.call(data.params) == '[object FormData]' ? data.params : qs.stringify(data.params));
		let headers = data.type == "form-data" ? {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		} : data.headers
		var r = axios.post(data.url, params, headers);

		// 请求
		r.then(response => {
			try {
				if (response.data.message == "success") {
					// 成功回调函数
					if (data.success) data.success(response.data.result, response);
				} else if (response.data.message == "error") {
					if (!data.closeErrInfo) message.error(response.data.result)
					// 失败的回调函数
					if (data.error) data.error(response.data.result, response);
					if (data.allError) data.allError(response);
				} else if (response.data.message == "info") {
					if (!data.closeInfo) message.info(response.data.result)
					if (data.info) data.info(response.data.result, response);
				} else if (response.data.message == "warning") {
					if (!data.closeWarningInfo) message.info(response.data.result)
					if (data.warning) data.warning(response.data.result, response);
				}
				// 请求成功的回调
				if (data.then) data.then(response);
				if (data.finally) data.finally();
			} catch (e) {
				console.error(e)
				if (data.finally) data.finally();
				if (data.allError) data.allError(e);
			}
		})

		// 异常
		r.catch(error => {
			console.error(error)
			if (data.finally) data.finally();
			// 请求失败的回调函数
			if (data.catch) data.catch(error);
			if (data.allError) data.allError(error);
			if (!data.closeCodeInfo) {
				if (error.response && error.response.status) {
					// 状态码处理
					switch (error.response.status) {
						case 401:
							break;
						case 404:
							message.error('请求错误')
							break;
						case 403:
							message.error('无权访问')
							break;
						case 413:
							message.error('请求实体内容过大')
							break;
						case 500:
							message.error('系统异常')
							break;
						case 504:
							message.error('无法连接服务器')
							break;
						default:
							message.error("发生错误, errorStatus" + error.response.status)
							break;
					}
				} else if (error.code) {
					switch (error.code) {
						case "ECONNABORTED":
							message.error("请求超时, 网络不给力哦")
							break;
						default:
							message.error("发生错误, errorCode" + error.code)
							break;
					}
				}
			}
		})
	},


	get(data) {

	}
}
