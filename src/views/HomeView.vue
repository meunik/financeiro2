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

    <v-file-input label="File input" v-model="pdfPath"></v-file-input>
    
    <v-btn @click="converterPdfParaJson()">
      <v-icon left>mdi-file-send</v-icon>
      Converter
    </v-btn>

    <div class="my-5">
      Valor Total {{ dinheiro(total) }}
    </div>
    <div class="my-5">
      Entradas: {{ dinheiro(entradas) }}
    </div>
    <div class="my-5">
      Saidas {{ dinheiro(saidas) }}
    </div>
    <div class="my-5">
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
          class="elevation-1"
        >
          <template v-slot:item.valor="{ item }">
            <span :class="cor(item.tipo)">
              {{ dinheiro(item.valor) }}
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
      console.log('completou');
    });
  },
  methods: {
    converterPdfParaJson() {
      let dirtorio = ''

      if (this.pdfPath) {
        console.log(this.pdfPath.path)
        dirtorio = this.pdfPath.path
        window.api.send('converterPdfParaJson', dirtorio);
      } else alert('Arquivo não encontrado')
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
