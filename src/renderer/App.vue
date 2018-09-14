<template>
    <v-app id="inspire" dark>
        <v-content fill-height v-if="$store.state.User.authenticated">
            <v-navigation-drawer :mini-variant="true" v-model="drawer" stateless app>
                <v-toolbar flat class="transparent">
                    <v-list class="pa-0 pt-1">
                        <v-list-tile>
                            <v-list-tile-avatar>
                                <img v-bind:src="$store.state.User.picture">
                            </v-list-tile-avatar>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>
                <v-list class="pt-1" dense>
                    <v-divider></v-divider>
                    <v-list-tile to="/">
                        <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile to="/user_create">
                        <v-list-tile-action><v-icon>person_add</v-icon></v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile to="/settings">
                        <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-content class="pl-0">
                <v-container fluid fill-height><v-flex><router-view></router-view></v-flex></v-container>
            </v-content>
        </v-content>
        <v-content fill-height v-if="!$store.state.User.authenticated">
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-card-text>
                                    <h4 class="display-1 text-xs-center" >Welcome</h4>
                                    <p>Welcome, to the G-Suite Automation tool, the tool that makes your life, as a
                                        G-Suite admin, less of a pain</p>
                                    <p>Before we get started, please login with a G-Suite SuperAdmin account</p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click.stop="login()">Authorize&nbsp;&nbsp;<font-awesome-icon :icon="['fab', 'google']" /></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-snackbar v-model="$store.state.Page.error.state" bottom color="red red darken-1"><v-icon dark>error_outline</v-icon>&nbsp;&nbsp;Error: {{ $store.state.Page.error.message }}</v-snackbar>
    </v-app>
</template>

<script>
import store from './store'

export default {
    name: 'gsuite-automation',
    data: () => ({
        drawer: true,
        mini: true
    }),
    methods: {
        login(){
            this.$login().then(function () {
                gapi.client.request({
                    path: 'https://www.googleapis.com/admin/directory/v1/customers/my_customer'
                }).then(function (response) {
                    store.commit('SET_USER_DATA', gapi.auth2.getAuthInstance().currentUser.get().w3)
                    store.commit('SET_ORG_NAME', response.result.postalAddress.organizationName)
                    gapi.client.request({
                        path: 'https://www.googleapis.com/admin/directory/v1/customer/my_customer/domains'
                    }).then(response =>{
                        response.result.domains.forEach(domain =>{
                            store.commit('ADD_ORG_DOMAIN', domain.domainName)
                        })
                    })
                }).catch(function (error) {
                    if(error.status === 403){
                        store.commit('LOADING_END', {error: true, message:'This application only works with SuperAdmin user accounts'})
                    } else {
                        //
                    }
                })
            })
        },
        logout(){
            this.$getGapiClient().then(function () {
                gapi.auth2.getAuthInstance().signOut();
                gapi.auth2.getAuthInstance().disconnect();
                store.commit('RESET_USER_DATA')
            })
        }
    }
}
</script>

<style>
    /* CSS */
</style>
