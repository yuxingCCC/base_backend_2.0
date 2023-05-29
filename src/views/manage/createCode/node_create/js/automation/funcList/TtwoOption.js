const common = require('../../common/index')
const { optionBtnCreateCode, methodsCreateCode } = require('../findCreate/findCreate');
const fs = require('fs')
const resolves = dir => require('path').join(__dirname, '../../../../../../' + dir); // 获取 manage 位置
module.exports = {
    create: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 读写文件 同步读取
                let filePath = resolves(data.pageInfo.component) + '.vue'    // 文件位置
                let dataBuff = fs.readFileSync(filePath).toString()
                dataBuff = await optionBtnCreateCode(dataBuff, templateOptionBtnOne(data)) // 往操作插入按钮1
                dataBuff = await optionBtnCreateCode(dataBuff, templateOptionBtntwo(data)) // 往操作插入按钮2
                dataBuff = await methodsCreateCode(dataBuff, templgateHandleTwo(data)) // 往methods插入函数
               
                fs.writeFileSync(filePath, dataBuff)// 保存修改
                resolve('结束')
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    },
}
/**操作按钮1模板 */
const templateOptionBtnOne = (data) => `<el-button v-if="scope.row.status == ${data.formData.twoData}" type="${data.formData.oneColor}" size="small" plain ` +
    `@click="handle${data.formData.name}(scope.row, ${data.formData.oneData})" v-role="'${data.formData.url[1]}'">${data.formData.oneBtn}</el-button>`
/**操作按钮2模板 */
const templateOptionBtntwo = (data) => `<el-button v-if="scope.row.status == ${data.formData.oneData}" type="${data.formData.twoColor}" size="small" plain ` +
    `@click="handle${data.formData.name}(scope.row, ${data.formData.twoData})" v-role="'${data.formData.url[1]}'">${data.formData.twoBtn}</el-button>`
/**操作函数 */
const templgateHandleTwo = (data) => {
    return `handle${data.formData.name}(row, type) {
    if (this.load) return;
    let title = "${data.formData.oneTitle}";
    if (type == ${data.formData.twoData}) title = "${data.formData.twoTitle}";
    this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        this.load = true;
        this.$request.post({
            url: "${data.formData.url[1]}",
            params: {
                id: row.id,
                ${data.formData.status}: type,
            },
            success: (res) => {
                this.$message.success("操作成功");
                this.getList();
            },
            finally: () => {
                this.load = false;
            },
        });
    })
},`
}
