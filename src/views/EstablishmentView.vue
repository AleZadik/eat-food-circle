<template>
    <FoodCircleOverlay :show="this.establishmentStore.loading || this.authStore.loading" :loadingMsg="this.establishmentStore.loadingMsg"/>
    <div class="container">
        <div class="row">
            <EstablishmentSidebar></EstablishmentSidebar>
            <div class="pct15">
            </div>
            <div class="pct85">
                <Menubar :model="items" class="fullwidth-sidebar">
                    <template #start>
                        <img alt="logo" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                            height="40" class="mr-2">
                    </template>
                    <template #end>
                        <InputText placeholder="Search" type="text" />
                    </template>
                </Menubar>
                <div id="content" style="background-color:#17212f;">
                    <!-- Setup your Establishment || Your Establishment Details -->
                    <div class="surface-section">
                        <div class="font-medium text-3xl text-900 mb-3">Your Establishment</div>
                        <div class="text-500 mb-5">Click on the text or the edit buttons to edit your establishment's
                            information. </div>
                        <ul class="list-none p-0 m-0">
                            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div class="text-500 w-6 md:w-2 font-medium">Establishment Name</div>
                                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 clickable">
                                    <span class="field-value" v-show="!showField('name')"
                                        @click="focusField('name')">{{establishment.name}}</span>
                                    <InputText v-model="establishment.name" v-show="showField('name')"
                                        id="establishment-name" type="text" class="field-value form-control"
                                        @focus="focusField('name')" @blur="blurField">
                                    </InputText>
                                </div>
                                <div class="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" class="p-button-text"
                                        @click="focusField('name')"></Button>
                                </div>
                            </li>
                            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div class="text-500 w-6 md:w-2 font-medium">Establishment Address</div>
                                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 clickable">
                                    <span class="field-value" v-show="!showField('address')"
                                        @click="focusField('address')">{{establishment.address}}</span>
                                    <InputText v-model="establishment.address" v-show="showField('address')"
                                        id="establishment-address" type="text" class="field-value form-control"
                                        @focus="focusField('address')" @blur="blurField">
                                    </InputText>
                                </div>
                                <div class="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" class="p-button-text"
                                        @click="focusField('address')"></Button>
                                </div>
                            </li>
                            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div class="text-500 w-6 md:w-2 font-medium">Establishment Menu</div>
                                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 clickable">
                                    <!-- check icon -->
                                    <i class="pi pi-check"></i>
                                    <!-- x icon -->
                                    <i class="pi pi-times"></i>
                                </div>
                                <div class="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
                                </div>
                            </li>
                            <li
                                class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                                <div class="text-500 w-6 md:w-2 font-medium">Description</div>
                                <div
                                    class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3 clickable">
                                    <span class="field-value" v-show="!showField('description')"
                                        @click="focusField('description')">{{establishment.description}}</span>
                                    <Textarea class="field-value form-control" rows="3" cols="50"
                                        placeholder="Enter a description of your establishment here."
                                        v-model="establishment.description" v-show="showField('description')"
                                        id="establishment-description" type="text" @focus="focusField('description')"
                                        @blur="blurField"></Textarea>
                                </div>
                                <div class="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" class="p-button-text"
                                        @click="focusField('description')"></Button>

                                </div>
                            </li>
                            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div class="text-500 w-6 md:w-2 font-medium">Keywords</div>
                                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <Chip v-for="keyword in establishment.keywords" :key="keyword" :label="keyword"
                                        class="mr-2" v-show="!showField('keywords')" @click="focusField('keywords')">
                                    </Chip>
                                    <Chips v-model="establishment.keywords" v-show="showField('keywords')"
                                        id="establishment-keywords" type="text" @focus="focusField('keywords')"
                                        @blur="blurField" @focusout="blurField" :addOnBlur=true></Chips>
                                </div>
                                <div class="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" class="p-button-text"
                                        @click="focusField('keywords')"></Button>
                                </div>
                            </li>
                        </ul>
                        <!-- Save Button -->
                        <div class="block justify-content-start mt-5">
                            <Button label="Save" icon="pi pi-check" class="p-button-success"
                                @click="updateEstablishment"></Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useEstablishmentStore } from '../stores/establishmentStore'
import { useAuthStore } from '../stores/authStore'
import EstablishmentSidebar from '../components/EstablishmentSidebar.vue'

export default {
    name: 'EstablishmentView',
    components: {
        EstablishmentSidebar,
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
            establishment: {
                name: 'Establishment Name',
                address: 'Establishment Address',
                menu: {},
                description: 'Establishment Description',
                keywords: ['Establishment Keywords']
            },
            visibleLeft: true,
            editField: '',
        }
    },
    mounted() {
        this.getEstablishment();
    },
    methods: {
        updateEstablishment() {
            if (this.establishment.eid) {
                this.establishmentStore.updateEstablishment(this.authStore.user.uid, this.establishment)
            } else {
                this.establishmentStore.createEstablishment(this.authStore.user.uid, this.establishment)
            }
        },
        getEstablishment() {
            if (this.authStore.user.uid) {
                this.establishmentStore.getEstablishmentByUID(this.authStore.user.uid);
            }
        },
        focusField(name) {
            this.editField = name;
            this.$nextTick(() => {
                document.getElementById('establishment-' + name).focus();
            });
        },
        blurField() {
            this.editField = '';
        },
        showField(name) {
            return (this.establishment[name] == '' || this.editField == name)
        }
    },
    watch: {
        establishmentStore: {
            handler: function (val, oldVal) {
                if(this.establishmentStore.establishment && this.establishmentStore.establishment.eid) {
                    this.establishment = this.establishmentStore.establishment;
                }
            },
            deep: true
        }
    }
}

</script>
<style>
.title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    text-align: center;
    height: 100%;
}

.p-sidebar-header {
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
    height: 10vh;
}

.logo {
    width: 50px;
    height: 50px;
}

.p-sidebar-header-content {
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
}

.p-sidebar-content {
    padding: 0 !important;
}

.p-sidebar {
    background: #17212f !important;
    border: none !important;
}
.item {
    font-size: 1.2rem;
    color: #000;
    margin: 0;
    align-items: center;
    text-align: center;
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #ebebeb;
}

.left-data {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1rem;
}

.store-summary {
    height: 300px;
}

.option {
    padding-top: 20px;
    padding-bottom: 20px;
}

.pct85 {
    width: 85vw;
    height: 100vh;
    float: right;
    background-color: rgb(255, 255, 255);
}

.pct15 {
    width: 15vw !important;
    height: 100vh !important;
    float: left;
    background-color: #002253;
    transition: none !important;
}

.fullwidth-sidebar {
    width: 100% !important;
    background: #f8f9fa !important;
    border: none !important;
    border-bottom: gray solid 1px !important;
    border-radius: 0 !important;
}

#content {
    height: 100vh;
    width: 100%;
    background-color: #17212F;
    display: flex;
}

.surface-section {
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.9);
    margin: 50px;
    width: inherit;
    padding: 2rem;
}

.clickable {
    cursor: pointer;
}

input[type=text] {
    width: 60%;
}
</style>