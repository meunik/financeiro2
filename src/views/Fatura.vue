<template>
  <div>
    <!-- <v-btn class="mb-2" color="orange darken-2">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-divider class="mb-10"></v-divider> -->

    <v-file-input label="Arquivo" v-model="pdfPath"></v-file-input>
    
    <v-btn @click="converterPdfParaJson()">
      <v-icon left>mdi-file-send</v-icon>
      Converter
    </v-btn>

    <v-row class="my-5">
      <v-col>
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="secondary" elevation="5" outlined rounded shaped>Valor Fatura: {{ dinheiro(total) }}</v-banner>
      </v-col>
      <v-col>
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="secondary" elevation="5" outlined rounded shaped>Entradas: <span class="green--text">{{ dinheiro(entradas) }}</span></v-banner>
      </v-col>
      <v-col>
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="secondary" elevation="5" outlined rounded shaped>Saidas: <span class="red--text">{{ dinheiro(saidas) }}</span></v-banner>
      </v-col>
    </v-row>

    <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

    <v-skeleton-loader v-if="loading" class="my-5" type="table"></v-skeleton-loader>
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
          :group-by="checkboxGroupBy?'nome':null"
          :loading="loading"
          loading-text="Carregando... Por favor, aguarde"
          class="elevation-1"
        >
          <template v-slot:item.nome="{ item }">
            <span :class="cor(item.tipo)">
              {{ item.nome }}
            </span>
          </template>
          <template v-slot:item.valor="{ item }">
            <span :class="cor(item.tipo)">
              {{ dinheiro(item.valor) }}
            </span>
          </template>
          <template v-slot:item.data="{ item }">
            <span :class="cor(item.tipo)">
              {{ item.data }}
            </span>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <FaturaAgrupada v-if="transacoesAgrupadas.length > 0" :items="transacoesAgrupadas" :datas="diasAgrupadas"/>

    <v-spacer></v-spacer>
      
    <GraficosFatura v-if="transacoesAgrupadas.length > 0" :items="transacoesAgrupadas" />
  </div>
</template>

<script>
import FaturaAgrupada from '@/views/FaturaAgrupada.vue'
import Barras from '@/components/Graficos/Barras.vue'
import GraficosFatura from '@/components/Graficos/GraficosFatura.vue'
import { dinheiro } from '@/Utils/Converter'

export default {
  name: 'Home',
  components: {
    FaturaAgrupada,
    GraficosFatura,
  },
  data() {
    return {
      loading: false,
      checkboxGroupBy: false,
      groupBy: null,
      diasAgrupadas: [],
      transacoesAgrupadasEntradas: [],
      transacoesAgrupadas: [],
      transacoes: [],
      headers: [
        {
          text: 'Nome',
          align: 'start',
          sortable: false,
          value: 'nome',
        },
        { text: 'Valor', value: 'valor' },
        { text: 'Data', value: 'data' }
      ],
      search: null,
      pdfPath: null,
      total: 0.00,
      entradas: 0.00,
      saidas: 0.00,
    }
  },
  created() {
    let self = this;
    window.api.on('pdfJson', (json) => {
      let data = JSON.parse(json);
      // console.log(data);
      self.total = data.total;
      self.entradas = data.entradas;
      self.saidas = data.saidas;
      self.transacoes = data.transacoes;
      self.loading = false;
      self.agruparTransacoes(data.transacoes, 1);
      self.agruparTransacoes(data.transacoes, 0);
      // console.log('completou');
    });
  },
  methods: {
    dinheiro,
    minimizar() { window.api.send('minimizar') },
    fechar() { window.api.send('fechar') },
    maximizar() { window.api.send('maximizar') },
    converterPdfParaJson() {
      this.loading = true;
      let dirtorio = ''

      if (this.pdfPath) {
        console.log(this.pdfPath.path)
        dirtorio = this.pdfPath.path
        window.api.send('converterPdfParaJson', dirtorio);
      } else {
        this.loading = false;
        alert('Arquivo não encontrado')
      }
    },
    agruparTransacoes(transacoes, tipo = "1") {
      let result = transacoes.reduce((key, obj) => {
        if (obj.tipo == tipo) return key;
        let findObj = key.find(x => x.nome === obj.nome);
        if (findObj) {
            findObj.datas.push({ valor: obj.valor, data: obj.data });
            findObj.total += obj.valor;
        } else key.push({ nome: obj.nome, total: obj.valor, datas: [{ valor: obj.valor, data: obj.data }] });
        return key;
      }, []);

      if (tipo == "1") {
        let agrupadas = [...new Set(result)];
        this.transacoesAgrupadas = agrupadas

        let datas = transacoes.map(obj => obj.data);
        let datasUnicas = [...new Set(datas)];

        this.diasAgrupadas = datasUnicas
      } else {
        let agrupadas = [...new Set(result)];
        this.transacoesAgrupadasEntradas = agrupadas
      }

    },
    cor(tipo) {
      if (tipo == 1) return 'green--text'
      // else return 'red--text'
    },
  }
}
</script>
