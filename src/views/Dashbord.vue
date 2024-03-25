<template>
  <div>
    Dashbord
  </div>
</template>

<script>
import { Model } from "@/store/Model";
import moment from 'moment';

export default {
  mixins: [Model],
  data() {
    return {
      agrupadoPorDescricao: [],
      agrupadoPorTitle: [],
      agrupadoPorMesAno: []
    }
  },
  created() {

    this.agruparPorTitle();
    this.agruparPorMesAno();

    // console.log(this.agrupadoPorTitle);
    // console.log(this.agrupadoPorMesAno);
    // console.log(JSON.parse(JSON.stringify(this.agrupadoPorTitle)));
    console.log(JSON.parse(JSON.stringify(this.agrupadoPorMesAno)));

    console.log(JSON.parse(JSON.stringify(this.gastosCartao[0])));
  },
  methods: {
    seila() {
      // Definir o período de data
      const startDate = moment('01-01-2022', 'DD-MM-YYYY');
      const endDate = moment('31-12-2022', 'DD-MM-YYYY');

      const filteredData = data.filter(item => {
        const itemDate = moment(item.time);
        return itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate);
      });

      // Agrupar por description
      const groupByDescription = filteredData.reduce((result, item) => {
        (result[item.description] = result[item.description] || []).push(item);
        return result;
      }, {});

      console.log(groupByDescription);
    },
    agruparPorDescricao() {
      this.agrupadoPorDescricao = this.gastosCartao.reduce((result, item) => {
        (result[item.description] = result[item.description] || []).push(item);
        return result;
      }, {});
    },
    agruparPorTitle() {
      this.agrupadoPorTitle = this.gastosCartao.reduce((result, item) => {
        (result[item.title] = result[item.title] || []).push(item);
        return result;
      }, {});
    },
    agruparPorMesAno() {
      this.agrupadoPorMesAno = this.gastosCartao.reduce((result, item) => {
        const mesAno = moment(item.time).format('YYYY-MM');
        (result[mesAno] = result[mesAno] || []).push(item);
        return result;
      }, {});
    },
  }
}
</script>