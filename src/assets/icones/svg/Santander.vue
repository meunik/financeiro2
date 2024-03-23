<template>
  <svg
    :width="(tamanho)?tamanho:padrao"
    :height="(tamanho)?tamanho:padrao"
    viewBox="0 0 500 478"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :class="`icone icone-menu-vscode ${(ativo)?'ativo':''}`"
    :style="`transform: rotate(${rotate}deg);${estilo}`"
  >
    <path fill-rule="evenodd" clip-rule="evenodd" d="M358.355 218.868C357.61 201.654 352.815 184.57 343.94 169.127L265.657 32.9282C259.687 22.546 255.564 11.4151 253.271 0L250.003 5.69249C230.623 39.4029 230.623 80.935 250 114.649L312.626 223.608C332.003 257.322 332.003 298.854 312.626 332.564L309.355 338.257C307.066 326.845 302.94 315.714 296.97 305.325L203.03 141.888C197.064 131.502 192.937 120.371 190.648 108.96L187.377 114.652C168.066 148.249 168.007 189.614 187.184 223.264L187.181 223.267L250.003 332.568C269.377 366.278 269.377 407.814 250.003 441.527L246.729 447.216C244.439 435.805 240.317 424.674 234.347 414.288L156.064 278.09C145.565 259.819 140.766 239.258 141.645 218.888C57.8446 240.876 0 287.576 0 341.646C0 416.869 111.932 477.845 250.003 477.845C388.071 477.845 500 416.869 500 341.646C500 287.576 442.162 240.863 358.355 218.868V218.868Z" :fill="`${cor}`"/>
  </svg>
</template>

<script>
export default {
  props: {
    tamanho: {
      type: Number,
      default: 20,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    estilo: {
      type: String,
      default: '',
    },
    ativo: {
      type: Boolean,
      default: false,
    },
    cor: {
      type: String,
      default: '#FF0000',
    },
  },
  data() {
    return {
      padrao: 20,
    }
  },
};
</script>