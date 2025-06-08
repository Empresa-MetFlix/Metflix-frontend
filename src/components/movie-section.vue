<template>
  <section class="movie-section">
    <h2 class="movie-section-title">{{ title }}</h2>
    <div class="movie-section-slider">
      <div class="movie-section-container" ref="sliderContainer">
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id"
          :movie="movie"
          @select-movie="handleMovieSelect"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import MovieCard from './movie-card.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  movies: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-movie'])
const sliderContainer = ref(null)

const handleMovieSelect = (movie) => {
  emit('select-movie', movie)
}
</script>

<style scoped>
.movie-section {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.movie-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding: 0 4%;
  color: #e5e5e5;
}

.movie-section-slider {
  position: relative;
  width: 100%;
}

.movie-section-container {
  display: flex;
  overflow-x: auto;
  padding: 20px 4%;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.movie-section-container::-webkit-scrollbar {
  display: none;
}
</style>
