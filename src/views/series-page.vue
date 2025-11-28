<template>
  <div class="catalog-page">
    <!-- HEADER COM TÍTULO E FILTROS -->
    <header class="catalog-header">
      <h1 class="catalog-title">Séries</h1>

      <div class="catalog-filters">
        <div class="catalog-filter">
          <span class="catalog-filter-label">Gêneros</span>
          <select v-model="selectedGenre" class="catalog-select" @change="applyFilters">
            <option value="">Todos os gêneros</option>
            <option value="10759">Ação e Aventura</option>
            <option value="35">Comédia</option>
            <option value="18">Drama</option>
            <option value="80">Crime</option>
            <option value="10765">Ficção científica e fantasia</option>
          </select>
        </div>

        <div class="catalog-filter">
          <select v-model="sortOption" class="catalog-select" @change="applyFilters">
            <option value="recommended">Sugestões para você</option>
            <option value="year-desc">Ano de estreia</option>
            <option value="title-asc">A-Z</option>
            <option value="title-desc">Z-A</option>
          </select>
        </div>
      </div>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando séries...</p>
    </div>

    <!-- CONTEÚDO -->
    <main v-else class="catalog-content">
      <!-- Principais escolhas do dia -->
      <MovieSection
        v-if="filteredTopPicks.length > 0"
        title="Principais escolhas do dia para você"
        :movies="filteredTopPicks"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Séries premiadas sobre crimes -->
      <MovieSection
        v-if="filteredCrime.length > 0"
        title="Séries premiadas sobre crimes"
        :movies="filteredCrime"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Brasil: top 10 em séries hoje -->
      <MovieSection
        v-if="filteredTop10.length > 0"
        title="Brasil: top 10 em séries hoje"
        :movies="filteredTop10"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Só na Metflix -->
      <MovieSection
        v-if="filteredPopular.length > 0"
        title="Só na Metflix"
        :movies="filteredPopular"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Comédias -->
      <MovieSection
        v-if="filteredComedy.length > 0"
        title="Comédias"
        :movies="filteredComedy"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Drama -->
      <MovieSection
        v-if="filteredDrama.length > 0"
        title="Drama"
        :movies="filteredDrama"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Ação e Aventura -->
      <MovieSection
        v-if="filteredAction.length > 0"
        title="Ação e Aventura"
        :movies="filteredAction"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Mensagem se não houver resultados -->
      <div v-if="noResults" class="no-results">
        <p>Nenhuma série encontrada com os filtros selecionados.</p>
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
  trendingSeries,
  popularSeries,
  topRatedSeries,
  actionSeries,
  comedySeries,
  dramaSeries,
  crimeSeries,
  loading,
  getMovieById
} = useMovies()

const selectedGenre = ref('')
const sortOption = ref('recommended')

const showModal = ref(false)
const selectedMovie = ref({})

const genreModalOpen = ref(false)
const selectedGenreModal = ref({ title: '', movies: [] })

// FUNÇÃO DE FILTRO E ORDENAÇÃO
const filterAndSort = (movies) => {
  let filtered = [...movies]
  
  // Filtrar por gênero
  if (selectedGenre.value) {
    const genreId = parseInt(selectedGenre.value)
    filtered = filtered.filter(movie => 
      movie.genres && movie.genres.includes(genreId)
    )
  }
  
  // Ordenar
  switch (sortOption.value) {
    case 'year-desc':
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0))
      break
    case 'title-asc':
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'title-desc':
      filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
      break
    default:
      // Mantém ordem original (recomendado)
      break
  }
  
  return filtered
}

// COMPUTED PARA LISTAS FILTRADAS
const filteredTopPicks = computed(() => filterAndSort(trendingSeries.value))
const filteredCrime = computed(() => filterAndSort(crimeSeries.value))
const filteredTop10 = computed(() => filterAndSort(topRatedSeries.value.slice(0, 10)))
const filteredPopular = computed(() => filterAndSort(popularSeries.value))
const filteredComedy = computed(() => filterAndSort(comedySeries.value))
const filteredDrama = computed(() => filterAndSort(dramaSeries.value))
const filteredAction = computed(() => filterAndSort(actionSeries.value))

// Verificar se não há resultados
const noResults = computed(() => {
  return filteredTopPicks.value.length === 0 &&
         filteredCrime.value.length === 0 &&
         filteredTop10.value.length === 0 &&
         filteredPopular.value.length === 0 &&
         filteredComedy.value.length === 0 &&
         filteredDrama.value.length === 0 &&
         filteredAction.value.length === 0
})

const applyFilters = () => {
  // Forçar atualização dos computed (já acontece automaticamente)
  console.log('Filtros aplicados:', { 
    genre: selectedGenre.value, 
    sort: sortOption.value 
  })
}

const openMovieDetail = async (series) => {
  const details = await getMovieById(series.id, 'tv')
  selectedMovie.value = details || series
  showModal.value = true
}

const handleOpenSimilar = async (similar) => {
  showModal.value = false
  await new Promise(resolve => setTimeout(resolve, 300))
  const details = await getMovieById(similar.id, similar.mediaType || 'tv')
  selectedMovie.value = details || similar
  showModal.value = true
}

const playMovie = (series) => {
  console.log('Play série:', series.title)
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

.catalog-filter-label {
  font-size: 0.9rem;
  color: #e5e5e5;
  font-weight: 500;
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
