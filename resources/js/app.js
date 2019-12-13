require('./bootstrap');

window.Vue = require('vue');

import {router} from './router'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//main
Vue.component('main-component', require('./components/MainComponent.vue').default);

const app = new Vue({
    el: '#app',
    router
});