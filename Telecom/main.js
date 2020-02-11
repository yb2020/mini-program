import Vue from 'vue'
import App from './App'

import store from './store'  
Vue.prototype.$store = store

import basics from './pages/basics/home.vue'
Vue.component('basics',basics)

import components from './pages/component/home.vue'
Vue.component('components',components)

import plugin from './pages/plugin/home.vue'
Vue.component('plugin',plugin)

import index from './pages/telecom/home.vue'
Vue.component('index',index)

import personal from './pages/telecom/personal.vue'
Vue.component('personal',personal)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})

app.$mount()

 



