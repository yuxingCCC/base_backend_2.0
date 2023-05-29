const common = require('../../common/index')
const { headBtnCreateCode, optionBtnCreateCode} = require('../findCreate/findCreate');
const fs = require('fs')
const resolves = dir => require('path').join(__dirname, '../../../../../../' + dir); // 获取 manage 位置
const template = require('../template/TformPage'); // 生成空模板组件
module.exports = {
    create: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 读写文件 同步读取
                let filePath = resolves(data.pageInfo.component) + '.vue'    // 文件位置
                let dataBuff = fs.readFileSync(filePath).toString()

                let pagePath = resolves(common.pagePath(data.pageInfo.component)) // 组件生成位置
                data.pageInfo.routerPath = common.pagePath(data.pageInfo.path) + '/Child' + data.formData.fileName // 路由

                if (data.formData.ishead) dataBuff = await headBtnCreateCode(dataBuff, templateHeadBtn(data)) // 往头部 main-head 插入按钮 
                if (data.formData.isOption) dataBuff = await optionBtnCreateCode(dataBuff, templateOptionBtn(data)) // 往操作插入按钮
        
                fs.writeFileSync(filePath, dataBuff)// 保存修改
                await common.mkdir(pagePath)// 生成文件夹
                fs.writeFileSync(pagePath + '/Child' + data.formData.fileName + '.vue', template(data.formData))// 生成页面
                resolve('生成表单页面')
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    },

}
/**头部按钮模板 */
const templateHeadBtn = (data, type) => `<el-button type="${data.formData.headColor}" size="small" @click="$router.push('${data.pageInfo.routerPath}')">${data.formData.headBtn}</el-button>`
/**操作按钮模板 */
const templateOptionBtn = (data, type) => `<el-button type="${data.formData.optionColor}" size="small" plain @click="$router.push('${data.pageInfo.routerPath}?id=' + scope.row.id)">${data.formData.optionBtn}</el-button>`
