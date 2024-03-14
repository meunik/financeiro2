import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    notificacoes: [],
    notificacaoId: 1,
  },
  getters: {
    loading: state => state.loading,
    notificacoes: state => state.notificacoes,
    notificacaoId: state => state.notificacaoId,
  },
  mutations: {
    loading: (state, obj) => state.loading = obj,
    notificacoes: (state, obj) => state.notificacoes = obj,
    notificacaoId: (state, obj) => state.notificacaoId = obj,
  },
  actions: {
  },
  modules: {
  }
})
