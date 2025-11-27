<template>
  <div class="filmes-page">
    <h1 class="page-title">Filmes</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando filmes...</p>
    </div>

    <!-- Content -->
    <div v-else class="content">
      <MovieSection 
        title="Populares"
        :movies="popularMovies"
        @select-movie="openMovieDetail"
      />
      <MovieSection 
        title="Mais Bem Avaliados"
        :movies="topRatedMovies"
        @select-movie="openMovieDetail"
      />
      <MovieSection 
        title="Ação"
        :movies="actionMovies"
        @select-movie="openMovieDetail"
      />
      <MovieSection 
        title="Comédia"
        :movies="comedyMovies"
        @select-movie="openMovieDetail"
      />
    </div>

    <MovieDetailModal
      :show="showModal"
      :movie="selectedMovie"
      @close="showModal = false"
      @play="playMovie"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMovies } from '@/composables/use-movies'
import MovieSection from '@/components/movie-section.vue'
import MovieDetailModal from '@/components/movie-detail-modal.vue'

const moviesStore = useMovies()

const {
  popularMovies,
  topRatedMovies,
  actionMovies,
  comedyMovies,
  loading,
  getMovieById
} = moviesStore

const showModal = ref(false)
const selectedMovie = ref({})

const openMovieDetail = async (movie) => {
  const details = await getMovieById(movie.id, movie.mediaType)
  selectedMovie.value = details || movie
  showModal.value = true
}

const playMovie = (movie) => {
  console.log('Assistir:', movie.title)
}
</script>

<style scoped>
.filmes-page {
  min-height: 100vh;
  padding: 100px 4% 50px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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

.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
