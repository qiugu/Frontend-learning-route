import * as Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const main = {
  state: {
    grandson: 'qqq'
  }
}

const app = {
  namespaced: true,
  modules: {
    main
  },
  state: {
    count: 0
  },
  getters: {
    count: state => state.count
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
  },
  state: {
    sessionId: 'abc'
  },
  mutations: {
    CHANGE (state, payload) {
      state.sessionId = payload
    }
  },
  actions: {
    changeSession ({ commit }) {
      setTimeout(() => {
        commit('CHANGE')
      }, 3000)
    }
  }
})