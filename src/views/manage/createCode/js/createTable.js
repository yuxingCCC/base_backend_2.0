import { getCreateTable, getCreateTableFlie } from "./mergeJs";
export const createTablePreview = async (tableData) => {
  return new Promise(async (resolve, reject) => {
    // console.log(JSON.parse(JSON.stringify(tableData)));
    
    if (!getCreateTable(tableData)) reject('生成失败')
    resolve()
  })
}


export const createTableFile = async (tableData) => {
  return new Promise(async (resolve, reject) => {
    // console.log(JSON.parse(JSON.stringify(tableData)));
    if (!getCreateTableFlie(tableData)) reject('生成失败')
    resolve()
  })
}