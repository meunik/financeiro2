<template>
  <div>
    <v-bottom-sheet v-if="mapa.length > 0" v-model="sheet">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="purple" dark v-bind="attrs" v-on="on">
          <v-icon left>mdi-folder</v-icon>
          Pastas
        </v-btn>
      </template>
      <v-list>
        <v-subheader>
          <h3>Pastas</h3>

          <v-btn v-if="selection.length" color="accent" class="ml-3" @click="mult()">
            <v-icon left>mdi-file-send</v-icon>
            Mult
          </v-btn>
        
          <v-spacer></v-spacer>

          <v-btn color="secondary" @click="listarArquivos()">
            <v-icon left>mdi-file-send</v-icon>
            Remapear
          </v-btn>
        </v-subheader>
        <!-- <template v-if="!selection.length">No nodes selected.</template>
        <template v-else>
          <div v-for="node in selection" :key="node.id">{{ node.name }}</div>
        </template> -->

        <template>
          <v-treeview
            :active.sync="active"
            selectable
            class="my-10"
            v-model="selection"
            :items="mapa"
            activatable
            item-key="caminho"
            return-object
            open-on-click
            @update:active="abrir"
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.file.toLowerCase()] }}
              </v-icon>
            </template>
          </v-treeview>
        </template>

      </v-list>
    </v-bottom-sheet>

    <v-btn v-else color="secondary" @click="listarArquivos()">
      <v-icon left>mdi-file-send</v-icon>
      Mapear
    </v-btn>

    <v-divider class="mt-5"></v-divider>

    <Fatura v-show="fatura" ref="faturaRef" />
  </div>
</template>

<script>
import Fatura from '@/views/Fatura.vue'

export default {
  components: {
    Fatura,
  },
  data() {
    return {
      sheet: false,
      selection: [],
      fatura: false,
      dirtorio: '',
      search: '',
      loading: false,
      mapa: [],
      active: [],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf-box',
        jpeg: 'mdi-image-filter-hdr',
        jpg: 'mdi-image-filter-hdr',
        png: 'mdi-image-filter-hdr',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-microsoft-excel',
        xlsx: 'mdi-microsoft-excel',
        xlsm: 'mdi-microsoft-excel',
      },
    }
  },
  created() {
    let self = this;
    window.api.on('mapeado', (json) => {
      self.mapa = json;
      self.sheet = true;
    });
    window.api.on('faturaMultRetorno', (json) => {
      console.log(json);
    });
  },
  methods: {
    listarArquivos() { window.api.send('mapear') },
    mult() { if (this.selection.length) window.api.send('faturaMult', this.selection) },
    restaComponetes() {
      this.fatura = false;
    },
    abrir(item) {
      this.restaComponetes()
      this.sheet = false;
      if (item.length == 0) return null;
      this.dirtorio = item[0].caminho;
      // let arquivo = JSON.parse(JSON.stringify(item[0]))
      // console.log(arquivo);
      switch (item[0].file.toLowerCase()) {
        case 'pdf':
          this.fatura = true;
          this.$refs.faturaRef.atualizarDados(true, item[0])
          window.api.send('fatura', this.dirtorio);
          break;

        default: break;
      }
    },
  }
}
</script>
