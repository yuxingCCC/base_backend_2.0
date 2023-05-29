import Vue from 'vue'
import Element from 'element-ui'
import './element-variables.scss'

Vue.use(Element)

import message from './message'
Vue.prototype.$message = message