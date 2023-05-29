import router from '@/router/index'
import common from '@/utils/common'

export default {
	namespaced: true,

	state: {
		routes: []
	},

	actions: {
		addRoute({commit, state}, route) {
			commit('ADDROUTE', route)
		}
	},


	mutations: {
		ADDROUTE(state, route) {
			if (state.routes.findIndex(item => item.requestUrl == route.requestUrl) == -1) {
				router.addRoutes([{
					path: '/index',
					component: common.loadView('Manage'),
					meta: {
						title: '首页',
						requireAuth: true,
					},
					children: [{
						path: route.requestUrl,
						component: common.loadView(route.component),
						meta: {
							title: route.menuName
						}
					}]
				}])
				router.options.routes[2].children.push({
					path: route.requestUrl,
					component: common.loadView(route.component),
					meta: {
						title: route.menuName
					}
				})
				state.routes.push(route)
			}
		}
	},
}
