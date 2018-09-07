<template>
    <div id="wrapper">
        <button @click="login()">Login</button>
        <button @click="logout()">Logout</button>
    </div>
</template>

<script>
import store from '../store'
let GoogleAuth

export default {
    name: 'landing-page',
    methods: {
        open(link) {
            this.$electron.shell.openExternal(link)
        },
        login(){
            this.$login().then(function () {
                store.commit('SET_USER_DATA', gapi.auth2.getAuthInstance().currentUser.get().w3)
                gapi.client.request({
                    path: 'https://www.googleapis.com/admin/directory/v1/customer/my_customer/domains'
                }).then(function (response) {
                    store.commit('SET_ORG_NAME', response.result.postalAddress.organizationName)
                }).catch(function (error) {
                    if(error.status === 403){
                        store.commit('LOADING_END', {error: true, message:'This application only works with SuperAdmin user accounts'})
                    } else {
                        store.commit('LOADING_END', {error: true, message:'Something appears to have failed, please try again'})
                    }
                })
            })
        },
        logout(){
            // this.$getGapiClient().then(function () {
            //     gapi.auth2.getAuthInstance().signOut();
            //     gapi.auth2.getAuthInstance().disconnect();
            // })
        }
    }
}
</script>

<style>

</style>
