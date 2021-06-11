// HelperBit Iframe Widget
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'

import util from 'util'

import './mdl-colors.scss'
import 'material-design-lite/material.min.js'

import 'cryptocoins-icons/webfont/cryptocoins.css'
import 'font-awesome/css/font-awesome.css'
import 'dialog-polyfill/dialog-polyfill.css'
import dialogPolyfill from 'dialog-polyfill/dialog-polyfill'

// load components
import Widget from './components/widget.vue'
import Mistralpay from './components/mistralpay.vue'
import Done from './components/done.vue'
import Amount from './components/amount.vue'
import Altcoin from './components/altcoin.vue'
import Address from './components/address.vue'
import Error from './components/error.vue'
import Altcoinwait from './components/altcoinwait.vue'
import Helperbit from './components/helperbit.vue'
import Chooseuser from './components/chooseuser.vue'

import envConfig from '../../config.js'
// import "old" js is done using exports-loader
//import envConfig from 'exports-loader?envConfig!../../config.js'

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(VueClipboard)

const messages = {
  it: require('./translation/it.json'),
  en: require('./translation/en.json')
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: util.getLang(),
  messages // set locale messages
})

// router path configuration
const router = new VueRouter({
  hashbang: false,
  history: true,
  suppressTransitionError: false,
  routes: [
    { path: '/mistralpay', component: Mistralpay },
    { path: '/mistralpay/:user', component: Mistralpay },
    { path: '/altcoin', component: Altcoin },
    { path: '/altcoinwait', component: Altcoinwait },
    { path: '/done', component: Done },
    { path: '/amount', component: Amount },
    { path: '/address', component: Address },
    { path: '/helperbit', component: Helperbit },
    { path: '/chooseuser', component: Chooseuser},
    { path: '/error/:error/:icon?', component: Error }
  ]
})

// default route
router.replace('/loading')

// share environment configuration
util.set('envConfig', envConfig)

window.hb_widget = new Vue({
  i18n,
  router,
  render: function (createElement) {
    return createElement(Widget)
  }
}).$mount('#hb_widget')
