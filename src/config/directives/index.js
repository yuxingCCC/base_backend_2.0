import Vue from 'vue';
import role from './role';

let obj = {
  role,
}

Object.keys(obj).forEach(key => {
  Vue.directive(key, obj[key])
});