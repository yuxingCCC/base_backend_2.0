const common = require('../../../js/common/index')
const {  } = require('../findCreate/findCreate');
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
               
                fs.writeFileSync(filePath, dataBuff)// 保存修改
                
                resolve('结束')
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    },

}
