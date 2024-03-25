<template>
  <v-footer padless :color="systemBg">
    <v-col class="text-center" cols="12" style="height: 100px;">
    </v-col>
  </v-footer>
</template>

<script>
export default {
  computed: { systemBg() { return this.$vuetify.theme.dark ? '#12121200' : '#ffffff00' } },
};
</script>