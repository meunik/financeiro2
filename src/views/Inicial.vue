<template>
  <div>
    <!-- {{ mapa }} -->
    <!-- <Mapear /> -->
    <!-- <Fatura /> -->
  </div>
</template>

<script>
import { Model } from "@/store/Model"
import Fatura from '@/views/Fatura.vue'
import Mapear from '@/views/Mapear.vue'

export default {
  mixins: [Model],
  components: {
    Fatura,
    Mapear,
  },
}
</script>