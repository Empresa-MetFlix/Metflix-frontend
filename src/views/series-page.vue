<template>
  <div class="series-page">
    <h1 class="page-title">Séries</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando séries...</p>
    </div>

    <!-- Content -->
    <div v-else class="content">
      <MovieSection 
        v-if="tvShows.length > 0"
        title="Séries Populares"
        :movies="tvShows"
        @select-movie="openMovieDetail"
      />
      
      <div v-else class="info-message">
        <p>Carregando séries do TMDB...</p>
      </div>
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
import { ref, onMounted } from 'vue'
import tmdbService from '@/api/services/tmdbService.js'
import { useMovies } from '@/composables/use-movies'
import MovieSection from '@/components/movie-section.vue'
import MovieDetailModal from '@/components/movie-detail-modal.vue'

const moviesStore = useMovies()
const tvShows = ref([])
const loading = ref(true)
const showModal = ref(false)
const selectedMovie = ref({})

onMounted(async () => {
  loading.value = true
  tvShows.value = await tmdbService.getPopularTVShows()
  loading.value = false
})

const openMovieDetail = async (show) => {
  const details = await moviesStore.getMovieById(show.id, 'tv')
  selectedMovie.value = details || show
  showModal.value = true
}

const playMovie = (show) => {
  console.log('Assistir série:', show.title)
}
</script>

<style scoped>
.series-page {
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

.info-message {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}
</style>
