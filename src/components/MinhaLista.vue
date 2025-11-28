<template>
  <div class="minha-lista">
    <!-- HEADER COM TÍTULO E FILTROS -->
    <header class="lista-header">
      <h1 class="page-title">Minha Lista</h1>
      
      <div v-if="favorites.length > 0" class="lista-controls">
        <!-- BUSCA -->
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar na sua lista..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>

        <!-- FILTROS -->
        <div class="filters">
          <select v-model="filterType" class="filter-select">
            <option value="all">Tudo</option>
            <option value="movie">Filmes</option>
            <option value="tv">Séries</option>
          </select>

          <select v-model="sortBy" class="filter-select">
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="title">A-Z</option>
            <option value="rating">Avaliação</option>
          </select>
        </div>
      </div>
    </header>

    <!-- ESTATÍSTICAS -->
    <div v-if="favorites.length > 0" class="stats">
      <div class="stat-card">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ stats.movies }}</span>
        <span class="stat-label">Filmes</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ stats.series }}</span>
        <span class="stat-label">Séries</span>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="favorites.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">📺</div>
      <h2>Sua lista está vazia</h2>
      <p>Adicione filmes e séries à sua lista para assistir depois.</p>
      <router-link to="/" class="browse-btn">
        <span class="btn-icon">🎬</span>
        Explorar Conteúdo
      </router-link>
    </div>

    <!-- LOADING -->
    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando sua lista...</p>
    </div>

    <!-- LISTA DE FAVORITOS FILTRADA -->
    <div v-else-if="filteredFavorites.length > 0" class="favorites-grid">
      <MovieCard
        v-for="movie in filteredFavorites"
        :key="movie.id"
        :movie="movie"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
      />
    </div>

    <!-- SEM RESULTADOS NA BUSCA -->
    <div v-else class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3>Nenhum resultado encontrado</h3>
      <p>Tente buscar por outro título ou ajustar os filtros.</p>
      <button @click="clearFilters" class="clear-filters-btn">
        Limpar Filtros
      </button>
    </div>

    <!-- MODAL DE DETALHES -->
    <MovieDetailModal
      :show="showModal"
      :movie="selectedMovie"
      @close="showModal = false"
      @open-similar="handleOpenSimilar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavorites } from '@/composables/use-favorites.js'
import { useMovies } from '@/composables/use-movies.js'
import MovieCard from '@/components/movie-card.vue'
import MovieDetailModal from '@/components/movie-detail-modal.vue'

const { favorites, loading, loadFavorites } = useFavorites()
const { getMovieById } = useMovies()

const searchQuery = ref('')
const filterType = ref('all')
const sortBy = ref('recent')

const showModal = ref(false)
const selectedMovie = ref({})

// ESTATÍSTICAS
const stats = computed(() => {
  const total = favorites.value.length
  const movies = favorites.value.filter(f => f.mediaType !== 'tv').length
  const series = favorites.value.filter(f => f.mediaType === 'tv').length
  
  return { total, movies, series }
})

// FILTROS E BUSCA
const filteredFavorites = computed(() => {
  let result = [...favorites.value]
  
  // Filtrar por tipo
  if (filterType.value !== 'all') {
    if (filterType.value === 'movie') {
      result = result.filter(f => f.mediaType !== 'tv')
    } else if (filterType.value === 'tv') {
      result = result.filter(f => f.mediaType === 'tv')
    }
  }
  
  // Buscar por título
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(f => 
      f.title?.toLowerCase().includes(query) ||
      f.description?.toLowerCase().includes(query)
    )
  }
  
  // Ordenar
  switch (sortBy.value) {
    case 'recent':
      result.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0))
      break
    case 'title':
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'rating':
      result.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0))
      break
  }
  
  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  filterType.value = 'all'
  sortBy.value = 'recent'
}

const openMovieDetail = async (movie) => {
  const details = await getMovieById(movie.id, movie.mediaType)
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
  console.log('Assistir:', movie.title)
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.minha-lista {
  min-height: 100vh;
  padding: 100px 4% 50px;
  background-color: #141414;
}

.lista-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
}

.lista-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #e50914;
  background: rgba(255, 255, 255, 0.15);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.filter-select:focus {
  outline: none;
  border-color: #e50914;
}

.filter-select option {
  background: #181818;
}

/* ESTATÍSTICAS */
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(229, 9, 20, 0.05));
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 8px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e50914;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.95rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* LOADING */
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

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #fff;
}

.empty-state p {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 30px;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: #e50914;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.2s;
}

.browse-btn:hover {
  background: #b20710;
  transform: scale(1.05);
}

.btn-icon {
  font-size: 1.3rem;
}

/* SEM RESULTADOS */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.4;
}

.no-results h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #fff;
}

.no-results p {
  font-size: 1rem;
  color: #999;
  margin-bottom: 25px;
}

.clear-filters-btn {
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #e50914;
}

/* GRID DE FAVORITOS */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

@media (max-width: 1024px) {
  .lista-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .filters {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .stats {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
