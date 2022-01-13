<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <person/>
  </div>
</template>

<script>
// @ is an alias to /src
import person from '@/components/person.vue'

export default {
  name: 'Home',
  components: {
    person
  }
}
</script>
