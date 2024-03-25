<template>
  <div>
    <Dashbord />
  </div>
</template>

<script>
import { Model } from "@/store/Model"
import Dashbord from '@/views/Dashbord.vue'

export default {
  mixins: [Model],
  components: {
    Dashbord,
  },
}
</script>