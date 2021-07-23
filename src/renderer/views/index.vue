<template>
  <div>
    <h1>Electron + Vite + Vue 3</h1>
    <p>Follow to - https://github.com/trantoan960/electron-vite-template</p>
    <p>Count: {{ count }}</p>
    <button @click="onTryIt">Try it</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function onTryIt() {
  count.value += 1
}
</script>

<style></style>
