<template>
  <div>
    <div v-if="btnConverter">
      <v-file-input class="mt-2" label="Arquivo" v-model="pdfPath"></v-file-input>
      <v-btn @click="converterPdfParaJson()">
        <v-icon left>mdi-file-send</v-icon>
        Converter
      </v-btn>
      <v-divider class="mt-5"></v-divider>
    </div>

    <h1 class="mt-2">Fatura</h1>
    <div v-if="arquivo">
      <v-icon class="mb-3" left>mdi-arrow-right-bottom</v-icon>
      <span class="grey--text">{{arquivo}}</span>
      
      <v-btn icon plain color="red" class="mb-1" @click="removerArquivo">
        <v-icon class="mx-0 red--text">mdi-file-remove</v-icon>
      </v-btn>
    </div>

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
          <template v-slot:item.tipo="{ item }">
            <span :class="cor(item.tipo)">
              {{ (item.tipo == 1)?'Entrada':'Saida' }}
            </span>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-skeleton-loader v-if="loading" type="table-tfoot"></v-skeleton-loader>
    <v-skeleton-loader v-if="loading" class="my-5" type="image"></v-skeleton-loader>
    <FaturaAgrupada v-if="transacoesAgrupadas.length > 0" :items="transacoesAgrupadas" :datas="diasAgrupadas"/>
    <GraficosFatura v-if="transacoesAgrupadas.length > 0" :items="transacoesAgrupadas" />
  </div>
</template>

<script>
import FaturaAgrupada from '@/views/FaturaAgrupada.vue'
import GraficosFatura from '@/components/Graficos/GraficosFatura.vue'
import { dinheiro } from '@/Utils/Converter'

export default {
  components: {
    FaturaAgrupada,
    GraficosFatura,
  },
  data() {
    return {
      loading: false,
      btnConverter: true,
      arquivo: '',
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
        { text: 'Data', value: 'data' },
        { text: 'Tipo', value: 'tipo' },
      ],
      search: null,
      pdfPath: null,
      total: 0.00,
      pagamentos: 0.00,
      estornos: 0.00,
      entradas: 0.00,
      saidas: 0.00,
    }
  },
  created() {
    let self = this;
    window.api.on('pdfJson', (json) => {
      let data = JSON.parse(json);
      self.total = data.total;
      self.pagamentos = data.pagamentos;
      self.estornos = data.estornos;
      self.entradas = data.entradas;
      self.saidas = data.saidas;
      self.transacoes = data.transacoes;
      self.loading = false;
      self.agruparTransacoes(data.transacoes, 1);
      self.agruparTransacoes(data.transacoes, 0);
    });
  },
  methods: {
    dinheiro,
    minimizar() { window.api.send('minimizar') },
    fechar() { window.api.send('fechar') },
    maximizar() { window.api.send('maximizar') },
    removerArquivo() {
      this.loading = false;
      this.btnConverter = true;
      this.arquivo = '';
      this.checkboxGroupBy = false;
      this.groupBy = null;
      this.diasAgrupadas = [];
      this.transacoesAgrupadasEntradas = [];
      this.transacoesAgrupadas = [];
      this.transacoes = [];
      this.search = null;
      this.pdfPath = null;
      this.total = 0.00;
      this.pagamentos = 0.00;
      this.estornos = 0.00;
      this.entradas = 0.00;
      this.saidas = 0.00;
    },
    atualizarDados(load, arquivo, btn=false) {
      this.loading = load;
      this.arquivo = arquivo.name;
      this.btnConverter = btn;
    },
    converterPdfParaJson() {
      this.loading = true;
      let dirtorio = ''

      if (this.pdfPath) {
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
