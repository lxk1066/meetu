<template>
  <h2>{{name}}</h2>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'meetuSearch',
  setup () {
    const name = ref('search')

    return { name }
  }
}
</script>

<style scoped>

</style>
