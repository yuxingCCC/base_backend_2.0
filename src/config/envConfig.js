const proxyConfig = {

	// 通用参数
	common: {
		/**基础路径 */
		baseUrl: "/admin/",
		/**文件代理前缀 */
		files: "/files",
		/**token 名称 */
		tokenName: "adminToken",
		/**代理url前缀 与后端前缀必须保持一致 */
		api: "/baseservice3",
		/**后台端口 */
		port: 7000,
		/**脚本端口 */
		nodePort: 1721,
	},

	//开发环境
	dev: {
		/**是否显示模板脚本悬浮窗 */
		isShowTemplateBtn: true,
		/**是否显示菜单管理操作按钮 */
		isShowMenuOpertionBtn: true,
		/**websocket */
		websocketUrl: "ws://192.168.0.249:8080/baseservice3/ws/",
		/**服务域名 代理地址*/
		serviceUrl: "http://192.168.0.249:8080/baseservice3/",
		/**文件域名 代理地址*/
		filesUrl: "http://192.168.0.249:8080/"
	},

	//线上环境
	prod: {
		/**是否显示模板脚本悬浮窗 */
		isShowTemplateBtn: false,
		/**是否显示菜单管理操作按钮 */
		isShowMenuOpertionBtn: false,
		/**websocket */
		websocketUrl: "ws://http://127.0.0.1:8080/ws/",
		/**服务域名 */
		serviceUrl: "",
		/**文件域名 */
		filesUrl: ""
	}
};

let envConfig = (process.env.NODE_ENV === 'development' ? proxyConfig.dev : proxyConfig.prod);

let result = Object.assign(envConfig, proxyConfig.common);

module.exports = result;
