
const envConfig = require('./src/config/envConfig');
let vueConfig = require('./src/config/vueConfig.js');
module.exports = {
	// 公共路径(必须有的)
	publicPath: envConfig.baseUrl,
	// 输出文件目录
	outputDir: "dist",
	// 静态资源存放的文件夹(相对于ouputDir)
	assetsDir: "static",

	productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建

	// 开启代理
	devServer: {
		// overlay: { // 让浏览器 overlay 同时显示警告和错误
		//   warnings: true,
		//   errors: true
		// },
		open: false, // 是否打开浏览器
		port: envConfig.port, // 代理端口
		https: false,
		hotOnly: true, // 热更新
		proxy: {
			// 接口代理
			[envConfig.api]: {
				target: envConfig.serviceUrl, // 目标代理接口地址
				secure: false,
				changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
				// ws: true, // 是否启用webso ckets 代理
				pathRewrite: {
					["^" + envConfig.api]: "/"
				}
			},
			// 文件代理
			[envConfig.files]: {
				target: envConfig.filesUrl,
				changeOrigin: true,
				secure: false
			},

		}
	},

	...vueConfig.vueConfig // 其他配置
};
console.log(process.env.DS_WEBSOCKET);