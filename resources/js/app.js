require('./bootstrap');

window.Vue = require('vue');

import {router} from './router'
import VueRouter from 'vue-router'
import axios from 'axios';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import moment from 'moment-timezone'
import Vuex from 'vuex';
import store from './store';
moment.tz.setDefault('UTC')
Vue.prototype.moment = moment
Vue.component('pagination', require('laravel-vue-pagination'));
Vue.use(VueRouter)
Vue.use(Vuex);
Vue.use(VueSweetalert2);

//main
Vue.component('main-component', require('./components/MainComponent.vue').default);



// interceptor config
axios.interceptors.request.use(
    config => {
        store.dispatch('loading/initLoading'); //init loading
        return config
    },
    error => Promise.reject(error)
);
// interceptor response
axios.interceptors.response.use(
    (response) => {
        store.dispatch('loading/endLoading'); //termino loading en todas las solicitudes        
        if (response.status === 202) {
            Vue.swal({
                title: "Appointment dance",
                text: response.data.message,
                type: "success",
                confirmButtonColor: "#DD6B55",
            });
        }
        if (response.status === 204) {
            Vue.swal({
                title: "Appointment deleted",
                text: response.data.message,
                type: "success",
                confirmButtonColor: "#DD6B55",
            });
        }
        if (response.status === 201) {
            Vue.swal({
                title: "Appointment updated",
                text: response.data.message,
                type: "success",
                confirmButtonColor: "#DD6B55",
            });
        }
        return response;
    }, function (error) {
        // Do something with response error
        if (error.response.status === 422) {
            const errors = error.response.data.errors;
            let a = "";
            for (var prop in errors) {
                if ( errors.hasOwnProperty(prop) ) {
                    a = a+'-'+errors[prop]
                }
            }
  
            Vue.swal({
                title: "Error ",
                text: a,
                type: "warning",
                confirmButtonColor: "#DD6B55",
            });
        }
        return Promise.reject(error.response);
}); 



const app = new Vue({
    el: '#app',
    store,
    router
});