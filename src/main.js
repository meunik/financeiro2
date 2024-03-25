import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import moment from 'moment';

moment.locale('pt-br', {
  months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
  monthsShort : 'jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
  monthsParseExact : true,
  weekdays : 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
  weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
  weekdaysMin : 'Do_Se_Te_Qa_Qi_Se_Sa'.split('_'),
  weekdaysParseExact : true,
  longDateFormat : {
    LT : 'HH:mm',
    LTS : 'HH:mm:ss',
    L : 'DD/MM/YYYY',
    LL : 'DD MMM YYYY',
    LLL : 'D MMMM YYYY HH:mm',
    LLLL : 'dddd D MMMM YYYY HH:mm'
  },
  calendar : {
    sameDay : '[Hoje às] LT',
    nextDay : '[Amanhã às] LT',
    nextWeek : 'dddd [às] LT',
    lastDay : '[Ontem às] LT',
    lastWeek : 'dddd [último a] LT',
    sameElse : 'L'
  },
  relativeTime : {
    future : 'em %s',
    past : 'há %s',
    s : 'alguns segundos',
    m : 'um minuto',
    mm : '%d minutos',
    h : 'uma hora',
    hh : '%d horas',
    d : 'um dia',
    dd : '%d dias',
    M : 'um mês',
    MM : '%d meses',
    y : 'um ano',
    yy : '%d anos'
  }
});

import './css/style.css';
import './css/padronizados.css';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
