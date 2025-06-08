<template>
  <MetflixApp />
</template>

<script setup>
import MetflixApp from './components/metflix-app.vue'
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

html {
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
}
</style>
