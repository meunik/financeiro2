<template>
  <v-row class="mt-10">
    <v-col cols="12" sm="6" class="pa-0">
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(cat, i) in categorias" :key="i" hide-actions>
          <v-expansion-panel-header>
            <v-row no-gutters>
              <v-col><strong>{{ cat.nome }}</strong></v-col>
              <v-col class="text-no-wrap" cols="4">
                <strong :class="{ 'red--text':1, 'green--text': isPagamento(cat.nome) }">
                  {{ isPagamento(cat.nome) ? modeda(positivo(cat.total)) : modeda(cat.total) }}
                </strong>
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>

            <v-list>
              <v-list-item v-for="(item, key) in cat.transacoes" :key="key" link>
                <v-row class="d-flex justify-space-between">
                  <strong>{{ item.title }}</strong>
                  <strong class="text-no-wrap" :class="{ 'red--text':1, 'green--text': isPagamento(cat.nome) }">
                    {{ isPagamento(cat.nome) ? modeda(positivo(item.amount)) : modeda(item.amount) }}
                  </strong>
                </v-row>
              </v-list-item>
            </v-list>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="12" sm="6" class="pa-0">
      <GraficosFatura v-if="categorias.length && !loading" :items="categorias" tipo="pie" />
    </v-col>
  </v-row>
</template>

<script>
import GraficosFatura from '@/views/components/Graficos/GraficosFatura.vue'
import { dinheiro, modeda } from '@/Utils/Converter'
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
    modeda,
    isPagamento(valor) { return (valor == 'Pagamento') ? true : false },
    positivo(valor) { return Math.abs(valor) },
    dataFormat(data) { return moment(data, 'YYYY-MM-DD').locale('pt-br').format('DD/MM/YYYY'); },
    nextPage () { if (this.page + 1 <= this.numberOfPages) this.page += 1 },
    formerPage () { if (this.page - 1 >= 1) this.page -= 1 },
    updateItemsPerPage (number) { this.itemsPerPage = number },
  },
}
</script>