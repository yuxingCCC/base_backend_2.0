<template>
    <div class="timer">
        <template v-if="date"><span v-for="(item,index) in formatArray" :key="index">{{$moment(date).format(item)}}</span></template>
        <template v-else>--</template>
        
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        date: {
            type: Number
        },
        format: {
            type: String,
            default: 'Y-MM-DD HH:mm:ss'
        }
    },
    data() {
        return {
            formatArray: []
        }
    },
    created(){
        if(this.date) {
            this.formatArray = this.format.split(' ');
            if(this.$store.state.isPhone && this.formatArray[0].indexOf('YY') == -1) {
                this.formatArray[0] = 'Y' + this.formatArray[0];
            }
        }
    },
    mounted(){},
    watch: {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.timer{
    span {
        white-space: nowrap;
        &:nth-child(2) {
            margin-left: 5px;
        }
    }
    @media screen and (max-width: 768px) {
        span {
            white-space: nowrap;
            &:nth-child(2) {
                margin-left: 0;
            }
        }
    }
}
</style>