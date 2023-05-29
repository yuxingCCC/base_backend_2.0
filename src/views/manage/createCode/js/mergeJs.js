import request from '@/utils/request';
import message from '@/utils/message';
import axios from 'axios';
import babelData from './babelData.js';

const nodePort = require('../../../../config/envConfig.js').nodePort;
const baseUrl = 'http://localhost:' + nodePort + '/api/';
// const baseUrl = 'http://192.168.0.203:' + nodePort + '/api/';
// 请求列表数据 获取数据模型
export const getTableList = (tableData) => {
	return new Promise((resolve, reject) => {
		request.post({
			url: tableData.url,
			params: tableData.parameters,
			success: (res) => {
				let data = {}
				try {
					if (res.list.length) {
						data = res.list[0]
					} else if (res.list.list.length) {
						data = res.list.list[0]
					}
				} catch (error) {
					message.error('该接口内没有数据,无法生成数据模型');
					data = { test: '' }
				}
				let arrTemp = []
				// 初始化数据
				let index = 0 // 索引
				for (const key in data) {
					arrTemp.push({
						label: '',
						prop: key,
						typeObj: {
							type: 'text',
							data: null
						},
						isShow: true,
						sort: index++
					})
				}
				arrTemp.forEach(item => {
					// 初始化 自定义 label
					if (babelData.tableLabelObj[item.prop]) {
						item.label = babelData.tableLabelObj[item.prop]
					}
					if (babelData.tableContentsTypeObj[item.prop]) {
						item.typeObj.type = babelData.tableContentsTypeObj[item.prop].type
						item.typeObj.data = babelData.tableContentsTypeObj[item.prop].data
					}
				});
				arrTemp = JSON.parse(JSON.stringify(arrTemp))
				resolve(arrTemp)
			},
		});
	})
};

// 请求生成文件
export const getCreateTable = (tableData) => {
	return new Promise((resolve, reject) => {
		//使用 axios 请求 post 请求
		axios({
			url: baseUrl + 'createCode/tablePreview',
			data: JSON.stringify(tableData),
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			resolve(true)
			// console.log(res)
		}).catch(err => {
			resolve(false)
		})
	})
};

// 请求 服务器确认文件无异常
export const getCreateTableCheck = () => {
	return new Promise((resolve, reject) => {
		//使用 axios 请求 post 请求
		axios({
			url: baseUrl + 'createCode/tableCheck',
			method: 'post',
		}).then(res => {
			resolve(true)
		}).catch(err => {
			resolve(false)
		})
	})
}


// 最终生成 文件 
export const getCreateTableFlie = (tableData) => {
	return new Promise((resolve, reject) => {
		//使用 axios 请求 post 请求
		axios({
			url: baseUrl + 'createCode/tableFile',
			data: JSON.stringify(tableData),
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			resolve(true)
			console.log(res)
		}).catch(err => {
			resolve(false)
		})
	})
}


