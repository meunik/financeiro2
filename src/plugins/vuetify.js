import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import pt from 'vuetify/es5/locale/pt';

export default new Vuetify({
    theme: { 
      dark: true,
      themes: {
        dark: {
          transparente: '#121212',
        },
        light: {
          transparente: '#ffffff',
        },
      },
    },
    lang: {
      locales: { pt },
      current: 'pt',
    },
});
