import * as Vuex from '../src/index'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    ADD_COUNT (state, payload) {
      state.count++
    }
  }
})