const Router = require("koa-router");
const router = new Router();

const fs = require('fs')
const path = require('path')

const mergeHTML = require('../../js/createTable/mergeHTML')
const previewTemplateVue = require('../../js/createTable/previewTemplateVue')
const mergeLoad = require('../../js/createTable/mergeLoad')

let timer = null;

let base = path.resolve()
const resolves = dir => path.join(__dirname, dir);
/**
 * @route GET api/createCode/tablePreview
 * @desc  生成预览表格
 * @access 接口是公开的
 */
router.post("/tablePreview", async (ctx, next) => {
	let tableData = ctx.request.body


	let vueObj = await mergeLoad.createfile(tableData)

	await mkdir(resolves('../../../create_cmps/test_cmps'))
	fs.writeFileSync(resolves('../../../create_cmps/test_cmps/test2.vue'), mergeHTML(vueObj))
	ctx.body = {
		status: 200,
		success: true,
		body: '成功',
	};

	if (!tableData.type) timer = setTimeout(async () => {
		await rmdir(resolves('../../../create_cmps/test_cmps'))
		fs.writeFileSync(resolves('../../../create_cmps/test_cmps/test2.vue'), previewTemplateVue())
	}, 3000);
});

/**
 * @route GET api/createCode/tableCheck
 * @desc  确认生成表格
 * @access 接口是公开的
 */
router.post("/tableCheck", async (ctx, next) => {

	clearTimeout(timer);
	ctx.body = {
		status: 200,
		success: true,
		body: '成功',
	};
});

/**
 * @route GET api/createCode/tableFile
 * @desc  最终生成表格
 * @access 接口是公开的
 */
router.post("/tableFile", async (ctx, next) => {
	let tableData = ctx.request.body

	let vueObj = await mergeLoad.createfile(tableData)
	let folderUrl = resolves('../../../../' + tableData.fileForm.folder)
	let folderFileUrl = resolves('../../../../' + tableData.fileForm.folder + '/' + tableData.fileForm.fileFolderName)
	let fileUrl = resolves('../../../../' + tableData.fileForm.folder + '/' + tableData.fileForm.fileFolderName + '/' + tableData.fileForm.fileName + '.vue')
	await mkdir(folderUrl)
	await mkdir(folderFileUrl)
	fs.writeFileSync(fileUrl, mergeHTML(vueObj))
	ctx.body = {
		status: 200,
		success: true,
		body: '成功',
	};

	// if(!tableData.type)timer = setTimeout(async () => {
	// 	await rmdir(resolves('../../../create_cmps/test_cmps'))
	// 	fs.writeFileSync(resolves('../../../create_cmps/test_cmps/test2.vue'), previewTemplateVue())
	// }, 3000);
});



module.exports = router.routes();






// promise 封装 fs.mkdir 和 fs.rmdir
const mkdir = (dir) => {
	return new Promise((resolve, reject) => {
		fs.mkdir(dir, (res) => {
			resolve(res)
		})
	})
}
const rmdir = (dir) => {
	return new Promise((resolve, reject) => {
		fs.rmdir(dir, (res) => {
			resolve(res)
		})
	})
}

