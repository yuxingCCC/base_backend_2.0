const Router = require("koa-router");
const router = new Router();

const fs = require('fs')
const path = require('path')

const resolves = dir => path.join(__dirname, dir);

/**
 * @route POST api/automation/Tnull
 * @desc  生成空模板
 */
router.post("/Tnull", async (ctx, next) => {
    let data = ctx.request.body
    try {
        const res = await require('../../js/automation/funcList/Tnull').create(data)
        ctx.body = { status: 200, message: 'success', body: '生成空白模板成功!' };
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})

/**
 * @route POST api/automation/Tform
 * @desc  生成空表单模板
 */
 router.post("/Tform", async (ctx, next) => {
    let data = ctx.request.body
    try {
        ctx.body = { status: 200, message: 'success', body: '生成表单模板成功!' };
        const res = await require('../../js/automation/funcList/Tform').create(data)
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})

/**
 * @route POST api/automation/TconfirmXX
 * @desc  生成确认删除模板
 */
 router.post("/TconfirmXX", async (ctx, next) => {
    let data = ctx.request.body
    try {
        ctx.body = { status: 200, message: 'success', body: '生成操作按钮成功!' };
        const res = await require('../../js/automation/funcList/TconfirmXX').create(data)
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})

/**
 * @route POST api/automation/TtwoOption
 * @desc  生成上下架 冻结解冻 模板
 */
 router.post("/TtwoOption", async (ctx, next) => {
    let data = ctx.request.body
    try {
        ctx.body = { status: 200, message: 'success', body: '生成操作按钮成功!' };
        const res = await require('../../js/automation/funcList/TtwoOption').create(data)
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})

/**
 * @route POST api/automation/TtwoReason
 * @desc  生成审核 需要理由模板
 */
 router.post("/TtwoReason", async (ctx, next) => {
    let data = ctx.request.body
    try {
        ctx.body = { status: 200, message: 'success', body: '生成操作按钮成功!' };
        const res = await require('../../js/automation/funcList/TtwoReason').create(data)
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})


/**
 * @route POST api/automation/TnullPage
 * @desc  生成空白页面
 */
 router.post("/TnullPage", async (ctx, next) => {
    let data = ctx.request.body
    try {
        ctx.body = { status: 200, message: 'success', body: '生成空白页面!' };
        const res = await require('../../js/automation/funcList/TnullPage').create(data)
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})

/**
 * @route POST api/automation/TformPage
 * @desc  生成空白页面
 */
 router.post("/TformPage", async (ctx, next) => {
    let data = ctx.request.body
    try {
        ctx.body = { status: 200, message: 'success', body: '生成表单页面!' };
        const res = await require('../../js/automation/funcList/TformPage').create(data)
        console.log(res);
    } catch (error) {
        ctx.body = { status: 500, message:'error', body: error };
    }
})



module.exports = router.routes();

