<template>
    <div class="main_content">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "MainContent"
}
</script>

<style scoped>
.main_content {
    background: white;
    margin-top: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    height: 100%;
}
</style>
