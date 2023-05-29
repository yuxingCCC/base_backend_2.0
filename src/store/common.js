export default {
    namespaced: true,

    state: {
        pageInfo: sessionStorage.getItem('pageInfo') ? JSON.parse(sessionStorage.getItem('pageInfo')) : {}
    },

    actions: {
        setPageInfo({commit}, pageInfo){
            if (pageInfo){
                sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo));
                commit('SET_PAGE_INFO', pageInfo)
            }
        }
    },


    mutations: {
        SET_PAGE_INFO(state, pageInfo){
            state.pageInfo = pageInfo
        }
    },
}
