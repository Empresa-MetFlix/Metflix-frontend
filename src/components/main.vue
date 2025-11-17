<template>
  <div>
    <HeroSection :hero-movie="heroMovie" />
    <main class="content-container">
      <MovieSection 
        title="Em alta"
        :movies="trendingMovies"
      />
      <MovieSection 
        title="Originais Metflix"
        :movies="originalMovies"
      />
      <MovieSection 
        title="Filmes de Ação"
        :movies="actionMovies"
      />
      <MovieSection 
        title="Comédias"
        :movies="comedyMovies"
      />
      <MovieSection 
        title="Terror"
        :movies="horrorMovies"
      />
    </main>
  </div>
</template>

<script setup>
import { useMovies } from "../composables/use-movies.js"
import HeroSection from "./hero-section.vue"
import MovieSection from "./movie-section.vue"

const {
  heroMovie,
  trendingMovies,
  originalMovies,
  actionMovies,
  comedyMovies,
  horrorMovies
} = useMovies()
</script>

<style scoped>
/* O estilo é definido principalmente nos componentes filhos (HeroSection, MovieSection) */
.bg-black {
    background-color: #000;
}
</style>