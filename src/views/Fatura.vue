<template>
  <div>
    <div v-if="btnConverter">
      <v-file-input class="mt-2" label="Arquivo" v-model="pdfPath"></v-file-input>
      <v-btn color="secondary" @click="converterPdfParaJson()">
        <v-icon left>mdi-file-send</v-icon>
        Converter
      </v-btn>
      <v-divider class="mt-5"></v-divider>
    </div>

    <h1 class="mt-2">Fatura</h1>
    <div v-if="arquivo">
      <v-icon class="mb-3" left>mdi-arrow-right-bottom</v-icon>
      
      <v-breadcrumbs class="d-contents" :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item href="#" :disabled="item.disabled" @click="abrirSheet(item.arquivo)">
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <!-- <span class="grey--text">{{arquivo}}</span> -->
      
      <v-btn icon plain color="red" class="mb-1" @click="fecharFatura">
        <v-icon class="mx-0 red--text">mdi-file-remove</v-icon>
      </v-btn>
    </div>

    <v-btn v-if="transacoes.length > 0" class="mt-5" color="green" @click="exportJson()" :loading="loading">
      <!-- <v-icon left>mdi-invoice-export-outline</v-icon> -->
      <v-icon left>mdi-table-arrow-right</v-icon>
      Exportar
    </v-btn>

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
    <FaturaAgrupada v-if="transAgrup.length && !loading" :items="transAgrup" :datas="diasAgrupadas"/>
    <GraficosFatura v-if="transAgrup.length && !loading" :items="transAgrup" />
  </div>
</template>

<script>
import FaturaAgrupada from '@/views/FaturaAgrupada.vue'
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
      require: true,
      type: Object|Array
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
          value: 'nome',
        },
        { text: 'Valor', value: 'valor' },
        { text: 'Data', value: 'data' },
        { text: 'Tipo', value: 'tipo' },
      ],
      search: null,
      pdfPath: null,
    }
  },
  created() {
    let self = this;
    console.log(this.faturaDados);
    window.api.on('arquivoSalvo', (arquivo) => {
      self.notificacao(arquivo, 'success');
    });
  },
  computed: {
    vencimento() { return this.faturaDados.vencimento },
    referencia() { return this.faturaDados.referencia },
    arquivo() { return this.faturaDados.name },
    path() { return this.faturaDados.path },
    total() { return this.faturaDados.total },
    pagamentos() { return this.faturaDados.pagamentos },
    estornos() { return this.faturaDados.estornos },
    entradas() { return this.faturaDados.entradas },
    saidas() { return this.faturaDados.saidas },
    transacoes() { return this.faturaDados.transacoes },
    transAgrup() { return this.agruparTransacoes(this.faturaDados.transacoes, 1) },
    transAgrupEntradas() { return this.agruparTransacoes(this.faturaDados.transacoes, 0) },
    breadcrumbs() {
      return [
        {
          text: this.faturaDados.referencia,
          disabled: false,
          arquivo: 0,
        },
        {
          text: this.faturaDados.name,
          disabled: true,
          arquivo: 1,
        },
      ]
    },
  },
  methods: {
    dinheiro,
    fecharFatura() { this.$emit('fecharFatura', false); },
    abrirSheet(arquivo) { if (!arquivo) this.$emit('abrirSheet', true); },
    exportJson() { window.api.send('exportarXlsx', this.transacoes) },
    atualizarDados(arquivo, btn=false) {
      // this.arquivo = arquivo.name;
      // this.btnConverter = btn;
    },
    converterPdfParaJson() {
      this.loading = true;
      let dirtorio = ''

      if (this.pdfPath) {
        dirtorio = this.pdfPath.path
        window.api.send('fatura', dirtorio);
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
        let datas = transacoes.map(obj => obj.data);
        let datasUnicas = [...new Set(datas)];
        this.diasAgrupadas = datasUnicas
        return agrupadas
      } else {
        let agrupadas = [...new Set(result)];
        return agrupadas
      }

    },
    cor(tipo) {
      if (tipo == 1) return 'green--text'
      // else return 'red--text'
    },
  }
}
</script>
