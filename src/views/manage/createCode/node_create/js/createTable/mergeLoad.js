/**
 * @author czz
 * 生成列表
 */

module.exports = {
	createfile: (tableData) => {
		return new Promise((resolve, reject) => {
			let vueObj = {
				btnList_T: '', // 按钮列表
				tableBtnList_T: '', // 表格按钮列表
				tableColumnList_T: '', // 表格列表
				screenDateFormList_S: '', // 筛选表单列表
				getListUrl_S: '', // 获取列表的url
				getListParmas_S: '', // 获取列表的参数
				dataList_S:''// data数据
			}

			vueObj.getListParmas_S = JSON.stringify(tableData.parameters)
			vueObj.getListUrl_S = tableData.url
			vueObj.screenDateFormList_S = screenObj(tableData)
			vueObj.tableColumnList_T = tableItemStr(tableData)
			vueObj.dataList_S = createObject(dataList_S,3)

			resolve(vueObj)
		})
	},

}
const dataList_S = {} // data数据
/**合并data 新增数据 */
const createObject = (e, num = 0) => {
    let count_n = ''
    let data = JSON.stringify(e, null, '\t')
    for (let i = 0; i < num; i++) count_n += '\t'
    data = data.slice(2, data.length - 2).split('\n').map(item=>item.slice(1,item.length)).join('\n')
    let tempData = String(count_n + data.split('\n').join('\n' + count_n))
    return tempData
}

// 内容 text
const tableItemTypeTextStr = (data) => {
	return `\t\t\t\t<el-table-column label="${data.label}" prop="${data.prop}" align="center" />`
}
// 时间转化 time
const tableItemTypeTimeStr = (data) => {
	return `\t\t\t\t<el-table-column label="${data.label}" prop="${data.prop}" align="center" >
\t\t\t\t\t<template slot-scope="scope">
\t\t\t\t\t\t<timer :date="scope.row.${data.prop}" format="${data.typeObj.data}" />
\t\t\t\t\t</template>
\t\t\t\t</el-table-column>`
}
// 类型判断 type
const tableItemTypeTypeStr = (data) => {
	let valueData = {}
	data.typeObj.data.forEach(item => {
		valueData[item.key] = item.value
	});
	if(data.isShow)dataList_S[data.prop+"Option"] = valueData
	return `\t\t\t\t<el-table-column label="${data.label}" prop="${data.prop}" align="center" >
\t\t\t\t\t<template slot-scope="scope">
\t\t\t\t\t\t<div>{{ ${data.prop}Option[scope.row.${data.prop}] }}</div>
\t\t\t\t\t</template>
\t\t\t\t</el-table-column>`
}

const tableItemTypeTemplateStr = (data)=>{
	return `\t\t\t\t<el-table-column label="${data.label}" prop="${data.prop}" align="center" >
\t\t\t\t\t<template slot-scope="scope">
\t\t\t\t\t\t
\t\t\t\t\t</template>
\t\t\t\t</el-table-column>`
}

// 表格item数据 str 对象
const tableItemStrObj = {
	'text':tableItemTypeTextStr,
	'time':tableItemTypeTimeStr,
	'type':tableItemTypeTypeStr, 
	'template':tableItemTypeTemplateStr,
}



/**表格item数据 str */
const tableItemStr = (tableData) => {
	let strArr =tableData.tableModel.sort((a,b)=>a.sort-b.sort)
	// console.log(strArr);
	return strArr.filter(item=>item.isShow).map(item=>tableItemStrObj[item.typeObj.type](item)).join('\n')
}


/**合并 screenObj 筛选对象 */ 
const screenObj = (data) => {
	// 筛选 为 true 的数据
	let strArr = []
	let arrTemp = data.formScreenList
	// 遍历 arrTemp 数组，拼接字符串
	arrTemp.sort((a,b)=>a.sort-b.sort)
	arrTemp.forEach((item) => {
		if (item.isShow) {
			if(screenArrStr[item.typeObj.type])strArr.push(screenArrStr[item.typeObj.type](item))
		}
	})
	return strArr.join('\n')
}

// input 类型的筛选条件
const screenInputStr = (data) => {
	const srt =
		`\t\t\t\t{
\t\t\t\t\ttype: 'input',
\t\t\t\t\tkey: '${data.key}',
\t\t\t\t\tplaceholder: '${data.placeholder}'
\t\t\t\t},`
	return srt
}

// datetimerange 类型的筛选条件
const  screenDatetimerangeStr = (data) => {
	const srt =
		`\t\t\t\t{
\t\t\t\t\ttype: 'daterange',
\t\t\t\t\tdateType: 'datetimerange',
\t\t\t\t\tvalue: [],
\t\t\t\t\tkey1: 'startTime',
\t\t\t\t\tkey2: 'endTime'
\t\t\t\t},`
	return srt
}
// date 类型的筛选条件
const screenDateStr = (data) => {
	const srt =
		`\t\t\t\t{
\t\t\t\t\ttype: 'date',
\t\t\t\t\tvalue: '',
\t\t\t\t\tkey: '${data.key}',
\t\t\t\t\tplaceholder: '${data.placeholder}'
\t\t\t\t},`
	return srt
}
// daterange 类型的筛选条件
const screenDaterangeStr = (data) => {
	const srt =
		`\t\t\t\t{
\t\t\t\t\ttype: 'daterange',
\t\t\t\t\tvalue: [],
\t\t\t\t\tkey1: 'startTime',
\t\t\t\t\tkey2: 'endTime'
\t\t\t\t},`
	return srt
}

// 类型判断 type
const screenTypeStr = (data) => {
	let valueData = []
	data.typeObj.data.forEach(item => {
		valueData.push({value:item.key,label:item.value})
	});
	// dataList_S[data.prop+"ScreenOption"] = valueData
	const objTemplate = {
		type: 'select',
		data: valueData,
		placeholder: data.placeholder,
		key: data.key,
		value: ''
	}
	return createObject([objTemplate],4)+","
}
// str 所有对象
const screenArrStr = {
	input: screenInputStr,
	date: screenDateStr,
	datetimerange: screenDatetimerangeStr,
	daterange:screenDaterangeStr,
	type:screenTypeStr,
}
