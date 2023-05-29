export default {
    created() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    },
    methods: {
        handleResize(event) {
            var fullWidth = document.documentElement.clientWidth;
            if (fullWidth > 768) {
                this.$store.state.isPhone = false;
                this.$store.state.navOpen = true;
            } else {
                this.$store.state.isPhone = true;
                this.$store.state.navOpen = false;
            }
    },
    },
}
