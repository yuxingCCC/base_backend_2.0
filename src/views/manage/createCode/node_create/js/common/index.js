const fs = require('fs')

module.exports = {
    mkdir: (dir) => {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, (res) => {
                resolve(res)
            })
        })
    },
    rmdir: (dir) => {
        return new Promise((resolve, reject) => {
            fs.rmdir(dir, (res) => {
                resolve(res)
            })
        })
    },
    // 生成组件路径
    cmpsPath:(url,type=1)=>{
        if(typeof url!='string')return 
        let tempArr = url.split('/')
        tempArr.splice(tempArr.length-1,1)
        return tempArr.join('/')+'/cmps'
    },
    /**生成子页面路径 */
    pagePath:(url,type=1)=>{
        if(typeof url!='string')return 
        let tempArr = url.split('/')
        tempArr.splice(tempArr.length-1,1)
        return tempArr.join('/') 
    }
}