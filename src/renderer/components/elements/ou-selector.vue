<template>
    <div>
        <v-btn @click="dialog = true" class="ml-0" depressed>Select OU</v-btn>
        <label>Currently Selected: {{selected.name}}</label>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="title text-xs-center">Select an Organization Unit for your new users</v-card-title>
                <v-card-text>
                    <v-radio-group v-model="selected" @change="emit()">
                        <v-radio-tree :tree="orgUnits"></v-radio-tree>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import VRadioTree from "./v-radio-tree";
export default {
    name: 'ou-selector',
    components: {VRadioTree},
    methods:{
        getOrgUnits(path='/', parent=this.orgUnits){
            let vm = this
            this.$getGapiClient().then(function () {
                gapi.client.request({
                    path: 'https://www.googleapis.com/admin/directory/v1/customer/my_customer/orgunits?orgUnitPath='+encodeURIComponent(path)+'&type=children'
                }).then(response => {
                    if(response.result.organizationUnits) {
                        response.result.organizationUnits.forEach(item => {
                            parent.children.push({name: item.name, path: item.orgUnitPath, children: []})
                            vm.getOrgUnits(item.orgUnitPath, parent.children[parent.children.length-1])
                        })
                    }
                })
            })
        },
        emit(){
            this.$emit('input', this.selected.path)
            this.dialog = false
        }
    },
    mounted(){
        this.getOrgUnits()
    },
    data(){
        return{
            orgUnits: {name: 'Root',path:'/',children:[]},
            dialog: false,
            selected: {path:'/', name: 'Root', }
        }
    }
}
</script>