<template>
  <div>
    <Dashbord />

    <!-- {{ mapa }} -->
    <!-- <Mapear /> -->
    <!-- <Fatura /> -->
  </div>
</template>

<script>
import { Model } from "@/store/Model"
import Fatura from '@/views/Fatura.vue'
import Mapear from '@/views/Mapear.vue'
import Dashbord from '@/views/Dashbord.vue'

export default {
  mixins: [Model],
  components: {
    Fatura,
    Mapear,
    Dashbord,
  },
}
</script>