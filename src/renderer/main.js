import Vue from 'vue'
import axios from 'axios'
import VueGAPI from 'vue-gapi'

import App from './App'
import router from './router'
import store from './store'


const apiConfig = {
    apiKey: 'AIzaSyB7t3jfa9cMsaBMWwDey3P8aHdAZledE64',
    clientId: '1035142319068-gj9j2728u4cmdn34ihmag1jffd5p27nd.apps.googleusercontent.com',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest'],
    scope: 'https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.domain.readonly https://www.googleapis.com/auth/admin.directory.customer.readonly'
}

Vue.use(VueGAPI, apiConfig)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')
