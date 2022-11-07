<template>
    <Sidebar class="pct15" v-model:visible="visibleLeft" :dismissable="false" :modal="false" :showCloseIcon="false">
        <template #header>
            <div class="p-d-flex p-flex-row p-ai-center p-mt-4">
                <h1 class="title"><img src="../assets/logo.svg" alt="logo" class="logo" />FoodCircle</h1>
            </div>
        </template>
        <div class="p-d-flex p-flex-column p-ai-center p-mt-4">
            <div class="p-d-flex p-flex-column p-ai-center p-mt-4">
                <div class="item" v-for="option in options">
                    <div class="option" @click="redirect(option.value)"><span>{{option.label}}</span></div>
                </div>
            </div>
        </div>
    </Sidebar>
</template>

<script>
export default {
    name: 'EstablishmentSidebar',
    data() {
        return {
            visibleLeft: true,
            options: [
                { label: 'Establishment', value: '/establishment' },
                { label: 'Dashboard', value: '/dashboard' },
                { label: 'Timeline', value: '/timeline' },
            ],
        }
    },
    methods: {
        redirect(path) {
            this.$router.push(path);
        }
    }
}
</script>

<style scoped>
.option{
    cursor: pointer;
}
</style>