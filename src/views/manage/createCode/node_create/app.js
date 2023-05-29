
const koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const corsConfigs = require("./config/cors");
const bodyParser = require("koa-bodyparser");
// 实例化koa
const app = new koa();

// 处理跨域的配置
app.use(cors(corsConfigs));
// koa-bodyparser主要针对请求报文的处理
app.use(bodyParser());

// 配置路由及请求接口
const router = new Router();
// 路由安装
const router_api = require("./config/router");
router_api(router)

// 打印日志中间件
const Koa_Logger = require("koa-logger");
const logger = Koa_Logger();
app.use(logger);

// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = require("../../../../config/envConfig").nodePort;

app.listen(port, () => {
    console.log(`server started on ${port}`);
});