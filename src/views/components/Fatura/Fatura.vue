<template>
  <div>  
    <h1 class="mt-2">Fatura</h1>
    <div v-if="arquivo">
      <v-icon class="mb-3" left>mdi-arrow-right-bottom</v-icon>
      <v-breadcrumbs class="d-contents" :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item class="grey--text" :disabled="item.disabled" @click="abrirSheet(item.arquivo)">
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>

    <!-- <v-btn v-if="transacoes.length > 0" class="mt-5" color="green" @click="exportJson()" :loading="loading">
      <v-icon left>mdi-table-arrow-right</v-icon>
      Exportar
    </v-btn> -->

    <v-row class="my-5">
      <v-col cols="12" sm="4">
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="#420567" elevation="5" dark rounded shaped>
          Fatura: 
          <span class="blue--text text-no-wrap">{{ moeda(total) }}</span>
        </v-banner>
      </v-col>
      <v-col cols="12" sm="4">
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="#420567" elevation="5" dark rounded shaped>
          Estornos: 
          <span class="green--text text-no-wrap">{{ moeda(positivo(estornos)) }}</span>
        </v-banner>
      </v-col>
      <v-col cols="12" sm="4">
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="#420567" elevation="5" dark rounded shaped>
          Saidas: 
          <span class="red--text text-no-wrap">{{ moeda(saidas) }}</span>
        </v-banner>
      </v-col>
    </v-row>

    <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

    <v-skeleton-loader v-if="loading" type="table-heading"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" type="table-thead"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" class="mb-5" type="table-tbody"></v-skeleton-loader>

    <div v-else class="my-5">
      <v-card>
        <v-card-title>
            <v-checkbox
              v-model="checkboxGroupBy"
              label="Agrupar"
            ></v-checkbox>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          dense
          :headers="headers"
          :items="transacoes"
          :search="search"
          :items-per-page="15"
          :group-by="checkboxGroupBy?'category':null"
          :loading="loading"
          loading-text="Carregando... Por favor, aguarde"
          class="elevation-1"
        >
          <template v-slot:item.title="{ item }">
            <span :class="cor(item.amount)">
              {{ item.title }}
            </span>
          </template>
          <template v-slot:item.amount="{ item }">
            <span :class="cor(item.amount)">
              {{ moeda(positivo(item.amount)) }}
            </span>
          </template>
          <template v-slot:item.post_date="{ item }">
            <span :class="cor(item.amount)">
              {{ dataFormat(item.post_date) }}
            </span>
          </template>
          <template v-slot:item.category="{ item }">
            <span :class="cor(item.amount)">
              {{ (!item.category && (item.amount < 0)) ? 'Estorno' : item.category}}
            </span>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-skeleton-loader v-if="loading" type="table-tfoot"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" class="my-5" type="image"></v-skeleton-loader>
    
    <v-banner class="my-5">Agrupados por Categorias</v-banner>
    <FaturaCategorias v-if="agrupCategoria.length && !loading" :categorias="agrupCategoria" ref="categoria"/>
    
    <v-banner class="my-5">Agrupados por Nome</v-banner>
    <GraficosFatura
      v-if="transAgrup.length && !loading"
      ref="graficoAgrupada"
      :items="transAgrup"
      tipo="bar"
      cor="red"
      :tratar-numero="moeda"
      :escala-x="true"
      :escala-y="true"
    />
    <FaturaAgrupada v-if="transAgrup.length && !loading" :items="transAgrup" :datas="diasAgrupadas"/>




  </div>
</template>

<script>
import FaturaAgrupada from '@/views/components/Fatura/FaturaAgrupada.vue'
import FaturaCategorias from '@/views/components/Fatura/FaturaCategorias.vue'
import GraficosFatura from '@/views/components/Graficos/GraficosFatura.vue'
import { moeda } from '@/Utils/Converter'
import { Model } from "@/store/Model"
import moment from 'moment'

export default {
  mixins: [Model],
  components: {
    FaturaAgrupada,
    FaturaCategorias,
    GraficosFatura,
  },
  props: {
    faturaDados: {
      type: [Array, Object],
      default: ''
    },
    panelIndex: {
      type: Number,
    },
    panel: {
      type: Number,
    },
  },
  watch: {
    panel() {
      if (this.panelIndex == this.panel) this.$refs.graficoAgrupada.atualizar();
      if (this.panelIndex == this.panel) this.$refs.categoria.atualizar();
    }
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
        {
          text: 'Valor',
          value: 'amount'
        },
        { text: 'Data', value: 'post_date' },
        { text: 'Categoria', value: 'category' },
      ],
      search: null,
      pdfPath: null,
    }
  },
  computed: {
    summary() { return this.faturaDados.bill.summary},
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
    transAgrup() { return this.agruparTransacoes(this.fatura.line_items, 1)},
    transAgrupEntradas() { return this.agruparTransacoes(this.fatura.line_items, 0)},
    breadcrumbs() {
      if (this.faturaDados) {
        return [
          {
            text: this.ano(this.summary.due_date),
            disabled: false,
            arquivo: 0,
          },
          {
            text: this.mes(this.summary.due_date),
            disabled: true,
            arquivo: 1,
          },
        ]
      } else return [];
    },
    agrupCategoria() {
      let categorias = [];
      let transacoes = this.transacoes.filter((item) => item.amount >= 0)
      let total = 0;
      let items = transacoes.reduce((result, item) => {
        if (!result[item.category]) {
          result[item.category] = {
            transacoes: [],
            total: 0,
            porcentagem: 0,
            nome: ''
          };
        }
        result[item.category].transacoes.push(item);
        result[item.category].total += item.amount;
        result[item.category].nome = item.category;
        total += item.amount;
        return result;
      }, {});
      Object.keys(items).map(key => {
        items[key].porcentagem = (items[key].total / total) * 100;
        categorias.push(items[key])
      });
      return categorias;
    },
  },
  mounted() {
    // console.log('-------------------------------');
    // console.log(this.agrupCategoria.length);
    // console.log(JSON.parse(JSON.stringify(this.agrupCategoria)));
    // console.log(JSON.parse(JSON.stringify(this.transAgrup)));
  },
  methods: {
    moeda,
    fecharFatura() {
    },
    abrirSheet(arquivo) {},
    exportJson() { window.api.send('exportarXlsx', this.transacoes) },
    cor(valor) { if (valor < 0) return 'green--text' },
    positivo(valor) { return Math.abs(valor) },
    dataFormat(data) { return moment(data, 'YYYY-MM-DD').locale('pt-br').format('DD/MM/YYYY'); },
    ano(data) { return moment(data, 'YYYY-MM-DD').locale('pt-br').format('YYYY'); },
    mes(data) { return moment(data, 'YYYY-MM-DD').locale('pt-br').format('MMMM'); },
    agruparTransacoes(transacoes, tipo = 1) {
      if (!this.faturaDados) return [];
      let result = transacoes.reduce((key, obj) => {
        if ((tipo == 1)&&(obj.amount < 0)) return key;
        if ((tipo == 0)&&(obj.amount >= 0)) return key;

        let findObj = key.find(x => x.nome === obj.title);
        if (findObj) {
            findObj.datas.push({ valor: obj.amount, data: obj.post_date });
            findObj.total += obj.amount;
        } else key.push({ nome: obj.title, total: obj.amount, datas: [{ valor: obj.amount, data: obj.post_date }] });
        return key;
      }, []);

      if (tipo == 1) {
        let agrupadas = [...new Set(result)];
        let datas = transacoes.map(obj => obj.post_date);
        let datasUnicas = [...new Set(datas)];
        this.diasAgrupadas = datasUnicas
        return agrupadas
      } else {
        let agrupadas = [...new Set(result)];
        return agrupadas
      }

    },
  }
}
</script>
