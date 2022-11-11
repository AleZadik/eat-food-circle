<template>
    <FoodCircleOverlay :show="this.establishmentStore.loading || this.authStore.loading" :loadingMsg="this.establishmentStore.loadingMsg"/>
    <div class="container">
        <div class="row">
            <EstablishmentSidebar></EstablishmentSidebar>
            <div class="pct15">
            </div>
            <div class="pct85">
                <Menubar class="fullwidth-sidebar">
                    <template #end>
                        <Button icon="pi pi-home" style="width:auto;padding:12px;" onclick='window.location.href = "/"'>   
                            Logout
                        </Button>
                    </template>
                </Menubar>
                <div id="content" style="background-color:#17212f;">
                    <TimelineContent></TimelineContent>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useEstablishmentStore } from '../stores/establishmentStore'
import { useAuthStore } from '../stores/authStore'
import EstablishmentSidebar from '../components/EstablishmentSidebar.vue'
import TimelineContent from '../components/TimelineContent.vue'

export default {
    name: 'TimelineView',
    components: {
        EstablishmentSidebar,
        TimelineContent
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
#content{
    padding: 40px 40px 40px 40px;
    height: 160%;
}
</style>