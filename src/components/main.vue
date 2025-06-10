<template>
  <main class="bg-black min-h-screen">
    <HeroSection :movie="featuredMovie" />

    <div class="relative z-10 -mt-32 pb-16">
      <MovieSection
        v-for="(category, index) in categories"
        :key="index"
        :category="category"
      />
    </div>

    <div v-if="loading" class="bg-black min-h-screen flex items-center justify-center">
      <div class="text-white text-2xl">Carregando Metflix...</div>
    </div>
  </main>
</template>

<script setup>
import HeroSection from './hero-section.vue'
import MovieSection from './movie-section.vue'
import { useMovies } from '../composables/use-movies.vue'

const { categories, featuredMovie, loading } = useMovies()
</script>
