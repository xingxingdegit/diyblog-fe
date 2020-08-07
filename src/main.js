import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/iview.js'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false

Vue.use(mavonEditor)

new Vue({
  render: h => h(App),
}).$mount('#app')
