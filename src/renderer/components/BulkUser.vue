<template>
    <div>
        <v-card dark class="mb-2">
            <v-card-text>
                <h5 class="headline">Bulk User Creation</h5>
                <p>Use this to bulk create users for G-Suite.
                    This tool can generate usernames based on data provided.</p>
            </v-card-text>
        </v-card>
        <v-stepper v-model="currentStep" style="background-color: #424242!important;">
            <v-stepper-header class="">
                <v-stepper-step step="1" :complete="currentStep > 1" complete-icon="check"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="currentStep > 2" complete-icon="check"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" :complete="currentStep > 3" complete-icon="check"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4" :complete="currentStep > 4" complete-icon="check"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <h6 class="title">Upload User Spreadsheet</h6>
                    <p>Upload a .csv file containing information on the users to create <br>
                        <span class="caption">Required: First Name, Last Name <br> Optional: Email Address, Password, OU Path</span></p>
                    <v-layout row>
                        <v-flex xs6>
                            <v-file-upload v-model="file" v-on:change="fileUpload()"></v-file-upload>
                        </v-flex>
                    </v-layout>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <h6 class="title">Match Headers to Fields</h6>
                    <v-layout row wrap>
                        <v-flex xs3>
                            <v-select label="First Name" :items="userData.headers" v-model="userData.map.name.givenName"></v-select>
                        </v-flex>
                        <v-flex xs3 class="ml-3">
                            <v-select label="Last Name" :items="userData.headers" v-model="userData.map.name.familyName"></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs3>
                            <v-select label="Email" :items="['Generate Email'].concat(userData.headers)" v-model="userData.map.primaryEmail"></v-select>
                        </v-flex>
                        <v-flex xs3 offset-xs1 v-if="userData.map.primaryEmail === 'Generate Email'">
                            <v-select label="Email Template" :items="['jane.doe', 'jdoe']" v-model="userData.map.email_generation.template"></v-select>
                        </v-flex>
                        <v-flex xs4 class="ml-2" v-if="userData.map.primaryEmail === 'Generate Email'">
                            <v-select label="Domain" :items="$store.state.User.organization.domains" prepend-icon="$vuetify.icons.at" v-model="userData.map.email_generation.domain"></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs3>
                            <v-select label="Password" :items="['Random', 'One Password'].concat(userData.headers)" v-model="userData.map.password"></v-select>
                        </v-flex>
                        <v-flex xs3 v-if="userData.map.password === 'One Password'" offset-xs1>
                            <v-text-field v-model="userData.map.first_password" label="Password"></v-text-field>
                        </v-flex>
                        <v-checkbox class="ml-3" label="Change password at logon" v-model="userData.map.changePasswordAtNextLogin"></v-checkbox>
                    </v-layout>
                    <ou-selector v-model="userData.map.orgUnitPath"></ou-selector>
                    <v-layout row justify-end>
                        <v-flex xs3>
                            <v-btn :disabled="step3Disabled" @click="generateUsers()" color="primary" :loading="loading">Generate Data</v-btn>
                        </v-flex>
                    </v-layout>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-layout row justify-end>
                        <v-flex xs3>
                            <v-btn @click="createUsers()" color="primary" :loading="loading">Create Users</v-btn>
                        </v-flex>
                    </v-layout>
                    <h1>Users Generated:</h1>
                    <v-data-table :items="userData.generated" hide-actions class="elevation-1" :dark="false" :light="true">
                        <template slot="headers" slot-scope="props">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                            </tr>
                        </template>
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.name.givenName }} {{props.item.name.familyName}}</td>
                            <td class="text-xs-right">{{ props.item.primaryEmail }}</td>
                            <td class="text-xs-right">{{ props.item.password }}</td>
                        </template>
                    </v-data-table>
                </v-stepper-content>

                <v-stepper-content step="4">
                    <h3>You've successfully created {{userData.success}} user accounts</h3>
                    <p>The following users failed:</p>
                    <v-data-table :items="userData.failed" class="elevation-1" :dark="false" :light="true"
                                  rows-per-page-text="" :rowsPerPageItems="[2]">
                        <template slot="headers" slot-scope="props">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Reason</th>
                            </tr>
                        </template>
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.user.name.givenName }} {{props.item.user.name.familyName}}</td>
                            <td class="text-xs-right">{{ props.item.user.primaryEmail }}</td>
                            <td class="text-xs-right">{{ props.item.reason }}</td>
                        </template>
                    </v-data-table>
                    <v-layout row justify-end>
                        <v-flex xs4>
                            <v-btn color="primary" @click="currentStep = 1">Create More Users</v-btn>
                        </v-flex>
                    </v-layout>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
}

Array.prototype.asyncForEach = async function (callback) {
    for (let index = 0; index < this.length; index++) {
        await callback(this[index], index, this)
    }
}

import VFileUpload from './elements/v-file-upload'
import Papa from 'papaparse'
import OuSelector from './elements/ou-selector'
export default {
    name: 'bulk-user',
    components: {OuSelector, VFileUpload},
    data: () => ({
        currentStep: 1,
        file: null,
        userData: {
            users: [],
            headers: [],
            map:{
                name: {
                    familyName: String,
                    givenName: String
                },
                password: String,
                first_password: null,
                changePasswordAtNextLogin: true,
                primaryEmail: String,
                orgUnitPath: '/',
                email_generation: {
                    domain: null,
                    template: null
                }
            },
            generated: [],
            success: 0,
            failed: []
        },
        dialog: false,
        loading: false
    }),
    methods: {
        fileUpload(){
            let vm = this
            this.userData = {
                users: [],
                    headers: [],
                    map:{
                    name: {
                        familyName: String,
                            givenName: String
                    },
                    password: String,
                        first_password: null,
                        changePasswordAtNextLogin: true,
                        primaryEmail: String,
                        orgUnitPath: '/',
                        email_generation: {
                        domain: null,
                            template: null
                    }
                },
                generated: [],
                    success: 0,
                    failed: []
            }
            Papa.parse(this.file, {
                header:true,
                complete: function (results) {
                    vm.currentStep = 2
                    vm.userData.users = results.data
                    vm.userData.headers = results.meta.fields
                    vm.file = null
                }
            })
        },
        checkGSuiteEmail(email){
            let filtered = this.$store.state.User.organization.users.filter(user => {
                return user.primaryEmail === email
            })
            return filtered.length > 0
        },
        emailDupeCheck(list, email, domain, number=2) {
            if(list.includes(email) || this.checkGSuiteEmail(email+'@'+domain)){
                let _email
                if (number !== 2 ){
                    _email = email.slice(0, -1*((number-1).toString().length)) + number.toString()
                } else {
                    _email = email + number.toString()
                }
                return this.emailDupeCheck(list, _email, domain, number+1)
            } else {
                return email
            }
        },
        generateUsers(){
            this.loading = true
            let vm = this
            let emails = []
            this.userData.users.forEach(element => {
                let email
                let password
                if (element[vm.userData.map.name.givenName] && element[vm.userData.map.name.familyName]){
                    if (vm.userData.map.primaryEmail === 'Generate Email'){
                        if (vm.userData.map.email_generation.template === 'jane.doe'){
                            email = element[vm.userData.map.name.givenName].toLowerCase().trim() + '.' + element[vm.userData.map.name.familyName].toLowerCase().trim()
                            email = email.replace(' ', '-')
                        } else if (vm.userData.map.email_generation.template === 'jdoe') {
                            email = element[vm.userData.map.name.givenName].toLowerCase().trim().charAt(0) + element[vm.userData.map.name.familyName].toLowerCase().trim()
                            email = email.replace(' ', '-')
                        }
                        email = vm.emailDupeCheck(emails, email, vm.userData.map.email_generation.domain)
                        emails.push(email)
                        email += '@' + vm.userData.map.email_generation.domain
                    } else {
                        email = element[vm.userData.map.primaryEmail]
                    }
                    if (vm.userData.map.password === 'One Password'){
                        password = vm.userData.map.first_password
                    } else {
                        password = element[vm.userData.map.password]
                    }
                    vm.userData.generated.push({
                        name: {
                            familyName: element[vm.userData.map.name.familyName].toProperCase().trim(),
                            givenName: element[vm.userData.map.name.givenName].toProperCase().trim()
                        },
                        password: password,
                        changePasswordAtNextLogin: vm.userData.map.changePasswordAtNextLogin,
                        primaryEmail: email,
                        orgUnitPath: vm.userData.map.orgUnitPath,
                    })
                }

            })
            this.currentStep = 3
            this.loading = false
        },
        createUsers(){
            this.loading = true
            let vm = this
            this.$getGapiClient().then(gapi => {
                vm.userData.generated.asyncForEach( async (user) => {
                    await gapi.client.request({
                        path: 'https://www.googleapis.com/admin/directory/v1/users',
                        method: 'POST',
                        body: user
                    }).then(() => {
                        vm.userData.success += 1
                    }).catch(error => {
                        vm.userData.failed.push({
                            user: user,
                            reason: error.result.error.message
                        })
                    })
                }).then(() => {
                    vm.loading = false
                    vm.currentStep = 4
                })
            })
        }
    },
    computed:{
        step3Disabled(){
            let other = false
            if (this.userData.map.primaryEmail === 'Generate Email'){
                other = this.userData.map.email_generation.domain === null
                    || this.userData.map.email_generation.template === null
                    || other
            }
            if (this.userData.map.password === 'One Password'){
                other = this.userData.map.first_password === null
                    || other
            }
            return this.userData.map.primaryEmail===String
                || this.userData.map.name.familyName===String
                || this.userData.map.name===String
                || this.userData.map.password===String
                || other
        }
    }
}
</script>