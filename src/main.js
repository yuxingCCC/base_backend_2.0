import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
window.addEventListener('popstate', () => { router.isBack = true });
import './config/main/component.js' 			// 全局 组件 
import './config/main/prototype.js' 			// 全局 方法\函数\工具 
import './config/directives/index' 				// 安装自定义指令



new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
