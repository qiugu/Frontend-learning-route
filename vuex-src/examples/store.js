import * as Vuex from '../src/index'
import Vue from 'vue'

Vue.use(Vuex)

const app = {
  state: {
    count: 0
  },
  mutations: {
    ADD_COUNT (state, payload) {
      state.count++
    }
  }
}

export default new Vuex.Store({
  modules: {
    app
  }
})