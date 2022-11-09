<template>
    <FoodCircleOverlay :show="this.establishmentStore.loading || this.authStore.loading" :loadingMsg="this.establishmentStore.loadingMsg"/>
    <div class="container">
        <div class="row">
            <EstablishmentSidebar></EstablishmentSidebar>
            <div class="pct15">
            </div>
            <div class="pct85">
                <Menubar class="fullwidth-sidebar">
                    <template #start>
                        <img alt="logo" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                            height="40" class="mr-2">
                    </template>
                    <template #end>
                        <InputText placeholder="Search" type="text" />
                    </template>
                </Menubar>
                <div id="dash-content" style="background-color:#17212f;">
                    <SalesContent/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useEstablishmentStore } from '../stores/establishmentStore'
import { useAuthStore } from '../stores/authStore'
import EstablishmentSidebar from '../components/EstablishmentSidebar.vue'
import SalesContent from '../components/SalesContent.vue'

export default {
    name: 'DashboardView',
    components: {
        EstablishmentSidebar,
        SalesContent
    },
    setup() {
        const authStore = useAuthStore()
        const establishmentStore = useEstablishmentStore()
        return {
            establishmentStore,
            authStore
        }
    },
    data() {
        return {
            bar: null,
        }
    },
    mounted() {
        
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style scoped>
#dash-content {
    height: 100vh;
}
</style>