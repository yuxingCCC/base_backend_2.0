<template>
    <div id="left">
        <div v-if="$store.state.isPhone && $store.state.navOpen" @click="$store.state.navOpen = !$store.state.navOpen" class="mask"></div>
        <div id="nav" :style="getWidth()">
			<el-menu :default-active="active" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect"
			:background-color="nBackground" :text-color="nColor" :active-text-color="nActiveColor" :collapse="!$store.state.navOpen" router
			:default-openeds="openeds">
				<el-menu-item index="-1" disabled>
					<img src="@/assets/svg/logo.svg" alt="" height="20px" style="margin-right: 10px;">
					<span slot="title">名称</span>
				</el-menu-item>
				<el-scrollbar style="height: 100%; width: 100%;">
					<div v-for="(item, index) in menuList" :key="index">
						<span v-if="!item.children || item.children.length >= 2 || item.children[0].children != undefined" style="box-sizing: border-box">
							<el-submenu :index="index.toString()" :class="!$store.state.navOpen ? 'isCollapse' : ''">
								<template slot="title">
									<i :class="item.menuIcon"></i>
									<span slot="title" v-if="$store.state.navOpen">{{ item.label }}</span>
								</template>
								<div v-for="(item2, index2) in item.children" :key="index2">
									<el-menu-item :index="item2.requestUrl" v-if="item2.children == undefined">
										<span>{{ item2.label }}</span>
									</el-menu-item>
									<el-submenu v-else :index="item2.requestUrl" class="two_submenu">
										<template slot="title">
											<span class="twoPad" slot="title">{{ item2.label }}</span>
										</template>
										<el-menu-item class="twoPad_" v-for="(item3, index) in item2.children" :key="index" :index="item3.requestUrl">
											{{ item3.label }}
										</el-menu-item>
									</el-submenu>
								</div>
							</el-submenu>
						</span>

						<el-menu-item :index="item.children[0].requestUrl" :key="index" v-else class="level_1_menu">
							<i :class="[item.menuIcon, 'leftNav_icon']"></i>
							<span slot="title">{{ item.children[0].label }}</span>
						</el-menu-item>
					</div>
				</el-scrollbar>
			</el-menu>
        </div>
    </div>
</template>

<script>

import {nBackground,nColor,nActiveColor} from '@/config/appConfig'

export default {
    data() {
        return {
            isCollapse: false,
            active: '',
            openeds: [],
            menuList: [],
            nBackground: nBackground,
            nColor: nColor,
            nActiveColor: nActiveColor
        };
    },

    watch: {
        router(value) {
            this.active = this.$route.path;
            this.setByRoute()
        }
    },

    computed: {
        router() {
            return this.$route.path
        }
    },

    created() {
        this.defaultActiveIndex = this.$route.fullPath;

		this.menuList = this.disposeMenuData()
    },

    mounted() {
        this.init()
        this.active = this.$route.path;
    },

    methods: {
        init(){
            // 更新菜单数据
            this.$pubsub.subscribe('refreshMenuData', (msg, value) => {
                this.menuList = this.disposeMenuData()
            });
            this.$pubsub.subscribe('collapse', (msg, value) => {
                this.isCollapse = value
            });
            setTimeout(() => {
                this.setByRoute()
            }, 200)
        },
        disposeMenuData(){
            let item = JSON.parse(sessionStorage.getItem('menuList'));
            // 获取所有根节点
            let parents = [];
            item.filter(item => {
                return item.parentId === -1
            }).forEach(item => {
                parents.push({
                    id: item.id,
                    label: item.menuName,
                    requestUrl: item.requestUrl,
                    menuIcon: item.menuIcon
                })
            });

            // 获取所有子节点
            let childrens = [];
            item.filter(item => {
                return item.parentId !== -1 && item.type === 1
            }).forEach(item => {
                childrens.push({
                    id: item.id,
                    label: item.menuName,
                    parentId: item.parentId,
                    requestUrl: item.requestUrl,
                    menuIcon: item.menuIcon,
                    component:item.component
                })
            })

            // 生成菜单树
            let menuList = this.$common.translator(parents, childrens, current => {
                // 定义树的数据结构
                return {
                    id: current.id,
                    label: current.label,
                    parentId: current.parentId,
                    requestUrl: current.requestUrl,
                    menuIcon: current.menuIcon,
                    component:current.component
                }
            });
            
            if(process.env.NODE_ENV !== 'development'){
                menuList = menuList.filter(item=>item.label!='开发管理')
            }
            
            return menuList
        },
        handleOpen(key, keyPath) {},

        handleClose(key, keyPath) {},

        handleSelect(index, path) {
            if(this.$store.state.isPhone) {
                this.$store.state.navOpen = false;
            }
            if (!this.menuList[Number(path[0])]) {
                return;
            }
            var children = this.menuList[Number(path[0])].children[
                this.menuList[Number(path[0])].children.findIndex(item => {
                    return item.requestUrl == path[1]
                })
                ]

            var menuItem = this.menuList[Number(path[0])]
            this.$pubsub.publish('breadcrumb', [{
                name: menuItem.label
            }, {
                name: children.label
            }])
            this.$pubsub.publish('addTabs', {
                parentLabel: menuItem.label,
                path: children.requestUrl,
                label: children.label,
                component:children.component

            })
        },

        setByRoute() {
            var i = -1
            var j = -1
            this.menuList.forEach((item, index) => {
                if (item.children) {
                    item.children.forEach((item2, index2) => {
                        if (item2.requestUrl == this.active) {
                            i = index
                            j = index2
                        }
                    })
                }
            })
            this.handleSelect(this.active, [i.toString(), this.active])
        },
        selectNav(index) {
            if(this.$store.state.isPhone) {
                this.$store.state.navOpen = false;
            }
        },
        getWidth() {
            var widthStr;
            if(this.$store.state.isPhone) {
                widthStr = this.$store.state.navOpen?'width: 240px;':'width:0px;';
            } else {
                widthStr = this.$store.state.navOpen?'width: 240px;':'width:64px;';
            }
            return widthStr;
        }
    }

}
</script>

<style>
.el-menu{
    border-right: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
    box-sizing: border-box;
}

.el-menu-vertical-demo.el-menu {
    height: 100vh;
    border-right: 0px !important;
}

/* .el-menu--inline .el-menu-item {
    background-color: #343840 !important;
}

.el-menu--inline .el-menu-item:hover {
    background-color: #00A2E9 !important;
} */

.el-menu-item.is-disabled {
    opacity: 1 !important;
    cursor: default;
    background: transparent !important;
}

.el-submenu__title {
    display: flex;
    align-items: center;
}

.el-submenu__title i {
    color: var(--nav-icon-color);
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
}

.el-menu .el-scrollbar__wrap {
    overflow-x: hidden;
}

.el-submenu__title {
    height: 48px !important;
    line-height: 48px !important;
}

.el-submenu .el-menu-item{
    height: 43px !important;
    line-height: 43px !important;
    padding-left: 48px !important;
    opacity: 0.9;
}
.el-menu-item{
    height: 48px !important;
    line-height: 48px !important;
}
.isCollapse .el-submenu__icon-arrow.el-icon-arrow-right{
    display: none;
}

.el-menu .el-scrollbar__view{
    padding-bottom: 55px;
}
.leftNav_icon{
    margin: 0 8px 0 4px !important;
    height: auto !important;
    width: auto !important;
}
.el-menu-item.is-active{
    background: var(--nav-active-color) !important;
}
</style>

<style lang="scss" scoped>
#left {
    .mask {
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }
    #nav {
        position: fixed;
        height: 100vh;
        max-width: 200px;
        width: 200px;
        left: 0;
        top: 0;
        background: #545C64;
        overflow: hidden;
        transition: width 0.3s;
        z-index: 1001;
    }
    .nav_icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
}
</style>
