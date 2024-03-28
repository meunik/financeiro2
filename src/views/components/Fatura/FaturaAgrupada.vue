<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="#420567" class="mb-1" rounded>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Buscar"
          ></v-text-field>

          <v-spacer></v-spacer>

          <span class="grey--text">Items por página</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark text class="ml-2" v-bind="attrs" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">Página {{ page }} de {{ numberOfPages }}</span>

          <v-btn dark color="purple darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn dark color="purple darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="(item, k) in props.items" :key="k" cols="12" sm="6" md="4" lg="3">
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.nome }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list-item>
                <v-row class="d-flex justify-space-between px-3">
                  <strong>Total:</strong>
                  <strong class="text-no-wrap red--text">
                    {{ moeda(item.total) }}
                  </strong>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(index, key) in item.datas" :key="key">
                  <v-row class="d-flex justify-space-between px-3" :class="{ 'blue--text': sortBy === index.data }">
                    <span>{{ dataFormat(index.data) }}</span>
                    <span class="text-no-wrap red--text">
                      {{ moeda(index.valor) }}
                    </span>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

    </v-data-iterator>
  </v-container>
</template>

<script>
import { dinheiro, moeda } from '@/Utils/Converter'
import moment from 'moment'

export default {
  props: {
    datas: {
      require: true,
      type: Array
    },
    items: {
      require: true,
      type: Array
    },
  },
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 12,
      sortBy: 'nome',
      keys: [
        'Nome',
      ],
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'Nome')
    },
  },
  methods: {
    dinheiro,
    moeda,
    dataFormat(data) { return moment(data, 'YYYY-MM-DD').locale('pt-br').format('DD/MM/YYYY'); },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
  },
}
</script>