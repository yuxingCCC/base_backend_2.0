<template>
    <div :style="getWidth()">
        <el-main>
            <div id="main">
                <transition :name="transitionName">
                    <router-view></router-view>
                </transition>
            </div>
        </el-main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            transitionName: 'slide-right'
        };
    },

    watch: {
        '$route'(to, form) {
            let isBack = this.$router.isBack
            if (isBack) {
                this.transitionName = 'slide-left'
            } else {
                this.transitionName = 'slide-right'
            }
            this.$router.isBack = false
        }
    },

    mounted() {
        this.$axios.get('https://international.v1.hitokoto.cn/?c=d&c=i&c=j&c=k').then( (res)=>{
            this.hitokoto = res.data;
        }).catch((error) => {
            console.log(error);
        })
    },

    methods: {
        getWidth() {
            let widthStr;
            if(this.$store.state.isPhone) {
                widthStr = 'width:100%';
            } else {
                widthStr = this.$store.state.navOpen?'width:calc(100vw - 200px);margin-left:200px;':'width:calc(100vw - 64px);margin-left:64px;';
            }
            return widthStr;
        },

    },

}
</script>

<style>
.el-main {
    box-sizing: border-box;
    padding: 0 15px !important;
    overflow-y: auto !important;
    overflow-x: hidden;
    height: calc(100vh - 110px);
}

.el-main .el-tabs{
    background-color: white;
}
.el-main .el-tabs__item {
    height: 32px !important;
    line-height: 32px !important;
}

.el-main .el-tabs__header.is-top {
    line-height: 32px !important;
}

.el-main .el-tabs__header.is-top {
    min-height: 32px !important;
}

.el-main .el-tabs__content {}

.el-tabs__header.is-top {
    min-height: 40px;
}

.el-tabs__nav {
    position: relative;
    left: 5px;
}

.slide-left-enter,
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(3%);
    transition: .5s;
}

.slide-left-leave-to,
.slide-right-enter {
    opacity: 0;
    transform: translateX(-4%);
    transition: .5s ease-out 5s;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: .5s;
    position: absolute;
    z-index: -1;
    width: 100%;
}

.el-tabs__header.is-top{
    margin-bottom: 12px;
}
</style>

<style scoped>
#main {
    box-sizing: border-box;
    /*overflow: hidden;*/
    position: relative;
    /*padding: 0 15px !important;*/
    /*background: white;*/
    display: block;
}

.el-main::-webkit-scrollbar {
    width: 8px;
}

.el-main::-webkit-scrollbar-track {
    background-color: transparent;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}

.el-main::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, .08);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}

.el-main:hover::-webkit-scrollbar-thumb {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.18);
    border-radius: 10px;
    -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1);
}

#main>div {
    width: 100%;
    min-width: calc(100vw - 270px);
    /*padding: 15px 20px;*/
    box-sizing: border-box;
}
</style>
