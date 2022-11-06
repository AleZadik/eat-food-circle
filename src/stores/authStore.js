import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore(
  {
    id: 'auth',
    state: () => ({
      user: {},
    }),
    getters: {
      getUser(state) {
        return state.user
      }
    },
    actions: {
      login(name, email, lat, lon) {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('lat', lat)
        formData.append('lon', lon)
        axios.post('http://127.0.0.1:8080/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => {
            this.user = response.data;
            sessionStorage.setItem('user', JSON.stringify(this.user));
          });
      },
      updateUserType(type) {
        if (!(type === "customer" || type === "establishment")) {
          this.$toast.add({ severity: 'error', summary: 'Wrong Type', detail: 'User type does not exist.', life: 2000 });
          return;
        }
        axios.post('http://127.0.0.1:8080/update-user', {
          changes: { u_type: type },
          uid: this.user.uid
        })
          .then((response) => {
            this.user.u_type = type;
            sessionStorage.setItem('user', JSON.stringify(this.user));
            this.$router.push({name: type});
          });
      },
      updateUserByAddress(address) {
        axios.post('http://127.0.0.1:8080/update-user-by-address', {
          address: address,
          uid: this.user.uid,
        })
          .then((response) => {
            this.user.lat = response.data.lat;
            this.user.lon = response.data.lon;
            this.user.cid = response.data.cid;
            sessionStorage.setItem('user', JSON.stringify(this.user));
            this.$router.go();
          });
        }
    },
  })