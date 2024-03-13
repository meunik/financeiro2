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
        
          <v-spacer></v-spacer>

          <v-btn @click="listarArquivos()">
            <v-icon left>mdi-file-send</v-icon>
            Remapear
          </v-btn>
        </v-subheader>

        <template>
          <v-treeview
            :active.sync="active"
            class="my-10"
            v-model="tree"
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

    <v-btn v-else @click="listarArquivos()">
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
      tiles: [
        { img: 'keep.png', title: 'Keep' },
        { img: 'inbox.png', title: 'Inbox' },
        { img: 'hangouts.png', title: 'Hangouts' },
        { img: 'messenger.png', title: 'Messenger' },
        { img: 'google.png', title: 'Google+' },
      ],

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
      tree: [],
    }
  },
  created() {
    let self = this;
    window.api.on('mapeado', (json) => {
      self.mapa = json;
      self.sheet = true;
    });
  },
  methods: {
    listarArquivos() { window.api.send('mapear') },
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
          window.api.send('converterPdfParaJson', this.dirtorio);
          break;

        default: break;
      }
    },
  }
}
</script>
