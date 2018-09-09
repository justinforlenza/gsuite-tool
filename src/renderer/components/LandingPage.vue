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
                <v-card class="mt-2 pt-1">
                    <doughnut :chart-data="datacollection" :options="options"></doughnut>
                </v-card>
            </v-flex>
            <v-flex xs4>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Doughnut from './charts/doughnut.js'
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
        count(users=[], nexttoken=null){
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
                        vm.count(_users, response.result.nextPageToken)
                    } else {
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
                                backgroundColor: [
                                    '#00C853',
                                    '#FFAB00',
                                    '#DD2C00'
                                ],
                                borderColor: 'rgba(0, 0, 0, 0)'
                            }]
                        }
                    }
                })
            })
        }
    },
    mounted() {
        this.count()
    }
}
</script>
