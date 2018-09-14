<template>
    <v-container fluid grid-list-md class="pa-2">
        <v-layout row wrap>
            <v-flex>
                <v-card dark>
                    <v-card-text>
                        <h4 class="text-xs-center display-1">{{$store.state.User.organization.name}}</h4>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4>
                <v-card dark>
                    <v-card-text>
                        <h2 class="text-xs-center display-3">{{userStats.total}}</h2>
                        <h5 class="text-xs-center headline">Users</h5>
                    </v-card-text>
                </v-card>
                <v-card class="mt-2 pt-1" style="min-height: 230px">
                    <doughnut :chart-data="datacollection" :options="options"></doughnut>
                </v-card>
            </v-flex>
            <v-flex xs3>

            </v-flex>
            <v-flex xs5>
                <v-card dark>
                    <v-card-text>
                        <h2 class="text-xs-center display-3">{{groups.length}}</h2>
                        <h5 class="text-xs-center headline">Groups</h5>
                    </v-card-text>
                </v-card>
                <v-card class="mt-2" style="min-height: 230px; max-height: 230px; overflow: scroll">
                    <v-list dark class="pt-0">
                        <template v-for="(group, index) in groups">
                            <v-list-tile :key="group.email">
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="group.name" style="margin-bottom: -5px"></v-list-tile-title>
                                    <v-list-tile-sub-title>{{ group.email }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider :key="index"></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Doughnut from './elements/doughnut.js'
export default {
    name: 'landing-page',
    components:{
        Doughnut
    },
    data: () => ({
        userStats: {
            total: 0,
            never: 0,
            inactive: 0
        },
        groups: [],
        datacollection: null,
        options:{
            rotation: -.5 * Math.PI,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'rgb(255, 255, 255)'
                }
            }
        }
    }),
    methods: {
        open(link) {
            this.$electron.shell.openExternal(link)
        },
        countUsers(users=[], nexttoken=null){
            let vm = this
            let path = 'https://www.googleapis.com/admin/directory/v1/users?customer=my_customer'
            if (nexttoken){
                path += '&pageToken='+nexttoken
            }
            this.$getGapiClient().then(function () {
                gapi.client.request({
                    path: path
                }).then(response => {
                    let _users = users.concat(response.result.users)
                    if (response.result.nextPageToken) {
                        vm.countUsers(_users, response.result.nextPageToken)
                    } else {
                        _users.forEach(user => {
                            vm.$store.commit('ADD_ORG_USER', user)
                        })
                        vm.userStats.total = _users.length
                        vm.userStats.never = _users.filter(function (element) {
                            return element.lastLoginTime === '1970-01-01T00:00:00.000Z'
                        }).length
                        vm.userStats.inactive = _users.filter(function (element) {
                            const lastLogin = new Date(element.lastLoginTime)
                            let date = new Date
                            date.setMonth(date.getMonth()-9)
                            return date > lastLogin && element.lastLoginTime !== '1970-01-01T00:00:00.000Z'
                        }).length
                        vm.datacollection = {
                            labels: ['Active', 'Inactive', 'Never Signed In'],
                            datasets: [{
                                data: [vm.userStats.total - (vm.userStats.inactive+vm.userStats.never),vm.userStats.inactive, vm.userStats.never],
                                backgroundColor: ['#00C853', '#FFAB00', '#DD2C00'],
                                borderColor: 'rgba(0, 0, 0, 0)'
                            }]
                        }
                    }
                })
            })
        },
        getGroups(nexttoken=null){
            let vm = this
            let path = 'https://www.googleapis.com/admin/directory/v1/groups?customer=my_customer'
            if (nexttoken){
                path += '&pageToken='+nexttoken
            }
            this.$getGapiClient().then(function () {
                gapi.client.request({
                    path: path
                }).then(response => {
                    vm.groups = vm.groups.concat(response.result.groups)
                    if (response.result.nextPageToken) {
                        vm.getGroups(response.result.nextPageToken)
                    }
                })
            })
        }
    },
    mounted() {
        this.$store.commit('RESET_ORG_USERS')
        this.countUsers()
        this.getGroups()
    }
}
</script>
