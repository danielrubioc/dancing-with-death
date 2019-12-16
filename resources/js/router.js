import VueRouter from 'vue-router'
 
/* appointments crud*/
import appointment from './components/appointments/IndexComponent.vue'
import appointmentUpdate from './components/appointments/UpdateComponent.vue'
import appointmentCreate from './components/appointments/CreateComponent.vue'
import Error from './components/404.vue';


export const router = new VueRouter({
    name: 'Router',
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {   path: '/appointments', 
            component: appointment, 
            name: 'appointment',
            props: (route) => ({ page: route.query.page }),
        },
        {   path: '/appointments/view/:id', 
            component: appointmentUpdate, 
            name: 'appointmentUpdate', 
        },
        {   path: '/appointments/create', 
            component: appointmentCreate, 
            name: 'appointmentCreate', 
        },
        {   path: '/', 
            component: appointmentCreate, 
            name: 'appointmentIndex', 
        },
        { path: "*", component: Error, name: '404' }
  ]
})

    
