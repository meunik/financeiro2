<template>
  <div :class="`d-flex align-items-center ${(!!$slots.default)?'gap-1':''} ${classesDiv}`">
    <div :class="`${(completo)?'':'overflow-x-three-points'} ${classesSegundaDiv}`">
      <component
        v-if="componente"
        :is="componente"
        :tamanho="tamanho"
        :rotate="rotate"
        :estilo="`${estilo}`"
        :ativo="ativo"
        :cor="cor"
        :class="`${(!!$slots.default)?'m-icon':''} ${classesIcone} d-flex align-items-center`"
      />
      <span :class="`${(!!$slots.default)?'d-contents':''} ${classesSpan}`"><slot></slot></span>
    </div>
  </div>
</template>

<script>
  import Bootstrap from '@/assets/icones/stacks/Bootstrap.vue';
  import Css3 from '@/assets/icones/stacks/Css3.vue';
  import MySqlSvg from '@/assets/icones/stacks/MySqlSvg.vue';
  import Php from '@/assets/icones/stacks/Php.vue';
  import Postman from '@/assets/icones/stacks/Postman.vue';
  import React from '@/assets/icones/stacks/React.vue';
  import Tailwind from '@/assets/icones/stacks/Tailwind.vue';
  import TypeScript from '@/assets/icones/stacks/TypeScript.vue';
  import Vue from '@/assets/icones/stacks/Vue.vue';
  import Docker from '@/assets/icones/stacks/Docker.vue';
  import Figma from '@/assets/icones/stacks/Figma.vue';
  import GitStack from '@/assets/icones/stacks/GitStack.vue';
  import Html5 from '@/assets/icones/stacks/Html5.vue';
  import JavaScript from '@/assets/icones/stacks/JavaScript.vue';
  import Jquery from '@/assets/icones/stacks/Jquery.vue';
  import Laravel from '@/assets/icones/stacks/Laravel.vue';
  import Linux from '@/assets/icones/stacks/Linux.vue';

  import Nubank from '@/assets/icones/svg/Nubank.vue';
  import Bradesco from '@/assets/icones/svg/Bradesco.vue';
  import Itau from '@/assets/icones/svg/Itau.vue';
  import Rico from '@/assets/icones/svg/Rico.vue';
  import Santander from '@/assets/icones/svg/Santander.vue';
  import Xp from '@/assets/icones/svg/Xp.vue';

  export default {
    props: {
      icone: {
        type: String,
        default: '',
      },
      tamanho: {
        type: Number,
        default: null,
      },
      completo: {
        type: Boolean,
        default: true,
      },
      rotate: {
        type: Number,
        default: 0,
      },
      estilo: {
        type: String,
        default: "",
      },
      ativo: {
        type: Boolean,
        default: false,
      },
      cor: {
        type: String,
      },
      classesDiv: {
        type: String,
        default: "",
      },
      classesSegundaDiv: {
        type: String,
        default: "",
      },
      classesSpan: {
        type: String,
        default: "",
      },
      classesIcone: {
        type: String,
        default: "",
      },
    },
    components: {
      Bootstrap,
      Css3,
      MySqlSvg,
      Php,
      Postman,
      React,
      Tailwind,
      TypeScript,
      Vue,
      Docker,
      Figma,
      GitStack,
      Html5,
      JavaScript,
      Jquery,
      Laravel,
      Linux,

      Nubank,
      Bradesco,
      Itau,
      Rico,
      Santander,
      Xp,
    },
    computed: {
      componente() {
        // definir caso queira definir um nome diferente do nome do componente
        switch (this.icone.toLowerCase()) {
        
          default: return this.icone;
        }
      }
    }
  };
</script>

<style>
  .m-icon {
    margin-right: 4px;
    margin-bottom: 2px;
  }
</style>