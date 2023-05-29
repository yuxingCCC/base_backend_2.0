const common = require('../../../js/common/index')
const { headBtnCreateCode, optionBtnCreateCode, importCreateCode, cmpsCreateCode, cmpsHtmlCreateCode, dataCreateCode,methodsCreateCode } = require('../findCreate/findCreate');
const fs = require('fs')
const resolves = dir => require('path').join(__dirname, '../../../../../../' + dir); // 获取 manage 位置
const template = require('../template/Tform'); // 生成空模板组件
module.exports = {
    create: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 读写文件 同步读取
                let filePath = resolves(data.pageInfo.component) + '.vue'    // 文件位置
                let dataBuff = fs.readFileSync(filePath).toString()
                if (data.formData.ishead) dataBuff = await headBtnCreateCode(dataBuff, templateHeadBtn(data)) // 往头部 main-head 插入按钮 
                if (data.formData.isOption) dataBuff = await optionBtnCreateCode(dataBuff, templateOptionBtn(data)) // 往操作插入按钮
                dataBuff = await importCreateCode(dataBuff, templateImport(data)) // 动态引入 组件
                dataBuff = await cmpsCreateCode(dataBuff, templateCmps(data)) //components 对象内 插入内容
                dataBuff = await cmpsHtmlCreateCode(dataBuff, templateCmpsHtml(data)) // 在模板内插入 vue组件
                dataBuff = await dataCreateCode(dataBuff, templateDataShow(data)) // data 内插入一个变量
                dataBuff = await methodsCreateCode(dataBuff, templgateHandleFunc(data)) // 往methods插入函数

                fs.writeFileSync(filePath, dataBuff)
                let cmpsPath = resolves(common.cmpsPath(data.pageInfo.component)) // 组件生成位置
                await common.mkdir(cmpsPath)
                fs.writeFileSync(cmpsPath + '/Cmps' + data.formData.fileName + '.vue', template(data.formData))
                resolve('结束')
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    },

}
/**组件模板 */
const templateHeadBtn = (data, type) => `<el-button type="${data.formData.headColor}" size="small" @click="show${data.formData.fileName} = true" v-role="'${data.formData.addUrl[1]}'">${data.formData.headBtn}</el-button>`
const templateOptionBtn = (data, type) => `<el-button type="${data.formData.optionColor}" size="small" plain @click="handle${data.formData.fileName}(scope.row)" v-role="'${data.formData.updateUrl[1]}'">${data.formData.optionBtn}</el-button>`
/**引入模板 */
const templateImport = (data) => `import Cmps${data.formData.fileName} from "./cmps/Cmps${data.formData.fileName}.vue";`
/**组件注册模板 */
const templateCmps = (data) => `Cmps${data.formData.fileName}`
/**data弹窗变量模板 */
const templateDataShow = (data) => `show${data.formData.fileName}: false,`
/**HTML引入组件模板 */
const templateCmpsHtml = (data) => `<Cmps${data.formData.fileName} :visible.sync="show${data.formData.fileName}" @success="getList" ref="ref${data.formData.fileName}" />`
/**操作函数 */
const templgateHandleFunc = (data) => {
    return `handle${data.formData.fileName}(row) {
    this.show${data.formData.fileName} = true
    this.$refs.ref${data.formData.fileName}.formData = JSON.parse(JSON.stringify(row))
},`
}