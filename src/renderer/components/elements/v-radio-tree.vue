<template>
    <div>
        <v-radio :label="tree.name" :value="tree"></v-radio>
        <ul v-show="open" v-if="isFolder">
            <v-radio-tree
                    v-for="(subTree, index) in tree.children"
                    :key="index"
                    :tree="subTree">
            </v-radio-tree>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'v-radio-tree',
    props: {
        tree: Object
    },
    data() {
        return {
            open: true
        }
    },
    computed: {
        isFolder() {
            return this.tree.children.length > 0
        }
    },
    methods: {
        toggle() {
            if (this.isFolder) {
                this.open = !this.open
                this.$emit('input', 'not hello world')
            }
        },
        select(item) {
            console.log(item)
            this.$emit('input', 'hello world')
        },
    },
}
</script>

<style scoped>
.tree-toggle{
    cursor: pointer;
}
ul {
    padding-left: 1.5em;
    line-height: 1.5em;
    list-style-type: none;
}
</style>