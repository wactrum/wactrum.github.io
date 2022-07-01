<template>
  <router-view />
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import {useQuasar} from 'quasar';

export default defineComponent({
  name: 'App',

  setup() {
    const $q = useQuasar();
    onMounted(() => {
      console.warn();
    })
  }
});
</script>
