<template>
  <div class="d-flex flex-column flex-md-row">
    <div>
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(cat, i) in categorias" :key="i" hide-actions>
          <v-expansion-panel-header>
            <div class="d-flex justify-space-between pr-5">
              <strong class="text-no-wrap">{{ cat.nome }}</strong>
              <div :class="{ 'red--text':1, 'text-no-wrap':1, 'green--text': isPagamento(cat.nome) }">
                <span class="primary--text f-13">(<span class="grey--text">{{cat.porcentagem.toFixed(0)}}%</span>)</span>
                <strong> {{ isPagamento(cat.nome) ? moeda(positivo(cat.total)) : moeda(cat.total) }}</strong>
              </div>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>

            <v-list>
              <v-list-item v-for="(item, key) in cat.transacoes" :key="key" link>
                <v-row class="d-flex justify-space-between">
                  <strong>{{ item.title }}</strong>
                  <strong class="text-no-wrap" :class="{ 'red--text':1, 'green--text': isPagamento(cat.nome) }">
                    {{ isPagamento(cat.nome) ? moeda(positivo(item.amount)) : moeda(item.amount) }}
                  </strong>
                </v-row>
              </v-list-item>
            </v-list>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div style="min-width: 400px;">
      <GraficosFatura
        v-if="categorias.length && !loading"
        ref="grafico"
        :items="categorias"
        tipo="pie"
        :cor="[
          '#ff6384',
          '#36a2eb',
          '#cc65fe',
          '#ffce56',
          '#FF1744',
          '#00C853',
          '#FF6D00',
          '#263238',
          '#4E342E',
          '#1DE9B6',
          '#0D47A1',
          '#4A148C',
        ]"
        :tratar-numero="moeda"
        :legend="true"
      />
    </div>
  </div>
</template>

<script>
import GraficosFatura from '@/views/components/Graficos/GraficosFatura.vue'
import { dinheiro, moeda } from '@/Utils/Converter'
import { Model } from "@/store/Model"
import moment from 'moment'

export default {
  mixins: [Model],
  components: {
    GraficosFatura,
  },
  props: {
    categorias: {
      require: true,
      type: Array
    },
  },
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'nome',
      keys: [
        'Nome',
      ],
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.categorias.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'Nome')
    },
  },
  methods: {
    dinheiro,
    moeda,
    isPagamento(valor) { return (valor == 'Pagamento') ? true : false },
    positivo(valor) { return Math.abs(valor) },
    dataFormat(data) { return moment(data, 'YYYY-MM-DD').locale('pt-br').format('DD/MM/YYYY'); },
    nextPage() { if (this.page + 1 <= this.numberOfPages) this.page += 1 },
    formerPage() { if (this.page - 1 >= 1) this.page -= 1 },
    updateItemsPerPage(number) { this.itemsPerPage = number },
    atualizar() { this.$refs.grafico.atualizar() },
  },
}
</script>