<template>
  <v-container>
    <v-switch
        v-model="$vuetify.theme.dark"
        inset
        label="Dark Mode"
        persistent-hint
      ></v-switch>

    <v-btn class="mb-2" color="orange darken-2">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-divider class="mb-10"></v-divider>

    <v-file-input label="Arquivo" v-model="pdfPath"></v-file-input>
    
    <v-btn @click="converterPdfParaJson()">
      <v-icon left>mdi-file-send</v-icon>
      Converter
    </v-btn>

    <v-row class="my-5">
      <v-col>
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="secondary" elevation="5" rounded shaped>Valor Total: {{ dinheiro(total) }}</v-banner>
      </v-col>
      <v-col>
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="secondary" elevation="5" rounded shaped>Entradas: <span class="green--text">{{ dinheiro(entradas) }}</span></v-banner>
      </v-col>
      <v-col>
        <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
        <v-banner v-else color="secondary" elevation="5" rounded shaped>Saidas: <span class="red--text">{{ dinheiro(saidas) }}</span></v-banner>
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
  </v-container>
</template>

<script>
import HelloWorld from '../components/HelloWorld'

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      loading: false,
      checkboxGroupBy: false,
      groupBy: null,
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
      console.log(data);
      self.total = data.total;
      self.entradas = data.entradas;
      self.saidas = data.saidas;
      self.transacoes = data.transacoes;
      self.loading = false;
      console.log('completou');
    });
  },
  methods: {
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
    dinheiro(numero) {
      return "R$ " + numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    },
    cor(tipo) {
      if (tipo == 1) return 'green--text'
      // else return 'red--text'
    },
  }
}
</script>
