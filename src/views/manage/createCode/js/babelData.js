const tableLabelObj = {
    "remark": "备注",
    "status": "状态",
    "name": "名称",
    "nick": "昵称",
    "shopName": "店铺名称",
    "price": "价格",
    "balance": "余额",
    "integral": "积分",
    "phone": "手机号",
    "email": "邮箱",
    "address": "地址",
    "id": "ID",
    "code": "编码",
    "createTime": "创建时间",
    "updateTime": "最近时间",
    "loginTime": "登录时间",
    "startTime": "开始时间",
    "endTime": "结束时间",
    "account": "账号",
    "quantity": "数量",
    "type": "类型",
    "sort": "排序",
    "roleName": "角色名称",

}
const tableContentsTypeObj = {
    "createTime": { type: "time", data: 'Y-MM-DD HH:mm' },
    "updateTime": { type: "time", data: 'Y-MM-DD HH:mm' },
    "loginTime": { type: "time", data: 'Y-MM-DD HH:mm' },
    "startTime": { type: "time", data: 'Y-MM-DD HH:mm' },
    "endTime": { type: "time", data: 'Y-MM-DD HH:mm' },
    // "type": { type: "类型", data: [] },
}

const ScreenListTypeObj = {
    "createTime": { type: "daterange", data: "" },
    "updateTime": { type: "daterange", data: "" },
    "loginTime": { type: "daterange", data: "" },
    "startTime": { type: "daterange", data: "" },
    "endTime": { type: "daterange", data: "" },
    "type": { type: "type", data: [{ key: "1", value: "正常" }]},
    "status": { type: "type", data: [{ key: "1", value: "正常" }]},
    "payType": { type: "type", data: [{ key: "1", value: "正常" }]},
}
export default {
    tableLabelObj,
    tableContentsTypeObj,
    ScreenListTypeObj,
}