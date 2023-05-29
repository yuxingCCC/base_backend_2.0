/**
 * @author czz
 * @explain 全局改写vue代码操作函数
 */

const fs = require('fs')

module.exports = {
    /** * 往头部插入按钮 main-head */
    headBtnCreateCode: (data, str) => {
        return new Promise((resolve, reject) => {
            let dataArr = data.split('\n')
            try {
                resolve(findTag(dataArr, str, 'main-head', 1))
            } catch (error) {
                reject(error)
            }
        })
    },
    /** * 往操作插入按钮  */
    optionBtnCreateCode: (data, str) => {
        return new Promise(async (resolve, reject) => {
            try {
                let dataArr = data.split('\n')
                var re = /<el-table-column[^>]*label=['"](操作)['"][^>]*>([\s\S]*?)<\/el-table-column>/g;
                let oldStr = data.match(re)?.[0] // 旧数据用于替换
                if (oldStr == null) {
                    let tIndex = dataArr.findIndex(item => item.search(`</el-table>`) != -1)
                    let tNt = dataArr[tIndex].slice(0, dataArr[tIndex].search(`</el-table>`)); // 获取换行
                    let tempStr = `\n${tNt}<el-table-column label="操作" align="center" class-name="operation" min-width="100px" fixed="right">` +
                        `\n${tNt}\t<template slot-scope="scope">` +
                        `\n\t\t${templateNt(str, tNt)}`
                            `\n${tNt}\t</template>` +
                        `\n${tNt}</el-table-column>`
                    dataArr.splice(tIndex, 0, tempStr)
                    resolve(dataArr.join('\n'))
                } else {
                    let tempData = await findTag(oldStr.split('\n'), str, 'template', 2)
                    resolve(data.replace(oldStr, tempData))
                }
            } catch (error) {
                reject('生成操作按钮失败')
            }
        })
    },
    /** 动态引入 组件*/
    importCreateCode: (data, str) => {
        return new Promise(async (resolve, reject) => {
            try {
                let tempData = JSON.parse(JSON.stringify(data.split('\n')))
                let index = tempData.findIndex(item => item.search(`export default`) != -1)
                if (index == -1) return reject("引入组件失败 没有找到 export default")
                tempData.splice(index, 0, str)
                resolve(tempData.join('\n'))
            } catch (error) {
                reject('引入组件失败')
            }
        })
    },
    /** *components 对象内 插入内容 */
    cmpsCreateCode: (data, str) => {
        return new Promise((resolve, reject) => {
            let dataArr = data.split('\n')
            let exIndex = dataArr.findIndex(item => item.search(`export default`) != -1)
            if (exIndex == -1) return reject('生成components 失败 , 没找到 export default')
            let exNt = dataArr[exIndex].slice(0, dataArr[exIndex].search(`export default`)); // 获取换行
            // 是否 查到 components: {
            if (data.search(/components(.*?)\{/) != -1) {
                let itemStr = dataArr.find(item => item.search(/components(.*?)\{/) != -1)
                if (itemStr.search(/components([\s\S]*?)\}/g) != -1) {
                    // 不换行的 插入的 components: { CmpsTest },
                    let re = /components([\s\S]*?)\{(.*?)\}/g, newData
                    let execData = re.exec(itemStr)
                    let contentStr = execData[2].trim()
                    if (contentStr[contentStr.length - 1] == ',') contentStr = contentStr.slice(0, contentStr.length - 1)
                    if (contentStr == '') {
                        contentStr = `components: { ${str} },`
                        newData = data.replace(itemStr, templateNt(contentStr, exNt))
                    } else {
                        contentStr = ` ${contentStr}, ${str} `
                        newItemStr = itemStr.replace(execData[2], contentStr)
                        newData = data.replace(itemStr, newItemStr)
                    }
                    resolve(newData)
                } else if (itemStr.search(/components([\s\S]*?)\{/g) != -1) {
                    // 换行的 插入的 components: { 
                    let cmpsIndex = dataArr.findIndex(item => item.search(/components([\s\S]*?)\{/g) != -1)
                    let cmpsNt = dataArr[cmpsIndex].slice(0, dataArr[cmpsIndex].search(/components([\s\S]*?)\{/g)); // 获取换行
                    dataArr.splice(cmpsIndex + 1, 0, templateNt(`${str},`, cmpsNt))
                    resolve(dataArr.join('\n'))
                }
                return
            }
            // 未查询到 components: { 直接创建
            dataArr.splice(exIndex + 1, 0, templateNt(`components: { ${str} },`, exNt))
            resolve(dataArr.join('\n'))
        })
    },
    /** *在模板内插入 vue组件 */
    cmpsHtmlCreateCode: (data, str) => {
        return new Promise((resolve, reject) => {
            let reg = /<template[^>]*>([\s\S]*)<\/template>([\s\S]*)<script>/g
            let execData = reg.exec(data)
            if (execData == null) return reject('没找到template')
            let dataStr = execData[1].split('\n').reverse()
            const endIndex = dataStr.findIndex(item => item.search(/<(.*?)>/g) != -1)
            if (endIndex == -1) return reject('没找到div')
            const nt = dataStr[endIndex].slice(0, dataStr[endIndex].search(/<(.*?)>/g)); // 获取换行
            dataStr.splice(endIndex + 1, 0, templateNt(str, nt))
            dataStr = dataStr.reverse().join('\n')
            data = data.replace(execData[1], dataStr)
            resolve(data)
        })
    },
    /** *在data里插入变量 */
    dataCreateCode: (data, str) => {
        return new Promise((resolve, reject) => {
            try {
                let reg = /data[ |\t]*\(\)[ |\t]*\{([\s\S]*?)return[ |\t]\{/g
                const execData = reg.exec(data)
                if (execData == null) {
                    let dataArr = data.split('\n')
                    let exIndex = dataArr.findIndex(item => item.search(`port default`) != -1)
                    let exNt = dataArr[exIndex].slice(0, dataArr[exIndex].search(`export default`)); // 获取换行
                    dataArr.splice(exIndex + 1, 0, templateNt(`data() { \n\t${templateNt(`return { \n\t\t\t${exNt}${str}\n\t\t${exNt}}`, exNt)} \n\t${exNt}},`, exNt))
                    resolve(dataArr.join('\n'))
                    return
                }
                let tempArr = execData[0].split('\n').reverse()
                const nt = tempArr[0].slice(0, tempArr[0].search(/return[ |\t]\{/g)); // 获取换行
                tempArr.unshift(templateNt(str, nt))
                let tempData = tempArr.reverse().join('\n')
                let newData = data.replace(execData[0], tempData)
                resolve(newData)
            } catch (error) {
                reject('生成data变量失败')
            }
        })
    },
    /**在 methods 插入函数 */
    methodsCreateCode: (data, str) => {
        return new Promise((resolve, reject) => {
            let dataArr = data.split('\n')
            let reg = /methods\:[ |\t]*\{/g
            const execData = reg.exec(data)
            if (execData == null) {
                let dataArr = data.split('\n')
                let exIndex = dataArr.findIndex(item => item.search(`port default`) != -1)
                let exNt = dataArr[exIndex].slice(0, dataArr[exIndex].search(`export default`)); // 获取换行
                let newStr = `methods: { \n${templateMoreNt(str, exNt)} \n${exNt}},`
                dataArr.splice(exIndex + 1, 0, templateMoreNt(newStr, exNt))
                resolve(dataArr.join('\n'))
                return
            }
            let tempArr = execData[0].split('\n')
            let index = dataArr.findIndex(item => item.search(/methods\:[ |\t]*\{/g) != -1)
            let nt = dataArr[index].slice(0, dataArr[index].search(/methods\:[ |\t]*\{/g)); // 获取换行
            tempArr.push(templateMoreNt(str, nt))
            let newData = data.replace(execData[0], tempArr.join('\n'))
            resolve(newData)
        })
    }


}

/** 多行转换继承 tab 空格符 */
const templateMoreNt = (e, nt = '') => e.split('\n').map(item => `${nt}\t${item}`).join("\n")
/** 单行继承 tab 空格符*/
const templateNt = (e, nt = '') => `${nt}\t${e}`
/** * 查找标签并在指定内容下插入内容 
 * @params type 1 不跨行标签 / 2 跨行标签
 * */
const findTag = (oldData, str, tag, type = 1) => {
    let data = JSON.parse(JSON.stringify(oldData))
    return new Promise((resolve, reject) => {
        let index = data.findIndex(item => item.search(`</${tag}>`) != -1)
        if (index == -1) return reject(`没有找到 <${tag}> 标签`)
        if (index != -1) {
            let reg1 = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'g')
            let reg2 = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'g')
            // 兼容 <main-head> </main-head> 格式
            if (data[index].search(type == 1 ? reg1 : reg2) != -1) {
                let nt = data[index].slice(0, data[index].search(reg2)); // 获取换行
                let execData = reg2.exec(data[index])
                if (execData == null) return reject(`没有找到 <${tag}> 标签`)
                let content = execData[1] == ' ' || execData[1] == '' || execData[1] == '  ' ? '' : '\n' + nt + '\t' + execData[1]
                let temp = `${nt}<${tag}>${content}\n${templateNt(str, nt)}\n${nt}</${tag}>\t`
                data.splice(index, 1, temp)
                resolve(data.join('\n'))
                return
            }

            let nt = data[index].slice(0, data[index].search(`</${tag}>`)); // 获取换行
            data.splice(index, 0, templateNt(str, nt))
            resolve(data.join('\n'))
        }
    })
}