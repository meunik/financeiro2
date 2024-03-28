<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  props: {
    items: {
      require: true,
      type: Array
    },
    tipo: {
      type: String
    },
    cor: {
      type: [String, Array],
      default: null
    },
    entrada: {
      type: Number
    },
    tratarNumero: {
      type: Function,
      default: null
    },
    legend: {
      type: Boolean,
      default: false
    },
    eixo: {
      type: String,
      default: 'x'
    },
    escalaX: {
      type: Boolean,
      default: false
    },
    escalaY: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      coresSaidas: [
        '#F44336',
        '#FFEBEE',
        '#FFCDD2',
        '#EF9A9A',
        '#E57373',
        '#EF5350',
        '#E53935',
        '#D32F2F',
        '#C62828',
        '#B71C1C',
        '#FF8A80',
        '#FF5252',
        '#FF1744',
        '#D50000',
        '#E91E63',
        '#FCE4EC',
        '#F8BBD0',
        '#F48FB1',
        '#F06292',
        '#EC407A',
        '#D81B60',
        '#C2185B',
        '#AD1457',
        '#880E4F',
        '#FF80AB',
        '#FF4081',
        '#F50057',
        '#C51162',
        '#9C27B0',
        '#F3E5F5',
        '#E1BEE7',
        '#CE93D8',
        '#BA68C8',
        '#AB47BC',
        '#8E24AA',
        '#7B1FA2',
        '#6A1B9A',
        '#4A148C',
        '#EA80FC',
        '#E040FB',
        '#D500F9',
        '#AA00FF'
      ],
      coresEntradas: [
        '#009688',
        '#E0F2F1',
        '#B2DFDB',
        '#80CBC4',
        '#4DB6AC',
        '#26A69A',
        '#00897B',
        '#00796B',
        '#00695C',
        '#004D40',
        '#A7FFEB',
        '#64FFDA',
        '#1DE9B6',
        '#00BFA5',
        '#4CAF50',
        '#E8F5E9',
        '#C8E6C9',
        '#A5D6A7',
        '#81C784',
        '#66BB6A',
        '#43A047',
        '#388E3C',
        '#2E7D32',
        '#1B5E20',
        '#B9F6CA',
        '#69F0AE',
        '#00E676',
        '#00C853',
        '#8BC34A',
        '#F1F8E9',
        '#DCEDC8',
        '#C5E1A5',
        '#AED581',
        '#9CCC65',
        '#7CB342',
        '#689F38',
        '#558B2F',
        '#33691E',
        '#CCFF90',
        '#B2FF59',
        '#76FF03',
        '#64DD17'
      ]
    }
  },
  watch: {
    items() {
      this.atualizar();
    }
  },
  mounted() {
    window.addEventListener('resize', this.atualizar);
    this.createChart();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.atualizar);
  },
  computed: {
    bgCor() {
      let cor = null;
      if (this.cor == 'green') cor = this.coresEntradas;
      if (this.cor == 'red') cor = this.coresSaidas;
      if (Array.isArray(this.cor)) cor = this.cor;
      return cor;
    },
    nomes() { return this.items.map(obj => obj.nome); },
    totais() { return this.items.map(obj => obj.total); }
  },
  methods: {
    moedaLabel(context) {
      let txt = context.label;
      let valor = context.raw;
      let formattedValue = context.formattedValue;
      let total = context.dataset.data.reduce((result, item) => result + item, 0);
      let porcentagem = (valor / total) * 100;
      if (!this.tratarNumero) return `${txt}: ${formattedValue} - ${porcentagem.toFixed(0)}%`;
      return `${txt}: ${this.tratarNumero(valor)} - ${porcentagem.toFixed(0)}%`;
    },
    estalaTextoX(value, index, values) {
      return this.nomes[index];
    },
    atualizar() {
      if (this.chart) this.chart.destroy();
      this.createChart();
    },
    createChart() {
      const ctx = this.$refs.canvas.getContext('2d');

      this.chart = new Chart(ctx, {
        type: this.tipo,
        data: {
          labels: this.nomes,
          datasets: [{
            label: 'Despesas',
            data: this.totais,
            backgroundColor: this.bgCor,
            // backgroundColor: [ '#ff6384', '#36a2eb', '#cc65fe', '#ffce56' ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          indexAxis: this.eixo, // fica vertical
          scales: {
            x: {
              display: this.escalaX,
              ticks: {
                callback: this.estalaTextoX
              },
            },
            y: {
              display: this.escalaY,
              ticks: {
                callback: this.tratarNumero
              },
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: this.moedaLabel
              }
            },
            legend: {
              display: this.legend
            },
          }
          
        }
      });
    }
  }
}
</script>
