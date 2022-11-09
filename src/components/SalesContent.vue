<template>
    <div class="surface-ground px-4 py-5 md:px-6 lg:px-8">
        <div class="grid">
            <div class="col-12 md:col-6 lg:col-3 p-3">
                <div class="p-3 text-center bg-blue-500" style="border-radius: 12px" v-tooltip.top="'Total Revenue from all orders'">
                    <span class="inline-flex justify-content-center align-items-center bg-blue-600 border-circle mb-3"
                        style="width:49px; height: 49px"> <i class="pi pi-dollar text-xl text-white"></i> </span>
                    <div class="text-2xl font-medium text-white mb-2">$ {{ Math.floor(this.establishmentStore.orders.overall_total * 100)/100 ? Math.floor(this.establishmentStore.orders.overall_total * 100)/100 : 0 }}</div> <span
                        class="text-blue-100 font-medium">Total Revenue</span>
                </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3 p-3">
                <div class="p-3 text-center bg-purple-500" style="border-radius: 12px" v-tooltip.top="'Number of Circles created'"> <span
                        class="inline-flex justify-content-center align-items-center bg-purple-600 border-circle mb-3"
                        style="width:49px; height: 49px"> <i class="pi pi-map-marker text-xl text-white"></i>
                    </span>
                    <div class="text-2xl font-medium text-white mb-2"> {{ Object.keys(this.establishmentStore.orders).length - 3 }}</div> <span
                        class="text-indigo-100 font-medium">Promotional Circles</span>
                    </div>
                </div>
                <div class="col-12 md:col-6 lg:col-3 p-3">
                    <div class="p-3 text-center bg-indigo-500" style="border-radius: 12px" v-tooltip.top="'Total Amount of Orders'"> <span
                        class="inline-flex justify-content-center align-items-center bg-indigo-600 border-circle mb-3"
                        style="width:49px; height: 49px"> <i class="pi pi-file text-xl text-white"></i> </span>
                        <div class="text-2xl font-medium text-white mb-2"> {{ this.establishmentStore.amtOrders }}</div> <span
                            class="text-purple-100 font-medium">Orders</span>
                </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3 p-3">
                <div class="p-3 text-center bg-orange-500" style="border-radius: 12px" v-tooltip.top="'Number of Unique Customers'"> <span
                        class="inline-flex justify-content-center align-items-center bg-orange-600 border-circle mb-3"
                        style="width:49px; height: 49px"> <i class="pi pi-users text-xl text-white"></i> </span>
                    <div class="text-2xl font-medium text-white mb-2">{{ this.establishmentStore.amtCustomers }}</div> <span
                        class="text-orange-100 font-medium">Customers</span>
                </div>
            </div>
        </div>
        <div class="awesome-table surface-ground px-4 py-5 mt-5">
        <DataTable :value="orders" responsiveLayout="scroll">
            <Column field="uid" header="Customer" :sortable="true"></Column>
            <Column field="oid" header="Order ID" :sortable="true"></Column>
            <Column field="date" header="Date" :sortable="true"></Column>
            <Column field="total" header="Total" :sortable="true">
                <template #body="slotProps">
                    ${{ slotProps.data.total }}
                </template>
            </Column>
            <Column field="OrderString" header="Order" :sortable="true">
                <template #body="slotProps">
                    <!-- document icon -->
                    <i class="pi pi-file" v-tooltip.top="slotProps.data.OrderString"></i>
                </template>
            </Column>
            <Column field="amtCircleSales" header="Circle Sales" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.amtCircleSales }}
                </template>
            </Column>
            <Column field="circleCreator" header="Circle Creator" :sortable="true">
                <template #body="slotProps">
                    <i class="circle-creator pi pi-map-marker text-xl text-black clickable" v-if="slotProps.data.circleCreator == 'YES'" v-tooltip="'User Created Circle'"></i>
                    <i class="non-circle-creator pi pi-ban text-xl text-gray-300" v-else v-tooltip="'Non Creator'"></i>
                </template>
            </Column>
        </DataTable>
    </div>
    </div>
</template>

<script>
import { useEstablishmentStore } from '../stores/establishmentStore'
import { useAuthStore } from '../stores/authStore'

export default {
    name: 'SalesContent',
    setup() {
        const authStore = useAuthStore();
        const establishmentStore = useEstablishmentStore();
        return {
            establishmentStore,
            authStore
        }
    },
    data() {
        return {
            orders: [],
        }
    },
    mounted() {
        this.getEstablishment();
    },
    methods: {
        getEstablishment() {
            if (this.authStore.user.uid) {
                this.establishmentStore.getEstablishmentByUID(this.authStore.user.uid);
                this.establishmentStore.getEstablishmentOrders(this.establishmentStore.establishment.eid);
            }
        },
        getOrderString(order) {
            let orderString = '';
            for (let i = 1; i <= Object.keys(order.order_obj).length; i++) {
                if (order.order_obj[i] <= 0) continue;
                let item = this.establishmentStore.establishment.menu[i-1].name;
                let quantity = order.order_obj[i];
                orderString += `${quantity}x ${item}, `;
            }
            for( let i = 0; i < this.establishmentStore.establishment.promo.length; i++) {
                if ( order.amtCircleSales >= i + 1) {
                    orderString += `PROMO: ${this.establishmentStore.establishment.promo[i]}, `;
                }
            }
            return orderString.slice(0, -2);
        }
    },
    watch: {
        establishmentStore: {
            handler() {
                this.orders = [];
                for (const key in this.establishmentStore.orders) {
                    if (key !== 'overall_total' && key !== 'first_ts' && key !== 'last_ts') {
                        this.establishmentStore.orders[key].orders.forEach(order => {
                            order.date = new Date(order.created_at * 1000).toLocaleString();
                            order.circleCreator = Math.abs(order.ts_group - order.created_at) <= 0.1 ? 'YES' : 'NO';
                            order.OrderString = this.getOrderString(order);
                            order.amtCircleSales = this.establishmentStore.orders[key].orders.length;
                            this.orders.push(order);
                        });
                    }
                }
            },
            deep: true
        }
    }
}
</script>

<style>
.grid, .awesome-table {
    box-shadow: 0px 4px 8px 7px rgba(0,0,0,0.1);
    border-radius: 12px;
}
.p-datatable .p-datatable-tbody > tr {
    background: transparent !important;
}

th {
    background: transparent !important;
}

.circle-creator {
    border: 1px solid black;
    color: black;
    border-radius: 5rem;
    padding: 10px;
    background-color: rgba(33, 249, 0, 0.5);
}

.non-circle-creator {
    border: 1px solid black;
    color: black;
    border-radius: 5rem;
    padding: 10px;
    background-color: rgba(249, 0, 0, 0.5);
}
</style>