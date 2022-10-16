import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    email: null,
    uid: null,
    lat: null,
    lng: null,
  }),
  getters: {
    getUserId(state) {
      return state.uid
    }
  }, 
  actions: {
    setUserId(uid) {
      this.uid = uid
    }
  }
})