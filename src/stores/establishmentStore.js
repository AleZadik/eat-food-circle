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
            this.orders = response.data;
            this.first_ts = response.data.first_ts;
            this.last_ts = response.data.last_ts;
          });
      },
      async getOrdersBetweenFirstAndLastTs(fts, lts) {
        let len = Object.keys(this.orders).length - 2;
        let filtered_orders = {};
        for (let i = 1; i <= len; i++) {
          let order = this.orders["" + i].orders;
          // console.log(order);
          for( let j = 0; j < order.length; j++) {
            // console.log(order[j]);
            if (order[j].created_at >= fts && order[j].created_at <= lts) {
              // console.log("added");
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