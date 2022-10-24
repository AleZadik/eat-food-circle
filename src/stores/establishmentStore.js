import { defineStore } from 'pinia'
import axios from 'axios'

export const useEstablishmentStore = defineStore(
  {
    id: 'establishment',
    state: () => ({
      establishment: {},
    }),
    getters: {
      getEstablishment(state) {
        return state.establishment
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
      }
    },
  })