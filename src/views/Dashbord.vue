<template>
  <div>
    <template>
      <v-row class="mt-10">
        <v-col cols="12">
        <v-expansion-panels popout>

          <v-expansion-panel :class="systemBgClass">
            <v-expansion-panel-header>
              <span class="d-flex align-items-center gap-15"><Icone icone="nubank"/>Nubank</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content :class="systemBgClass">
              <template>
                <v-card>
                  <v-tabs dark background-color="purple darken-3" show-arrows v-model="tab">
                    <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                    <v-tab v-for="(item, key) in faturasCompletas" :key="key" :href="`#tab-${key}`">
                      {{ dataMes(item.bill.summary.due_date) }}
                    </v-tab>

                    <v-tabs-items v-model="tab">
                      <v-tab-item v-for="(item, key) in faturasCompletas" :key="key" :value="`tab-${key}`" class="px-5">
                        <Fatura :fatura-dados="item"/>
                      </v-tab-item>
                    </v-tabs-items>

                  </v-tabs>
                </v-card>
              </template>
                <Footer />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel :class="systemBgClass" active-class="mt-0">
            <v-expansion-panel-header>
              <span class="d-flex align-items-center gap-15"><Icone icone="santander"/>Santander</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content :class="systemBgClass">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { Model } from "@/store/Model";
import Icone from '@/assets/icones/Icone.vue';
import Fatura from '@/views/components/Fatura/Fatura.vue';
import Footer from "@/views/components/layout/Footer.vue"
import moment from 'moment';

export default {
  mixins: [Model],
  components: {
    Icone,
    Fatura,
    Footer,
  },
  data() {
    return {
      tab: null,
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
    console.log(JSON.parse(JSON.stringify(this.faturasCompletas)));

    // console.log(JSON.parse(JSON.stringify(this.agrupadoPorMesAno)));
    // console.log(JSON.parse(JSON.stringify(this.gastosCartao[0])));
  },
  computed: {
    systemBgClass() { return this.$vuetify.theme.dark ? 'dark' : 'light' }
  },
  methods: {
    dataMes(data) {
      return moment(data, 'YYYY-MM-DD').locale('pt-br').format('MMM/YYYY');
    },
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