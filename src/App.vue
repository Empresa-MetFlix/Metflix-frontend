<template>
  <div id="app">
    <MetflixApp />
  </div>
</template>

<script setup>
import MetflixApp from './metflix-app.vue'
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: "Roboto", sans-serif;
  background-color: #141414;
  color: #fff;
  overflow-x: hidden;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  background-color: #141414;
}

button {
  cursor: pointer;
  font-family: "Roboto", sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  height: auto;
}

ul, ol {
  list-style: none;
}
</style>
