/**
 * 全局参数 存放处
 */

import Vue from 'vue';
import axios from '@/config/http'
import pubsub from 'pubsub-js'                      // js 消息
import envConfig from '@/config/envConfig'          // 环境参数配置
import moment from 'moment'                         // moment 时间操作工具
import * as filters from '@/config/filtersConfig'   // 过滤器
import request from '@/utils/request'               // 请求工具类
import common from '@/utils/common'                 // 常用工具 函数
import message from '@/utils/message'            // 消息提示
import qs from 'qs';
import routerUtil from '@/router/routerUtil'        // 动态路由

// 自动 安装过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
});

Vue.prototype.$envConfig = envConfig;
Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$request = request;
Vue.prototype.$common = common;
Vue.prototype.$pubsub = pubsub;
Vue.prototype.$message = message;
Vue.prototype.$qs = qs;

routerUtil.init();  // 动态路由初始化

