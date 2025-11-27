<template>
  <div class="search-page">
    <div class="search-header">
      <h1>Resultados para "{{ searchQuery }}"</h1>
      <p v-if="!loading && filteredMovies.length > 0">
        {{ filteredMovies.length }} resultado(s) encontrado(s)
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="search-loading">
      <div class="loading-spinner"></div>
      <p>Buscando...</p>
    </div>

    <!-- Results Grid -->
    <div v-else-if="filteredMovies.length > 0" class="search-results-grid">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
        @select-movie="openMovieDetail"
      />
    </div>

    <!-- No Results -->
    <div v-else class="no-results">
      <p>Nenhum resultado encontrado para "{{ searchQuery }}"</p>
      <p class="no-results-hint">
        Tente buscar por outro título, gênero ou ator.
      </p>
      <router-link to="/" class="back-home-btn">
        Voltar para o Início
      </router-link>
    </div>

    <!-- Modal de Detalhes -->
    <MovieDetailModal
      :show="showModal"
      :movie="selectedMovie"
      @close="showModal = false"
      @play="playMovie"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovies } from '@/composables/use-movies'
import MovieCard from '@/components/movie-card.vue'
import MovieDetailModal from '@/components/movie-detail-modal.vue'

const route = useRoute()
const moviesStore = useMovies()

const searchQuery = ref(route.query.q || '')
const filteredMovies = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedMovie = ref({})

const performSearch = async () => {
  if (!searchQuery.value) return
  
  loading.value = true
  try {
    filteredMovies.value = await moviesStore.searchMovies(searchQuery.value)
  } catch (error) {
    console.error('Erro na busca:', error)
    filteredMovies.value = []
  } finally {
    loading.value = false
  }
}

// Buscar quando query mudar
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || ''
  performSearch()
})

// Buscar ao montar componente
onMounted(() => {
  performSearch()
})

const openMovieDetail = async (movie) => {
  const details = await moviesStore.getMovieById(movie.id, movie.mediaType)
  selectedMovie.value = details || movie
  showModal.value = true
}

const playMovie = (movie) => {
  console.log('Assistir:', movie.title)
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 100px 4% 50px;
}

.search-header {
  margin-bottom: 40px;
}

.search-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.search-header p {
  color: #999;
  font-size: 1.1rem;
}

.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
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

.search-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px 20px;
}

.no-results {
  text-align: center;
  padding: 100px 20px;
}

.no-results p {
  font-size: 1.5rem;
  color: #999;
  margin-bottom: 10px;
}

.no-results-hint {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

.back-home-btn {
  display: inline-block;
  padding: 12px 30px;
  background: #e50914;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.back-home-btn:hover {
  background: #b20710;
}
</style>
