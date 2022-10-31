import { defineStore } from 'pinia'
import axios from 'axios'

export const useEstablishmentStore = defineStore(
  {
    id: 'establishment',
    state: () => ({
      establishment: {},
      allEstablishments: [],
    }),
    getters: {
      getEstablishment(state) {
        return state.establishment
      },
      getAllEstablishments(state) {
        return state.allEstablishments
      }
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
            return response.data;
          });
      },
      createEstablishment(uid, establishment) {
        axios.post('http://127.0.0.1:8080/create-est', { uid: uid, establishment: establishment })
          .then((response) => {
            this.establishment = response.data;
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Establishment created.', life: 2000 });
          });
      },
      getEstablishmentsByCity(city_name) {
        axios.post('http://127.0.0.1:8080/get-est-by-city', { city_id: city_name })
          .then((response) => {
            this.allEstablishments = response.data;
          });
      },
      submitOrder(order) {
        axios.post('http://127.0.0.1:8080/submit-order', { order: order })
          .then((response) => {
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Order submitted.', life: 2000 });
          });
      },
    }
  })