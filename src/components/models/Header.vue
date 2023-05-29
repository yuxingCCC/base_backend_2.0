<template>
	<el-header>
		<div class="flex-box header_top">
            <div style="display: flex; align-items: center;" :style="getWidth()">
                <div class="flexible_model">
                    <i class="el-icon-s-fold flexible" v-show="$store.state.navOpen" @click="$store.state.navOpen = !$store.state.navOpen"></i>
                    <i class="el-icon-s-unfold flexible" v-show="!$store.state.navOpen" @click="$store.state.navOpen = !$store.state.navOpen"></i>
                </div>

                <el-breadcrumb>
                    <el-breadcrumb-item v-for="(data, index) in breadcrumbs" :key="index" :to="data.path">{{data.name}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="header_right">
                <div style="cursor: pointer;" @click="openDrawer">
                    <i class="icon-tools"></i>
                </div>
                <div>
                    管理员
                </div>
            </div>
        </div>
        <div class="header_bottom" :style="getWidth()">
            <el-tabs v-model="tabsValue" :closable="tabs.length > 1" @tab-remove="removeTab" type="card" @tab-click="tabClick" v-if="tabs.length">
                <el-tab-pane :label="item.label" :name="item.path" v-for="item in tabs" :key="item.path">
                </el-tab-pane>
            </el-tabs>
            <el-dropdown trigger="click" @command="closeTab" v-if="tabs.length > 1">
                <div class="tabs_operation">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="other"><i class="el-icon-close"></i>关闭其他</el-dropdown-item>
                    <el-dropdown-item command="left"><i class="el-icon-back"></i>关闭左侧</el-dropdown-item>
                    <el-dropdown-item command="right"><i class="el-icon-right"></i>关闭右侧</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
	</el-header>
</template>

<script>
	export default {
		data() {
			return {
				collapse: false,
				breadcrumbs: [],
                tabs: [],
                tabsValue: '',
			};
		},

		watch: {
			collapse(value) {
				this.$pubsub.publish('collapse', value)
			}
		},

		mounted() {
			this.$pubsub.subscribe('breadcrumb', (msg, value) => {
				this.breadcrumbs = value
			})

            this.$pubsub.subscribe('addTabs', (msg, value) => {
                this.addTab(value)
            })
		},

		methods: {
			openDrawer(){
				this.$pubsub.publish('openDrawer')
			},

			getWidth() {
                let widthStr;
                if(this.$store.state.isPhone) {
                    widthStr = 'width:100%';
                } else {
                    widthStr = this.$store.state.navOpen?'width:calc(100vw - 200px);margin-left:200px;':'width:calc(100vw - 64px);margin-left:64px;';
				}
                return widthStr;
            },

            addTab(value) {
			    this.$store.dispatch('common/setPageInfo', value)
                let index = this.tabs.findIndex(item => {
                    return item.path == value.path
                });
                if (index != -1) {
                    this.tabsValue = this.tabs[index].path
                } else {
                    this.tabs.push(value)
                    this.tabsValue = value.path
                }
            },

            removeTab(targetName) {
                let tabs = this.tabs;
                let activeName = this.tabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.path === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.path;
                                this.$router.push(activeName)
                            }
                        }
                    });
                }

                this.tabsValue = activeName;
                this.tabs = tabs.filter(tab => tab.path !== targetName);
            },

            // 批量关闭 tab 页操作
            closeTab(command){
			    let index = this.tabs.findIndex(item => item.path == this.tabsValue)
			    switch (command){
			        case 'other':
			            this.tabs = this.tabs.filter(item => item.path == this.tabsValue)
			            break;
                    case 'left':
                        this.tabs.splice(0, index)
                        break;
                    case 'right':
                        this.tabs.splice(index + 1)
                        break;
                }
            },

            tabClick(tab) {
                this.$router.push(tab.name)
            }
		},

		beforeDestroy() {
			this.$pubsub.unsubscribe('breadcrumb', 'addTabs')
		}

	}
</script>

<style>
	.el-header {
		height: 105px !important;
		box-sizing: border-box;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08) !important;
		background-color: white;
        padding: 0 !important;
        z-index: 99;
	}

    .el-header .el-tabs{
        width: calc(100% - 90px);
    }

    .el-header .el-tabs__item{
        margin: 0 3px !important;
        height: 35px !important;
        line-height: 35px !important;
        border: 1px solid #E4E7ED !important;
    }

    .el-header .el-tabs--card > .el-tabs__header{
        border-bottom: 0px !important;
    }

    .el-header .el-tabs--card > .el-tabs__header .el-tabs__nav{
        border: 0px !important;
        border-radius: 0px !important;
    }

    .el-header .el-tabs__header.is-top{
        margin-bottom: 0 !important;
    }
    .el-header .el-tabs__header{
        min-height: 35px !important;
    }
    .el-header .el-tabs__nav-next, .el-tabs__nav-prev{
        line-height: 35px !important;
    }
</style>

<style scoped>
	.flexible {
		font-size: 28px;
		cursor: pointer;
		color: #444444;
		margin-right: 20px;
	}

	.header_right{
		display: flex;
		align-items: center;
		height: 100%;
		white-space: nowrap;
	}

	.header_right>div{
		display: flex;
		align-items: center;
		padding-left: 20px;
		height: 100%;
	}

	.header_right i{
		font-size: 26px;
	}

    .header_top{
        height: 50px;
        padding: 0 20px;
        border-bottom: 1px solid #F2F6FC;
    }

    .header_bottom{
        height: 50px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        user-select: none;
    }

    .tabs_operation{
        font-size: 14px;
        outline: none;
        cursor: pointer;
    }
</style>
