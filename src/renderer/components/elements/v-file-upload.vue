<template>
    <v-layout row>
        <v-flex>
            <v-btn @click="open_upload()" class="mt-3">SELECT</v-btn>
        </v-flex>
        <v-flex xs12><v-text-field disabled v-model="file.name"></v-text-field></v-flex>
        <input type="file" accept="text/csv" hidden ref="file_input" v-on:change="handleFileUpload()">
    </v-layout>
</template>

<script>
export default {
    name: "v-file-upload",
    data: () => ({
        file: {
            name: null
        }
    }),
    methods: {
        open_upload(){
            this.$refs['file_input'].click()
        },
        handleFileUpload(){
            this.file = this.$refs['file_input'].files[0]
            this.$emit('input', this.$refs['file_input'].files[0])
            this.$emit('change', this.$refs['file_input'].files[0])
        }
    }
}
</script>

<style scoped>

</style>