<template>
  <div class="page-container">
    <h1 class="page-title">Filmes</h1>

    <MovieRow title="Ação" :items="actionMovies" />
    <MovieRow title="Terror" :items="horrorMovies" />
    <MovieRow title="Comédia" :items="comedyMovies" />
  </div>
</template>

<script setup>
import { useMovies } from "../composables/use-movies"
import MovieRow from "../components/MovieRow.vue"

const {
  actionMovies,
  comedyMovies,
  horrorMovies,
} = useMovies()
</script>

<style scoped>
.page-container {
  padding: 120px 40px 40px;
  background: #111;
  min-height: 100vh;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
}
</style>
