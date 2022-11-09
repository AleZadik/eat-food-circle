import { defineStore } from 'pinia'
import axios from 'axios'

export const useEstablishmentStore = defineStore(
  {
    id: 'establishment',
    state: () => ({
      establishment: {},
      allEstablishments: [],
      circles: [],
      orders: {},
      first_ts: 0,
      last_ts: 0,
      filtered_orders: {},
      amtOrders: 0,
      amtCustomers: 0,
    }),
    getters: {
      getEstablishment(state) {
        return state.establishment
      },
      getAllEstablishments(state) {
        return state.allEstablishments
      },
    },
    actions: {
      updateEstablishment(uid, establishment) {
        axios.post('http://127.0.0.1:8080/update-est', {
          changes: establishment,
          eid: this.establishment.eid,
          uid: uid
        })
          .then((response) => {
            this.establishment = response.data;
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Establishment updated.', life: 2000 });
          });
      },
      getEstablishmentByUID(id) {
        axios.post('http://127.0.0.1:8080/get-est', { uid: id })
          .then((response) => {
            this.establishment = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      },
      createEstablishment(uid, establishment) {
        axios.post('http://127.0.0.1:8080/create-est', { uid: uid, establishment: establishment })
          .then((response) => {
            this.establishment = establishment;
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Establishment created.', life: 2000 });
          });
      },
      getEstablishmentsByCity(city_name, lat, lon) {
        axios.post('http://127.0.0.1:8080/get-est-by-city', { city_id: city_name, lat: lat, lon: lon })
          .then((response) => {
            this.allEstablishments = response.data.establishments;
            this.circles = response.data.circles;
          });
      },
      submitOrder(order) {
        axios.post('http://127.0.0.1:8080/submit-order', { order: order })
          .then((response) => {
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Order submitted.', life: 2000 });
            this.getEstablishmentsByCity(order.cid, order.lat, order.lon);
          });
      },
      getEstablishmentOrders(eid) {
        axios.post('http://127.0.0.1:8080/get-estab-orders', { eid: eid })
          .then((response) => {
            this.orders = response.data; // orders is a dict { 1: {order: [], total: 0}, 2: {order: [], total: 0}, ... first_ts: 0, last_ts: 0 }
            this.first_ts = response.data.first_ts;
            this.last_ts = response.data.last_ts;
            let amtOrders = 0;
            let uniqueCustomers = new Set();
            for (let key in response.data) {
              if (key != 'first_ts' && key != 'last_ts' && key != 'overall_total') {
                amtOrders += response.data[key].orders.length;
                for (let order of response.data[key].orders) {
                  if (order.uid) {
                    uniqueCustomers.add(order.uid);
                  }
                }
              }
            }
            this.amtOrders = amtOrders;
            this.amtCustomers = uniqueCustomers.size;
          });
      },
      async getOrdersBetweenFirstAndLastTs(fts, lts) {
        let len = Object.keys(this.orders).length - 3;
        let filtered_orders = {};
        for (let i = 1; i <= len; i++) {
          let order = this.orders["" + i].orders;
          for( let j = 0; j < order.length; j++) {
            if (order[j].created_at >= fts - 5 && order[j].created_at <= lts + 5) {
              if (!filtered_orders["" + i]) {
                filtered_orders["" + i] = {'orders': [], 'total': 0};
              }
              filtered_orders["" + i].orders.push(order[j]);
              filtered_orders["" + i].total += order[j].total;
            }
          }
        }
        this.filtered_orders = filtered_orders;
        return filtered_orders;
      },
    }
  })