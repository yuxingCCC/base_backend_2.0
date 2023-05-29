<template>
    <div class="main_head">
        <div>
            <slot>{{$store.state.common.pageInfo.label}}</slot>
        </div>
        <div>
            <slot name="after"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "MainHead",

    data(){
        return {

        }
    },

    mounted() {

    },

    beforeDestroy() {

    }
}
</script>

<style scoped>
.main_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    margin-top: 15px;
    padding: 10px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
</style>
