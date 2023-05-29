<template>
    <div class="form_block">
        <div class="title" :style="color?'border-color:' + color:''">{{title}}</div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        title: {
            type: String,
            required: true
        },
        color: {
            type: String
        }
    },
    data() {
        return {
            
        }
    },
    created(){},
    mounted(){},
    watch: {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.form_block {
    .title {
        border-left: 7px solid var(--primary-color);
        padding-left: 10px;
        font-size: 18px;
        margin-bottom: 20px;
        margin-top: 20px;
    }
}
</style>