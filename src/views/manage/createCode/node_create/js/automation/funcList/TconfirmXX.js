const common = require('../../common/index')
const { optionBtnCreateCode,methodsCreateCode } = require('../findCreate/findCreate');
const fs = require('fs')
const resolves = dir => require('path').join(__dirname, '../../../../../../' + dir); // 获取 manage 位置
module.exports = {
    create: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 读写文件 同步读取
                let filePath = resolves(data.pageInfo.component) + '.vue'    // 文件位置
                let dataBuff = fs.readFileSync(filePath).toString()
                dataBuff = await optionBtnCreateCode(dataBuff, templateOptionBtn(data)) // 往操作插入按钮
                dataBuff = await methodsCreateCode(dataBuff, templgateHandleConfirm(data)) // 往methods插入函数

                fs.writeFileSync(filePath, dataBuff)// 保存修改

                resolve('结束')
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    },

}
/**操作按钮模板 */
const templateOptionBtn = (data) => `<el-button type="${data.formData.optionColor}" size="small" plain ` +
    `@click="handle${data.formData.name}(scope.row)" v-role="'${data.formData.url[1]}'">${data.formData.optionBtn}</el-button>`

/**操作函数 */
const templgateHandleConfirm = (data) => {
    return `handle${data.formData.name}(row) {
    if (this.load) return;
    this.$confirm("${data.formData.title}", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        this.load = true;
        this.$request.post({
            url: "${data.formData.url[1]}",
            params: { id: row.id },
            success: (result) => {
                this.$message.success("删除成功");
                this.getList();
            },
            finally: () => {
                this.load = false;
            },
        });
    });
},`
}
