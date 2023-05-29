const common = require('../../../js/common/index')
const { headBtnCreateCode, optionBtnCreateCode, importCreateCode, cmpsCreateCode, cmpsHtmlCreateCode,dataCreateCode } = require('../findCreate/findCreate');
const fs = require('fs')
const resolves = dir => require('path').join(__dirname, '../../../../../../' + dir); // 获取 manage 位置
const template = require('../template/Tnull'); // 生成空模板组件
module.exports = {
    create: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 读写文件 同步读取
                let filePath = resolves(data.pageInfo.component) + '.vue'    // 文件位置
                let dataBuff = fs.readFileSync(filePath).toString()
                if(data.formData.ishead)dataBuff = await headBtnCreateCode(dataBuff, templateHeadBtn(data)) // 往头部 main-head 插入按钮 
                if(data.formData.isOption)dataBuff = await optionBtnCreateCode(dataBuff, templateOptionBtn(data)) // 往操作插入按钮
                dataBuff = await importCreateCode(dataBuff, templateImport(data)) // 动态引入 组件
                dataBuff = await cmpsCreateCode(dataBuff,templateCmps(data)) //components 对象内 插入内容
                dataBuff = await cmpsHtmlCreateCode(dataBuff, templateCmpsHtml(data)) // 在模板内插入 vue组件
                dataBuff = await dataCreateCode(dataBuff, templateDataShow(data)) // data 内插入一个变量

                fs.writeFileSync(filePath, dataBuff)// 保存修改

                let cmpsPath = resolves(common.cmpsPath(data.pageInfo.component)) // 组件生成位置
                await common.mkdir(cmpsPath)
                fs.writeFileSync(cmpsPath + '/Cmps' + data.formData.fileName + '.vue', template())
                resolve('结束')
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    },

}
/**头部按钮模板 */
const templateHeadBtn = (data,type) => `<el-button type="${data.formData.headColor}" size="small" @click="show${data.formData.fileName} = true">${data.formData.headBtn}</el-button>`
/**操作按钮模板 */
const templateOptionBtn = (data,type) => `<el-button type="${data.formData.optionColor}" size="small" plain @click="show${data.formData.fileName} = true">${data.formData.optionBtn}</el-button>`
/**引入模板 */
const templateImport = (data) => `import Cmps${data.formData.fileName} from "./cmps/Cmps${data.formData.fileName}.vue";`
/**组件注册模板 */
const templateCmps = (data) => `Cmps${data.formData.fileName}`
/**data弹窗变量模板 */
const templateDataShow = (data) => `show${data.formData.fileName}: false,`
/**HTML引入组件模板 */
const templateCmpsHtml = (data) => `<Cmps${data.formData.fileName} :visible.sync="show${data.formData.fileName}" @success="getList" ref="ref${data.formData.fileName}" />`