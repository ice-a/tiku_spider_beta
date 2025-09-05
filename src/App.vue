<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App组件入口
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--td-text-color-primary);
  background-color: var(--td-bg-color-page);
  min-height: 100vh;
}
</style>