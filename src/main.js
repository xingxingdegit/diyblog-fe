import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/iview.js'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false

Vue.use(mavonEditor)

//window.onbeforeunload = function(event) {
//  return '您的数据保存了吗!'
//}

new Vue({
  render: h => h(App),
}).$mount('#app')
