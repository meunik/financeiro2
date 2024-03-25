import Vue from 'vue'
import Vuex from 'vuex'
import gastosCartao from '@raiz/database/json/nubank/GastosCartao.json'
import faturasCartao from '@raiz/database/json/nubank/FaturasCartao.json'
import faturasCompletas from '@raiz/database/json/nubank/FaturasCompletas.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    notificacoes: [],
    notificacaoId: 1,
    mapa: [],
    mapaDir: '',
    dados: [],
    gastosCartao: gastosCartao,
    faturasCartao: faturasCartao,
    faturasCompletas: faturasCompletas,
  },
  getters: {
    loading: state => state.loading,
    notificacoes: state => state.notificacoes,
    notificacaoId: state => state.notificacaoId,
    mapa: state => state.mapa,
    mapaDir: state => state.mapaDir,
    dados: state => state.dados,
    gastosCartao: state => state.gastosCartao,
    faturasCartao: state => state.faturasCartao,
    faturasCompletas: state => state.faturasCompletas,
  },
  mutations: {
    loading: (state, obj) => state.loading = obj,
    notificacoes: (state, obj) => state.notificacoes = obj,
    notificacaoId: (state, obj) => state.notificacaoId = obj,
    mapa: (state, obj) => state.mapa = obj,
    mapaDir: (state, obj) => state.mapaDir = obj,
    dados: (state, obj) => state.dados = obj,
  },
  actions: {
  },
  modules: {
  }
})
