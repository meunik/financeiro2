<template>
    <div>  
      <h1 class="mt-2">Fatura</h1>
      <!-- <div v-if="arquivo">
        <v-icon class="mb-3" left>mdi-arrow-right-bottom</v-icon>
        <v-breadcrumbs class="d-contents" :items="breadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item href="#" :disabled="item.disabled" @click="abrirSheet(item.arquivo)">
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-btn icon plain color="red" class="mb-1" @click="fecharFatura">
          <v-icon class="mx-0 red--text">mdi-file-remove</v-icon>
        </v-btn>
      </div> -->
  
      <!-- <v-btn v-if="transacoes.length > 0" class="mt-5" color="green" @click="exportJson()" :loading="loading">
        <v-icon left>mdi-table-arrow-right</v-icon>
        Exportar
      </v-btn> -->
  
      <v-row class="my-5">
        <v-col>
          <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
          <v-banner v-else color="secondary" elevation="5" outlined rounded shaped>
            Valor Fatura: 
            <span class="blue--text">{{ dinheiro(total) }}</span>
          </v-banner>
        </v-col>
        <v-col>
          <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
          <v-banner v-else color="secondary" elevation="5" outlined rounded shaped>
            Estornos: 
            <span class="green--text">{{ dinheiro(estornos) }}</span>
          </v-banner>
        </v-col>
        <v-col>
          <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
          <v-banner v-else color="secondary" elevation="5" outlined rounded shaped>
            Saidas: 
            <span class="red--text">{{ dinheiro(saidas) }}</span>
          </v-banner>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  import FaturaAgrupada from '@/views/components/Fatura/FaturaAgrupada.vue'
  import GraficosFatura from '@/views/components/Graficos/GraficosFatura.vue'
  import { dinheiro } from '@/Utils/Converter'
  import { Model } from "@/store/Model"
  
  export default {
    mixins: [Model],
    components: {
      FaturaAgrupada,
      GraficosFatura,
    },
    props: {
      faturaDados: {
        type: Array|Object,
        default: ''
      },
    },
    data() {
      return {
        carregando: false,
        btnConverter: false,
        checkboxGroupBy: false,
        groupBy: null,
        diasAgrupadas: [],
        headers: [
          {
            text: 'Nome',
            align: 'start',
            sortable: false,
            value: 'title',
          },
          { text: 'Valor', value: 'amount' },
          { text: 'Data', value: 'post_date' },
          { text: 'Tipo', value: 'type' },
        ],
        search: null,
        pdfPath: null,
      }
    },
    created() {
      console.log(this.faturaDados);
    },
    computed: {
      fatura() { return this.faturaDados.bill},
      vencimento() { return this.fatura.summary.due_date},
      referencia() { return this.fatura.state},
      arquivo() { return this.fatura.summary.due_date},
      // path() { return this.fatura.path},
      total() { return this.fatura.summary.total_balance},
      pagamentos() { return this.fatura.summary.total_balance},
      estornos() { return this.fatura.summary.past_balance},
      entradas() { return this.fatura.summary.minimum_payment},
      saidas() { return this.fatura.summary.total_cumulative},
      transacoes() { return this.fatura.line_items},
      // transAgrup() { return this.agruparTransacoes(this.fatura.transacoes, 1)},
      // transAgrupEntradas() { return this.agruparTransacoes(this.fatura.transacoes, 0)},
      // breadcrumbs() {
      //   if (this.fatura) {
      //     return [
      //       {
      //         text: this.fatura.referencia,
      //         disabled: false,
      //         arquivo: 0,
      //       },
      //       {
      //         text: this.fatura.name,
      //         disabled: true,
      //         arquivo: 1,
      //       },
      //     ]
      //   } else return [];
      // },
    },
    methods: {
      dinheiro,
      fecharFatura() {
      },
      abrirSheet(arquivo) {},
      exportJson() { window.api.send('exportarXlsx', this.transacoes) },
    }
  }
  </script>
  