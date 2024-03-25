export let Model = {
  computed: {
    loading: {
      get() { return this.$store.getters.loading; },
      set(value) { this.$store.commit('loading', value); }
    },
    notificacoes: {
      get() { return this.$store.getters.notificacoes; },
      set(value) { this.$store.commit('notificacoes', value); }
    },
    notificacaoId: {
      get() { return this.$store.getters.notificacaoId; },
      set(value) { this.$store.commit('notificacaoId', value); }
    },

    gastosCartao: { get() { return this.$store.getters.gastosCartao; } },
    faturasCartao: { get() { return this.$store.getters.faturasCartao; } },
    faturasCompletas: { get() { return this.$store.getters.faturasCompletas; } },

    mapa: {
      get() { return this.$store.getters.mapa; },
      set(value) { this.$store.commit('mapa', value); }
    },
    mapaDir: {
      get() { return this.$store.getters.mapaDir; },
      set(value) { this.$store.commit('mapaDir', value); }
    },
    dados: {
      get() { return this.$store.getters.dados; },
      set(value) { this.$store.commit('dados', value); }
    }
  },
  methods: {
    notificacao(mensagem, cor='default', tempo=3000) {
      if (this.notificacaoId > 99) this.notificacaoId = 1;
      let novaSnackbar = { id: this.notificacaoId++, show: true, color: cor, text: mensagem };
      this.notificacoes.unshift(novaSnackbar);

      setTimeout(() => {
        this.removeNotificacao(novaSnackbar.id);
      }, tempo);
    },
    removeNotificacao(id) {
      let index = this.notificacoes.findIndex(notificacao => notificacao.id === id);
      if (index > -1) this.notificacoes.splice(index, 1);
    }
  }
}