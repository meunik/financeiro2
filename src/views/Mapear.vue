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

    <v-divider class="mt-5"></v-divider>

    <div v-if="btnConverter">
      <!-- <v-file-input class="mt-2" label="Arquivo" v-model="pdfPath"></v-file-input> -->

      <!-- Gerar Certificado -->
      <v-btn class="mt-2" color="secondary" @click="dialogCpfSenha = true">
        <v-icon left>mdi-file-send</v-icon>
        Gerar Certificado
      </v-btn>


      <!-- <v-btn class="mt-2 ml-2" color="#c5431e" @click="salvarGastosCartao()">
        <v-icon left>mdi-file-send</v-icon>
        busca fatura
      </v-btn>

      <v-btn class="mt-2 ml-2" color="#c5431e" @click="listarGastosCartao()">
        <v-icon left>mdi-file-send</v-icon>
        listarGastosCartao
      </v-btn> -->

      <v-btn class="mt-2 ml-2" color="#c5431e" @click="salvarFaturasCartao()">
        <v-icon left>mdi-file-send</v-icon>
        salvarFaturasCartao
      </v-btn>

      <v-btn class="mt-2 ml-2" color="#c5431e" @click="listarfaturasCartao()">
        <v-icon left>mdi-file-send</v-icon>
        listarfaturasCartao
      </v-btn>

      <!-- <v-btn class="mt-2 ml-2" color="#c5431e" @click="salvarTransacoes()">
        <v-icon left>mdi-file-send</v-icon>
        salvarTransacoes
      </v-btn> -->
      <v-divider class="mt-5"></v-divider>
    </div>

    <v-dialog v-model="dialog" persistent max-width="300px">
      <v-card>
        <v-card-title class="text-h5">
          Selecione o conversor
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list dense class="pa-0">
            <!-- <v-subheader>REPORTS</v-subheader> -->
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

    <v-dialog v-model="dialogCpfSenha" persistent max-width="300px">
      <v-card>
        <v-card-title class="text-h5">
          Gerar Certificado
        </v-card-title>
        <v-card-text>
          
          <v-text-field
            label="Digite seu CPF"
            v-model="cpf"
            hint="Somente os números"
            type="number"
          ></v-text-field>
          <v-text-field
            v-model="senha"
            :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
            :type="mostrarSenha ? 'text' : 'password'"
            label="Senha"
            counter
            @click:append="mostrarSenha = !mostrarSenha"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogCpfSenha = false">Fechar</v-btn>
          <v-btn color="green darken-1" text :disabled="(cpf && senha)?false:true" @click="scriptCertificado()">enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCodigo" persistent max-width="350px">
      <v-card>
        <v-card-title class="text-h5">Código de acesso</v-card-title>
        <v-card-text>
          <v-subheader v-if="codigoEmail" class="px-0 flex-wrap">
            <span class="white-space-nowrap">Enviado para:</span>
            <span class="ml-1 primary--text">{{ codigoEmail }}</span>
          </v-subheader>
          <v-subheader v-else class="px-0">
            <span class="white-space-nowrap">Enviado email</span>
            <v-progress-linear class="ml-2" color="primary" indeterminate rounded height="6"></v-progress-linear>
          </v-subheader>
          <v-subheader class="px-0 mb-2">Digite o código recebido por e-mail:</v-subheader>
          <v-otp-input v-model="codigo" :length="codLength" dark></v-otp-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancelScriptCodigo()">Fechar</v-btn>
          <v-btn color="green darken-1" text :disabled="!isActive" @click="scriptCertificadoCodigo()">enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FaturaImport
      v-if="fatura"
      :faturaDados="faturaDados"
      ref="faturaRef"
      @abrirSheet="sheet = $event"
      @fecharFatura="fatura = $event"
    />
  </div>
</template>

<script>
import FaturaImport from '@/views/components/Fatura/FaturaImport.vue'
import Icone from '@/assets/icones/Icone.vue'
import { Model } from "@/store/Model"
import gastosCartao from '@raiz/database/json/nubank/GastosCartao.json'
import faturasCartao from '@raiz/database/json/nubank/FaturasCartao.json'
 
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
      
      btnConverter: true,
      pdfPath: null,

      dialogCpfSenha: false,
      cpf: '',
      senha: '',
      mostrarSenha: false,
      dialogCodigo: false,
      codigoEmail: null,
      codigo: '',
      codLength: 6,

      gastosCartao: gastosCartao,
      faturasCartao: faturasCartao,
    }
  },
  created() {
    window.api.on('dialogCodigo', (email, abredialogCodigo) => {
      if (abredialogCodigo) {
        this.codigoEmail = (email.length > 2) ? email : null;
        this.dialogCodigo = true;
      } else this.cancelScriptCodigo();
    });


    window.api.on('buscaDiretorio', ({dados}) => {
      if (dados.length) this.mapaDir = dados[0].diretorio;
      else this.mapaDir = dados.diretorio;
    });
    window.api.on('listarArquivos', ({dados}) => {
      dados.sort((a, b) => a.name.localeCompare(b.name));
      this.mapa = dados;
      this.notificacao('Ataulizado', null, 2000);
    });

    // APAGAR
    window.api.on('buscarRetorno', ({dados}) => {
      // console.log(dados);
      this.dados = dados;
    });

    window.api.on('exibeFaturaImportada', ({dados, transportar}) => {
      this.dialog = false;
      this.sheet = false;
      let doc = transportar[0];
      let dado = dados.filter(v => (v.path == doc.path));
      this.faturaDados = dado[0];
      this.fatura = true;
      this.loading = false;
    });
    window.api.on('mapeado', (mapa) => {
      this.mapa = mapa;
      this.sheet = true;
      this.loading = false;
      this.notificacao('Ditrório atualizado', 'success', 2000);
    });
    window.api.on('faturaMultRetorno', async (separados, agrupados) => {
      // this.restaComponetes();
      // this.dialog = false;
      // this.sheet = false;
      // this.multFatura = true;
      // if (this.$refs.multFaturaRef) this.$refs.multFaturaRef.atualizarDados(this.selection);
    });

    window.api.send('buscarArquivosDiretorio');
    window.api.send('buscarArquivos');
  },
  computed: {
    isActive() { return this.codigo.length === this.codLength },
  },
  methods: {
    listarGastosCartao() {
      console.log(this.gastosCartao);
      // console.log(JSON.parse(JSON.stringify(this.gastosCartao)));
    },
    listarfaturasCartao() {
      // console.log(this.faturasCartao);
      console.log(JSON.parse(JSON.stringify(this.gastosCartao)));
      console.log(JSON.parse(JSON.stringify(this.faturasCartao)));
    },
    salvarFaturasCartao() {
      this.loading = true;
      window.api.send('salvarFaturasCartao');
    },
    // salvarTransacoes() {
    //   this.loading = true;
    //   window.api.send('salvarTransacoes');
    // },
    salvarGastosCartao() {
      this.loading = true;
      window.api.send('salvarGastosCartao');
    },
    scriptCertificado() {
      this.dialogCpfSenha = false;
      this.dialogCodigo = true;
      this.loading = true;
      window.api.send('certificadoNubank', { cpf: this.cpf, senha: this.senha });
    },
    cancelScriptCodigo() {
      this.loading = false;
      this.dialogCodigo = false;
      this.cpf = '';
      this.senha = '';
      this.codigoEmail = '';
    },
    scriptCertificadoCodigo() {
      this.loading = true;
      this.dialogCodigo = false;
      window.api.send('certificadoNubankCodigo', this.codigo);
    },
    async atualizarArquivos() {
      this.loading = true;
      await window.api.send('atualizarArquivos', this.mapaDir)
      this.codigo = '';
    },
    listarArquivos:() => window.api.send('mapear'),
    atualizarBaseDados () {
      this.loading = true;
      window.api.send('addBaseDados', this.selection)
    },

    // cadastrar:() => window.api.send('cadastrar', { name: 'Nome do Usuário', age: 20 }),
    // buscar:() => window.api.send('buscar', { eventTxt: 'buscarRetorno' }),
    // editar:() => window.api.send('editar', { get: { age: 20 }, set: { $set: { age: 21 } }}),
    // remover:() => window.api.send('remover', { get: { _id: "mqplMF2WnAmyOoJu" } }),
    // zerar:() => window.api.send('zerar'),

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
    abrirDialog(item) {
      let extensao = item[0].file.toLowerCase()
      switch (extensao) {
        case 'pdf':
          this.dialogItemsExibir = this.dialogItems.pdf.map(obj => ({ ...obj, item: item }));
          this.dialog = true;
          break;

        default: break;
      }
    },
    abrirFaturaImportada(item, tipo) {
      this.restaComponetes()
      this.loading = true;
      this.dialog = false;
      this.sheet = false;
      if (item.length == 0) return null;
      this.dirtorio = item[0].caminho;
      let extensao = item[0].file.toLowerCase()
      switch (tipo) {
        case 'Nubank':
          this.fatura = true;
          this.$refs.faturaRef.atualizarDados(item[0])
          window.api.send('fatura', this.dirtorio);
          break;

        default: break;
      }
    },
    async abrir(item, tipo) {
      this.restaComponetes()
      this.loading = true;
      window.api.send('buscarFaturaImportada', { eventTxt: 'exibeFaturaImportada', transportar: item });
    },
  }
}
</script>
