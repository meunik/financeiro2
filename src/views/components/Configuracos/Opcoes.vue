<template>
  <div>
    <v-card class="mx-auto mt-5 d-sm-flex">
      <v-card-text>
        <p class="text-h5 text--primary">{{ titulo }}</p>
        <div><span class="purple--text">{{ count }}</span> {{ subTitulo }}</div>
      </v-card-text>
      <v-card-actions class="d-flex flex-sm-column justify-sm-center">
        <v-btn text color="teal accent-4" :loading="loading" @click="reveal = true" v-if="!count">Buscar</v-btn>
        <v-btn text color="primary accent-4" :loading="loading" @click="reveal = true" v-else>Atualizar</v-btn>
        <v-btn text color="primary accent-4" :loading="loading" @click="listar()" v-if="exibeListar">Listar</v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card v-if="reveal" class="transition-fast-in-fast-out v-card--reveal h-100 d-flex flex-column justify-content-between">
          <v-card-text class="pb-0 mb-0">
            <p class="f-15 font-bold text--primary mb-0">{{ textoCerteza }}</p>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn text color="red accent-4" :loading="loading" @click="reveal = false">Não</v-btn>
            <v-btn text color="teal accent-4" :loading="loading" @click="salvar()">Sim</v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { Model } from "@/store/Model"

export default {
  mixins: [Model],
  props: {
    titulo: {
      type: String,
      default: ''
    },
    subTitulo: {
      type: String,
      default: ''
    },
    textoCerteza: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    },
    salvar: {
      required: true,
      type: Function
    },
    listar: {
      required: true,
      type: Function
    },
    exibeListar: {
      type: Boolean
    },
  },
  data() {
    return {
      reveal: false,
    }
  },
  methods: {
    // salvar() {
    //   console.log('salvar');
    // },
    // listar() {
    //   console.log('listar');
    // },
  }
};
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
    