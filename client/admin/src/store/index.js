import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	user: null
  },
  getters: {
  	user: state => state.user
  },
  mutations: {
  	login(state, user){
  		state.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
  	},
  	logout(state){
  		state.user = null
      sessionStorage.removeItem('user')
  	}
  },
  modules: {

  }
})
