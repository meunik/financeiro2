<template>
  <div>
    <v-bottom-sheet v-if="mapa.length > 0" v-model="sheet" inset>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="purple" dark v-bind="attrs" v-on="on" :loading="loading">
          <v-icon left>mdi-folder</v-icon>
          Pastas
        </v-btn>
      </template>
      <v-list class="pt-0">
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        <v-subheader class="pt-5">
          <v-btn v-if="mapaDir" color="secondary" class="mr-2 px-2" @click="atualizarArquivos()" :loading="loading">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn color="secondary" @click="listarArquivos()" :loading="loading">
            <v-icon left>mdi-file-send</v-icon>
            Remapear
          </v-btn>
      
          <v-spacer></v-spacer>

          <v-row>
            <v-col class="py-1 flex-end">
              <v-btn v-if="selection.length" disabled color="accent" @click="mult()" :loading="loading">
                <v-icon left>mdi-file-send</v-icon>
                Mult
              </v-btn>
            </v-col>
            <v-col class="py-1 flex-end">
              <v-btn v-if="selection.length" color="deep-purple" @click="atualizarBaseDados()" :loading="loading">
                <v-icon left>mdi-database-import</v-icon>
                Atualizar Base de Dados
              </v-btn>
            </v-col>
          </v-row>
        </v-subheader>
        <v-subheader class="pt-5">
          <h3 class="pl-4">Selecione o(s) Arquivo(s)</h3>
        </v-subheader>

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

    <div v-else>
      <v-btn color="secondary" @click="listarArquivos()" :loading="loading">
        <v-icon left>mdi-file-send</v-icon>
        Mapear
      </v-btn>
    </div>

    <v-dialog v-model="dialog" persistent max-width="300px">
      <v-card>
        <v-card-title class="text-h5">
          Selecione o conversor
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list dense class="pa-0">
            <v-list-item-group v-model="selectedItem" color="primary">

              <v-list-item v-for="(item, i) in dialogItemsExibir" :key="i" @click="abrir(item.item, item.icon)">
                <v-list-item-icon class="mx-3"><Icone :icone="item.icon"/></v-list-item-icon>
                <v-list-item-content><v-list-item-title>{{item.text}}</v-list-item-title></v-list-item-content>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import FaturaImport from '@/views/components/Fatura/FaturaImport.vue'
import Icone from '@/assets/icones/Icone.vue'
import { Model } from "@/store/Model"
 
export default {
  mixins: [Model],
  components: {
    FaturaImport,
    Icone,
  },
  data() {
    return {
      dialog: false,
      selectedItem: null,
      dialogItemsExibir: [],
      dialogItems: {
        pdf: [
          { text: 'Fatura Nu', icon: 'Nubank' },
          // { text: 'Fatura Bradesco', icon: 'Bradesco' },
          // { text: 'Fatura Santander', icon: 'Santander' },
        ],
        jpg: [
          { text: 'Fatura Nu', icon: 'Nubank' },
          { text: 'Fatura Bradesco', icon: 'Bradesco' },
          { text: 'Fatura Santander', icon: 'Santander' },
        ],
      },

      sheet: false,
      fatura: false,
      faturaDados: {},
      multFatura: false,
      dirtorio: '',
      search: '',
      selection: [],
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
    window.api.on('buscaDiretorio', ({dados}) => {
      if (dados.length) this.mapaDir = dados[0].diretorio;
      else this.mapaDir = dados.diretorio;
    });
    window.api.on('listarArquivos', ({dados}) => {
      dados.sort((a, b) => a.name.localeCompare(b.name));
      this.mapa = dados;
      this.notificacao('Ataulizado', null, 2000);
    });
    window.api.on('mapeado', (dados) => {
      this.mapa = dados;
      this.sheet = true;
      this.loading = false;
      this.notificacao('Ditrório atualizado', 'success', 2000);
    });

    window.api.on('loadingOn', () => this.loading = true);
    window.api.on('loadingOff', () => this.loading = false);

    window.api.send('buscarArquivosDiretorio');
    window.api.send('buscarArquivos');
  },
  methods: {
    async atualizarArquivos() {
      this.loading = true;
      await window.api.send('atualizarArquivos', this.mapaDir)
    },
    listarArquivos:() => window.api.send('mapear'),
    atualizarBaseDados () {
      this.loading = true;;
      window.api.send('addBaseDados', this.selection)
    },
    buscarArquivos:() => window.api.send('buscarArquivos'),
    mult() {
      this.loading = true;
      console.log(this.selection);
      if (this.selection.length) window.api.send('faturaMult', this.selection)
    },
    restaComponetes() {
      this.fatura = false;
      this.multFatura = false;
    },
    async abrir(item, tipo) {
      this.$router.push("/faturaImport").catch(err => {});
      this.dialog = false;
      this.sheet = false;
      this.restaComponetes()
      this.loading = true;
      let id = item[0].id;
      window.api.send('buscarFaturaImportada', {
        get: { id: id },
        eventTxt: 'exibeFaturaImportada',
        transportar: item[0]
      });
    },
  }
}
</script>
