import Vue from 'vue'
import Router from 'vue-router'
import envConfig from '@/config/envConfig';
import NProgress from 'nprogress'
// NProgress 进度条样式, 可自行找到该文件进行编辑样式
import 'nprogress/nprogress.css'

// 解决重定向到当前路由发生报错
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
};

Vue.use(Router);

// 管理员需要登录权限的路由在这里
let routers = [
	{
		path: '/index',
		component: () => import('@/views/manage/Index'),
		meta: {
			title: '首页'
		}
	},
];

// 不需要角色权限的路径
let publicUrl = [
	'/',
	'/err_404',
	'/login',
	'/manage',
	'/test',
	'/manage/welcome'
];

let router = new Router({
	mode: "history",
	base: envConfig.baseUrl,
	// 公共路径
	routes: [{
		path: '/',
		redirect: '/index'
	},
		{
			path: '/login',
			component: () => import('@/views/Login'),
			meta: {
				title: '登录',
			},
		},
		{
			path: '/index',
			component: () => import('@/views/Manage'),
			meta: {
				title: '首页',
				requireAuth: true
			},
			children: routers
		},
		{
			path: '/err_404',
			component: () => import('@/views/error/404'),
			meta: {
				title: '找不到页面',
			}
		},
		// {
		// 	// 通配符, 匹配所有路径, 没有匹配相应的路径时会进入到这里
		// 	path: '*',
		// 	component: ()=> import('@/views/error/404'),
		// }
	]
});

// 页面加载进度样式配置
NProgress.configure({
	easing: 'ease', // 动画方式
	speed: 500, // 递增进度条的速度
	showSpinner: false, // 是否显示加载ico
	trickleSpeed: 200, // 自动递增间隔
	minimum: 0.3 // 初始化时的最小百分比
});

router.beforeEach((to, form, next) => {
	// 每次切换页面时，调用进度条
	NProgress.start();

	let token = sessionStorage.getItem(envConfig.tokenName);
	let paths = JSON.parse(sessionStorage.getItem('menuList'));
	/*
        if(paths){
            var index = paths.findIndex(item => item.requestUrl == to.fullPath)
            if(index != -1){
                // 动态添加路由
                store.dispatch('routes/addRoute', paths[index])
            }
        } */

	// 路由变化修改title
	if (to.meta.title) {
		document.title = to.meta.title
	}

	// 退出登录
	if (to.fullPath === '/login' || to.fullPath === '/') {
		sessionStorage.removeItem('adminToken')
	}

	//登陆拦截
	if (to.matched.some(r => r.meta.requireAuth)) { // 判断该路由是否需要登录权限
		if (!token) { // 判断当前的token是否存在
			next({
				path: '/login',
				query: {
					redirect: to.fullPath
				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
			return;
		}
	}else{
		// 判断菜单是否属于公共路由
		if (publicUrl.indexOf(to.path) === -1) {
			next({ path: '/err_404' });
			return;
		}
	}

	next()
});

router.afterEach((to, form) => {
	// 在即将进入新的页面组件前，关闭掉进度条
	NProgress.done()
});

export default router;
