import message from '@/utils/message';
import axios from 'axios';
const requist = axios.create({
	baseURL: 'http://localhost:' + require('../../../../config/envConfig.js').nodePort + '/api/',
	headers: { 'Content-Type': 'application/json' }
})
requist.interceptors.response.use(config => {
	if (config.data.status == 500) message.error(config.data.body)
	return config
})

/** 最终生成空模板 */
export const getTnull = async (data) => requist({ url: 'automation/Tnull', data, method: 'post', })

/** 最终生成表单空模板 */
export const getTform = async (data) => requist({ url: 'automation/Tform', data, method: 'post', })

/** 最终生成确认操作按钮 */
export const getTconfirmXX = async (data) => requist({ url: 'automation/TconfirmXX', data, method: 'post', })

/** 最终生成上下架操作按钮 */
export const getTtwoOption = async (data) => await requist({ url: 'automation/TtwoOption', data, method: 'post', })

/** 最终生成审核需要理由操作按钮 */
export const getTtwoReason = async (data) => await requist({ url: 'automation/TtwoReason', data, method: 'post', })

/** 最终空白页面 */
export const getTnullPage = async (data) => await requist({ url: 'automation/TnullPage', data, method: 'post', })

/** 最终表单页面 */
export const getTformPage = async (data) => await requist({ url: 'automation/TformPage', data, method: 'post', })
