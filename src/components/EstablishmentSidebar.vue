<template>
    <Sidebar class="pct15" v-model:visible="visibleLeft" :dismissable="false" :modal="false" :showCloseIcon="false" style="padding:0px;">
        <template #header class="p-0">
            <h2 style="text-shadow: rgb(0 255 81 / 80%) 0px 0px 8px;color: black;justify-content: center;text-align: center;"> Food Circle</h2>
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

<style>
.option{
    cursor: pointer;
    color: whitesmoke;
}

.p-sidebar-header-content{
    padding: 0px !important;
}

.p-sidebar .p-sidebar-header{
    padding: 0px !important;
    background-color: brown !important;
}
</style>