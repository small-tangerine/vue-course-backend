import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // 英文
// import 'default-passive-events'
import '@/styles/index.scss' // 公共样式
import permission from './directive/permission'
import Cookies from 'js-cookie'
import i18n from './lang' // internationalization
import App from './App'
import store from './store'
import router from './router'
import Pagination from '@/components/Pagination'
import '@/icons' // 图标
import '@/permission' // 权限控制
import checkPermission from "@/utils/permission";
import RightToolbar from '@/components/RightToolbar'
// 中文版 element-ui
//  如果想要设置 ElementUI 语言为英文，按如下方式声明
// Vue.use(ElementUI, { locale })
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.prototype.checkPermission = checkPermission
Vue.use(permission)
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
