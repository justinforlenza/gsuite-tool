import Vue from 'vue'
import Router from 'vue-router'

import LandingPage from '../components/LandingPage'
import BulkUser from '../components/BulkUser'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: LandingPage
        },
        {
            path: '/user_create',
            name: 'landing-page',
            component: BulkUser
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
