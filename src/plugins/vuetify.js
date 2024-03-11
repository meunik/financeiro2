import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import pt from 'vuetify/es5/locale/pt';

export default new Vuetify({
    theme: { dark: true },
    lang: {
      locales: { pt },
      current: 'pt',
    },
});
