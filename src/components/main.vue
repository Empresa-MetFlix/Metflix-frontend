<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando filmes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadMovies" class="retry-btn">Tentar Novamente</button>
    </div>

    <!-- Content -->
    <div v-else>
      <HeroSection 
        v-if="heroMovie"
        :hero-movie="heroMovie" 
        @show-more-info="openMovieDetail"
        @play-movie="playMovie"
      />
      
      <main class="content-container">
        <MovieSection 
          title="Em Alta"
          :movies="trendingMovies"
          @select-movie="openMovieDetail"
        />
        <MovieSection 
          title="Populares"
          :movies="popularMovies"
          @select-movie="openMovieDetail"
        />
        <MovieSection 
          title="Filmes de Ação"
          :movies="actionMovies"
          @select-movie="openMovieDetail"
        />
        <MovieSection 
          title="Comédias"
          :movies="comedyMovies"
          @select-movie="openMovieDetail"
        />
        <MovieSection 
          title="Terror"
          :movies="horrorMovies"
          @select-movie="openMovieDetail"
        />
      </main>

      <MovieDetailModal
        :show="showModal"
        :movie="selectedMovie"
        @close="showModal = false"
        @play="playMovie"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMovies } from "../composables/use-movies.js"
import HeroSection from "./hero-section.vue"
import MovieSection from "./movie-section.vue"
import MovieDetailModal from "./movie-detail-modal.vue"

const {
  heroMovie,
  trendingMovies,
  popularMovies,
  actionMovies,
  comedyMovies,
  horrorMovies,
  loading,
  error,
  loadMovies,
  getMovieById
} = useMovies()

const showModal = ref(false)
const selectedMovie = ref({})

const openMovieDetail = async (movie) => {
  // Buscar detalhes completos
  const details = await getMovieById(movie.id, movie.mediaType)
  selectedMovie.value = details || movie
  showModal.value = true
}

const playMovie = (movie) => {
  console.log('Assistir:', movie.title)
  // TODO: Implementar player
}
</script>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(229, 9, 20, 0.3);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  padding: 12px 30px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #b20710;
}

.content-container {
  padding: 0 4% 50px;
}
</style>
