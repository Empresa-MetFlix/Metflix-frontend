<template>
  <div class="catalog-page">
    <!-- HEADER COM TÍTULO E FILTROS -->
    <header class="catalog-header">
      <h1 class="catalog-title">Filmes</h1>

      <div class="catalog-filters">
        <div class="catalog-filter">
          <span class="catalog-filter-label">Gêneros</span>
          <select v-model="selectedGenre" class="catalog-select" @change="applyFilters">
            <option value="">Todos os gêneros</option>
            <option value="28">Ação</option>
            <option value="35">Comédia</option>
            <option value="18">Drama</option>
            <option value="27">Terror</option>
            <option value="10749">Romance</option>
            <option value="878">Ficção científica</option>
          </select>
        </div>

        <div class="catalog-filter">
          <select v-model="sortOption" class="catalog-select" @change="applyFilters">
            <option value="recommended">Sugestões para você</option>
            <option value="year-desc">Ano de lançamento</option>
            <option value="title-asc">A-Z</option>
            <option value="title-desc">Z-A</option>
          </select>
        </div>
      </div>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando filmes...</p>
    </div>

    <!-- CONTEÚDO -->
    <main v-else class="catalog-content">
      <!-- Estreias da semana -->
      <MovieSection
        v-if="filteredNewReleases.length > 0"
        title="Estreias da semana"
        :movies="filteredNewReleases"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Brasil: top 10 em filmes hoje -->
      <MovieSection
        v-if="filteredTop10.length > 0"
        title="Brasil: top 10 em filmes hoje"
        :movies="filteredTop10"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Filmes de ação -->
      <MovieSection
        v-if="filteredAction.length > 0"
        title="Filmes de ação"
        :movies="filteredAction"
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

      <!-- Terror -->
      <MovieSection
        v-if="filteredHorror.length > 0"
        title="Terror"
        :movies="filteredHorror"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Populares -->
      <MovieSection
        v-if="filteredPopular.length > 0"
        title="Populares"
        :movies="filteredPopular"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
        @explore-all="handleExploreAll"
      />

      <!-- Mensagem se não houver resultados -->
      <div v-if="noResults" class="no-results">
        <p>Nenhum filme encontrado com os filtros selecionados.</p>
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
  horrorMovies,
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
  
  // Filtrar apenas filmes (não séries)
  filtered = filtered.filter(m => m.mediaType !== 'tv')
  
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
const filteredNewReleases = computed(() => filterAndSort(trendingMovies.value).slice(0, 20))
const filteredTop10 = computed(() => filterAndSort(trendingMovies.value).slice(0, 10))
const filteredAction = computed(() => filterAndSort(actionMovies.value))
const filteredComedy = computed(() => filterAndSort(comedyMovies.value))
const filteredHorror = computed(() => filterAndSort(horrorMovies.value))
const filteredPopular = computed(() => filterAndSort(popularMovies.value))

// Verificar se não há resultados
const noResults = computed(() => {
  return filteredNewReleases.value.length === 0 &&
         filteredTop10.value.length === 0 &&
         filteredAction.value.length === 0 &&
         filteredComedy.value.length === 0 &&
         filteredHorror.value.length === 0 &&
         filteredPopular.value.length === 0
})

const applyFilters = () => {
  console.log('Filtros aplicados:', { 
    genre: selectedGenre.value, 
    sort: sortOption.value 
  })
}

const openMovieDetail = async (movie) => {
  const details = await getMovieById(movie.id, 'movie')
  selectedMovie.value = details || movie
  showModal.value = true
}

const handleOpenSimilar = async (similar) => {
  showModal.value = false
  await new Promise(resolve => setTimeout(resolve, 300))
  const details = await getMovieById(similar.id, similar.mediaType || 'movie')
  selectedMovie.value = details || similar
  showModal.value = true
}

const playMovie = (movie) => {
  console.log('Play filme:', movie.title)
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
