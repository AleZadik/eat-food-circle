<template>
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
    height: 150%;
}
</style>