/**
 * 全局组件
 */

import Vue from 'vue';
import "@babel/polyfill"; // 配置ie兼容
import '@/assets/fonts/icon.css' // 自定义 svg转font字体样式
import '@/plugins/element/element.js'
Vue.config.productionTip = false;


import MainHead from "@/components/models/MainHead.vue";
import MainContent from "@/components/models/MainContent.vue";
import ScreenForm from '@/components/models/ScreenForm.vue'
import Timer from '@/components/utils/Timer.vue'

Vue.component('main-head', MainHead);
Vue.component('main-content', MainContent);
Vue.component('screen-form', ScreenForm);
Vue.component('timer', Timer);



// import { initThemeColor } from '@/utils/themeColorClient' // 动态切换主题色
// 主题换肤
// initThemeColor();