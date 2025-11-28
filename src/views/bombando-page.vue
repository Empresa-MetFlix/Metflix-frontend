<template>
  <div class="catalog-page">
    <!-- HEADER -->
    <header class="catalog-header">
      <h1 class="catalog-title">Bombando</h1>

      <div class="catalog-filters">
        <div class="catalog-filter">
          <select v-model="contentType" class="catalog-select" @change="applyFilters">
            <option value="all">Filmes e Séries</option>
            <option value="movie">Apenas Filmes</option>
            <option value="tv">Apenas Séries</option>
          </select>
        </div>

        <div class="catalog-filter">
          <select v-model="timeRange" class="catalog-select" @change="applyFilters">
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
          </select>
        </div>
      </div>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando conteúdo...</p>
    </div>

    <!-- CONTEÚDO -->
    <main v-else class="catalog-content">
      <!-- TOP 10 Brasil -->
      <MovieSection
        v-if="filteredTop10.length > 0"
        :title="titleTop10"
        :movies="filteredTop10"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Em alta agora -->
      <MovieSection
        v-if="filteredTrending.length > 0"
        :title="titleTrending"
        :movies="filteredTrending"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Mais assistidos -->
      <MovieSection
        v-if="filteredMostWatched.length > 0"
        :title="titleMostWatched"
        :movies="filteredMostWatched"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Novidades -->
      <MovieSection
        v-if="filteredHotReleases.length > 0"
        title="Novidades quentes"
        :movies="filteredHotReleases"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Mensagem se não houver resultados -->
      <div v-if="noResults" class="no-results">
        <p>Nenhum conteúdo encontrado com os filtros selecionados.</p>
      </div>
    </main>

    <!-- MODAIS -->
    <MovieDetailModal
      :show="showModal"
      :movie="selectedMovie"
      @close="showModal = false"
      @open-similar="handleOpenSimilar"
    />

    <GenreModal 
      :is-open="genreModalOpen"
      :genre-title="selectedGenreModal.title"
      :movies="selectedGenreModal.movies"
      @close="genreModalOpen = false"
      @select-movie="openMovieDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMovies } from '@/composables/use-movies.js'
import MovieSection from '@/components/movie-section.vue'
import MovieDetailModal from '@/components/movie-detail-modal.vue'
import GenreModal from '@/components/genre-modal.vue'

const {
  trendingMovies,
  popularMovies,
  actionMovies,
  comedyMovies,
  trendingSeries,
  popularSeries,
  topRatedSeries,
  loading,
  getMovieById
} = useMovies()

const contentType = ref('all')
const timeRange = ref('today')

const showModal = ref(false)
const selectedMovie = ref({})

const genreModalOpen = ref(false)
const selectedGenreModal = ref({ title: '', movies: [] })

// TÍTULOS DINÂMICOS BASEADOS NO PERÍODO
const titleTop10 = computed(() => {
  const period = {
    'today': 'hoje',
    'week': 'esta semana',
    'month': 'este mês'
  }
  return `Top 10 no Brasil ${period[timeRange.value]}`
})

const titleTrending = computed(() => {
  const period = {
    'today': 'agora',
    'week': 'esta semana',
    'month': 'este mês'
  }
  return `Em alta ${period[timeRange.value]}`
})

const titleMostWatched = computed(() => {
  const period = {
    'today': 'hoje',
    'week': 'esta semana',
    'month': 'este mês'
  }
  return `Mais assistidos ${period[timeRange.value]}`
})

// FUNÇÃO DE FILTRO POR TIPO E PERÍODO
const filterByTypeAndTime = (movies) => {
  let filtered = [...movies]
  
  // Filtrar por tipo de conteúdo
  if (contentType.value === 'movie') {
    filtered = filtered.filter(m => m.mediaType !== 'tv')
  } else if (contentType.value === 'tv') {
    filtered = filtered.filter(m => m.mediaType === 'tv')
  }
  
  // Filtrar por período (simulado - ordenando por popularidade e limitando)
  switch (timeRange.value) {
    case 'today':
      filtered = filtered.slice(0, 20) // Mais recentes
      break
    case 'week':
      filtered = filtered.slice(0, 40) // Últimas semanas
      break
    case 'month':
      filtered = filtered // Todos
      break
  }
  
  return filtered
}

// COMPUTED PARA LISTAS FILTRADAS
const filteredTop10 = computed(() => {
  const all = [...trendingMovies.value, ...trendingSeries.value]
  return filterByTypeAndTime(all).slice(0, 10)
})

const filteredTrending = computed(() => {
  const all = [...trendingMovies.value, ...trendingSeries.value]
  return filterByTypeAndTime(all).slice(10, 30)
})

const filteredMostWatched = computed(() => {
  const all = [...popularMovies.value, ...popularSeries.value, ...topRatedSeries.value]
  return filterByTypeAndTime(all).slice(0, 20)
})

const filteredHotReleases = computed(() => {
  const all = [...actionMovies.value, ...comedyMovies.value]
  return filterByTypeAndTime(all).slice(0, 20)
})

// Verificar se não há resultados
const noResults = computed(() => {
  return filteredTop10.value.length === 0 &&
         filteredTrending.value.length === 0 &&
         filteredMostWatched.value.length === 0 &&
         filteredHotReleases.value.length === 0
})

const applyFilters = () => {
  console.log('Filtros aplicados:', { 
    type: contentType.value, 
    time: timeRange.value 
  })
}

const openMovieDetail = async (item) => {
  const details = await getMovieById(item.id, item.mediaType)
  selectedMovie.value = details || item
  showModal.value = true
}

const handleOpenSimilar = async (similar) => {
  showModal.value = false
  await new Promise(resolve => setTimeout(resolve, 300))
  const details = await getMovieById(similar.id, similar.mediaType || 'movie')
  selectedMovie.value = details || similar
  showModal.value = true
}

const playMovie = (item) => {
  console.log('Play:', item.title)
}

const handleExploreAll = ({ title, movies }) => {
  selectedGenreModal.value = { title, movies }
  genreModalOpen.value = true
}
</script>

<style scoped>
.catalog-page {
  padding-top: 80px;
  min-height: 100vh;
  color: #fff;
  background-color: #141414;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
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

.catalog-header {
  padding: 20px 4% 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.catalog-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
}

.catalog-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.catalog-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.catalog-select {
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 32px 8px 12px;
  border-radius: 2px;
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  min-width: 180px;
  transition: border-color 0.2s;
}

.catalog-select:hover {
  border-color: #fff;
}

.catalog-select:focus {
  outline: none;
  border-color: #fff;
}

.catalog-select option {
  background-color: #181818;
  color: #fff;
}

.catalog-content {
  padding: 0 0 40px;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  padding: 40px;
  text-align: center;
}

.no-results p {
  font-size: 1.2rem;
  color: #999;
}

@media (max-width: 768px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .catalog-title {
    font-size: 1.8rem;
  }

  .catalog-filters {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .catalog-filter {
    width: 100%;
  }

  .catalog-select {
    width: 100%;
  }
}
</style>
