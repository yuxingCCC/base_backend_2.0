const webpack = require('webpack');
// const ThemeColorReplacer = require('webpack-theme-color-replacer')
// const forElementUI = require('webpack-theme-color-replacer/forElementUI')
// 注意自己项目里的引入路径
const JoinFileContentPlugin = require('join-file-content-plugin');
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const cdn = {
	css: [],
	js: [
		'https://unpkg.com/browse/vue@2.6.11/dist/vue.runtime.min.js',
		'https://unpkg.com/vue-router@3.2.0/dist/vue-router.min.js',
		'https://unpkg.com/vuex@3.4.0/dist/vuex.min.js',
		'https://unpkg.com/browse/axios@0.19.2/dist/axios.min.js',
	]
};
let vueConfig = {
  // 添加别名
	chainWebpack: config => {
		const path = require("path");
		const resolve = dir => path.join(__dirname, dir);
		if (IS_PROD) {
			// 删除预加载
			config.plugins.delete('prefetch')
			config.plugins.delete('preload');
			// 压缩代码
			config.optimization.minimize(true);
			// 生产环境注入cdn
			// config.plugin('html').tap(args => {
			// 	args[0].cdn = cdn;
			// 	return args;
			// });
		}
		config.resolve.alias
			.set("@", resolve("src"))
			.set("@assets", resolve("src/assets"))
			.set("@components", resolve("src/components"))
			.set("@img", resolve("src/assets/img"))
			.set("@css", resolve("src/assets/css"))
			.set("@js", resolve("src/assets/js"))
	},


	/*	// sass 全局样式变量
		css: {
			extract: ["production", "prod"].includes(process.env.NODE_ENV),
			sourceMap: false,
			loaderOptions: {
				// scss: {
					// 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
					// 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
					// prependData: `
					// 	@import "@/assets/scss/element-variables.scss";
					// 	$src: "${process.env.VUE_APP_OSS_SRC}";
					// 	`
				// }
			},
			// 启用 CSS modules for all css / pre-processor files.
			// requireModuleExtension: false,
		},*/

	// 打包分析
	/* 	chainWebpack: config => {
			const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
			const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
			if (IS_PROD) {
				config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
					analyzerMode: "static"
				}]);
			}
		}, */

	// 开启 Gzip 压缩
	configureWebpack: config => {
		const CompressionWebpackPlugin = require("compression-webpack-plugin");
		const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

		const plugins = [];
		if (IS_PROD) {
			// 用cdn方式引入依赖
			// config.externals = {
			// 	'vue': 'Vue',
			// 	'vuex': 'Vuex',
			// 	'vue-router': 'VueRouter',
			// 	'axios': 'axios',
			// }
			plugins.push(
				new CompressionWebpackPlugin({
					filename: "[path].gz[query]",
					algorithm: "gzip",
					test: productionGzipExtensions,
					threshold: 10240,
					minRatio: 0.8
				})
			);
		}
		config.plugins = [...config.plugins, ...plugins];
	},

	configureWebpack: {
		plugins: [
			// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			// 生成仅包含颜色的替换样式（主题色等）
			// new ThemeColorReplacer({
			// 	fileName: 'style/theme-colors.[contenthash:8].css',
			// 	matchColors: [
			// 		...forElementUI.getElementUISeries(appConfig.themeColor), // element-ui主色系列
			// 		'#0cdd3a', // 自定义颜色
			// 		'#c655dd'
			// 	],
			// 	changeSelector: forElementUI.changeSelector,
			// 	isJsUgly: process.env.NODE_ENV === 'production' ? true : undefined
			// })
		]
	}
}

module.exports = vueConfig