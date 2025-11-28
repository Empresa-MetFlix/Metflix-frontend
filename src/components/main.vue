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
      <!-- HERO COM MÚLTIPLOS FILMES -->
      <HeroSection 
        v-if="featuredMovies.length > 0"
        :featured-movies="featuredMovies" 
        @show-more-info="openMovieDetail"
        @play-movie="playMovie"
      />
      
      <main class="content-container">
        <!-- SEÇÕES COM BOTÃO "VER TUDO" E SETAS -->
        <MovieSection 
          title="Em Alta"
          :movies="trendingMovies"
          @select-movie="openMovieDetail"
          @play-movie="playMovie"
          @explore-all="handleExploreAll"
        />
        <MovieSection 
          title="Populares"
          :movies="popularMovies"
          @select-movie="openMovieDetail"
          @play-movie="playMovie"
          @explore-all="handleExploreAll"
        />
        <MovieSection 
          title="Filmes de Ação"
          :movies="actionMovies"
          @select-movie="openMovieDetail"
          @play-movie="playMovie"
          @explore-all="handleExploreAll"
        />
        <MovieSection 
          title="Comédias"
          :movies="comedyMovies"
          @select-movie="openMovieDetail"
          @play-movie="playMovie"
          @explore-all="handleExploreAll"
        />
        <MovieSection 
          title="Terror"
          :movies="horrorMovies"
          @select-movie="openMovieDetail"
          @play-movie="playMovie"
          @explore-all="handleExploreAll"
        />
      </main>

      <!-- MODAL DE DETALHES DO FILME -->
      <MovieDetailModal
        :show="showModal"
        :movie="selectedMovie"
        @close="showModal = false"
        @open-similar="handleOpenSimilar"
      />

      <!-- MODAL "VER TUDO" (ESTILO NETFLIX) -->
      <GenreModal 
        :is-open="genreModalOpen"
        :genre-title="selectedGenre.title"
        :movies="selectedGenre.movies"
        @close="genreModalOpen = false"
        @select-movie="openMovieDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMovies } from "../composables/use-movies.js"
import HeroSection from "./hero-section.vue"
import MovieSection from "./movie-section.vue"
import MovieDetailModal from "./movie-detail-modal.vue"
import GenreModal from "./genre-modal.vue"

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

// ESTADO DO MODAL "VER TUDO"
const genreModalOpen = ref(false)
const selectedGenre = ref({ title: '', movies: [] })

// CRIAR ARRAY DE FILMES DESTACADOS PARA O CARROSSEL
const featuredMovies = computed(() => {
  const movies = []
  
  // Adicionar os 3 primeiros de trending
  if (trendingMovies.value && trendingMovies.value.length > 0) {
    movies.push(...trendingMovies.value.slice(0, 3).map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.description || movie.overview || 'Sem descrição disponível.',
      backgroundImage: movie.backgroundImage || movie.image,
      ageRating: movie.ageRating || '16',
      mediaType: movie.mediaType
    })))
  }
  
  // Se não tiver trending, usar populares
  if (movies.length === 0 && popularMovies.value && popularMovies.value.length > 0) {
    movies.push(...popularMovies.value.slice(0, 3).map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.description || movie.overview || 'Sem descrição disponível.',
      backgroundImage: movie.backgroundImage || movie.image,
      ageRating: movie.ageRating || '16',
      mediaType: movie.mediaType
    })))
  }
  
  // Se ainda não tiver nada, usar o heroMovie antigo como fallback
  if (movies.length === 0 && heroMovie.value) {
    movies.push({
      id: heroMovie.value.id,
      title: heroMovie.value.title,
      description: heroMovie.value.description || 'Sem descrição disponível.',
      backgroundImage: heroMovie.value.backgroundImage,
      ageRating: heroMovie.value.ageRating || '16',
      mediaType: heroMovie.value.mediaType
    })
  }
  
  return movies
})

// ABRIR MODAL DE DETALHES
const openMovieDetail = async (movie) => {
  console.log('🎬 Abrindo detalhes:', movie.title)
  
  // Fechar o modal "Ver Tudo" se estiver aberto
  genreModalOpen.value = false
  
  // Buscar detalhes completos
  const details = await getMovieById(movie.id, movie.mediaType)
  selectedMovie.value = details || movie
  showModal.value = true
}

// ABRIR FILME SEMELHANTE
const handleOpenSimilar = async (similar) => {
  console.log('🔄 Abrindo filme semelhante:', similar.title, similar)
  
  // Fechar modal atual
  showModal.value = false
  
  // Aguardar animação de fechamento
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Buscar detalhes completos do filme similar
  const details = await getMovieById(similar.id, similar.mediaType || 'movie')
  console.log('📦 Detalhes carregados:', details)
  
  selectedMovie.value = details || similar
  
  // Abrir novo modal
  showModal.value = true
}

// PLAY DO FILME
const playMovie = (movie) => {
  console.log('▶️ Assistir:', movie.title)
  // TODO: Implementar player
}

// ABRIR MODAL "VER TUDO"
const handleExploreAll = ({ title, movies }) => {
  console.log('📂 Ver tudo:', title)
  selectedGenre.value = { title, movies }
  genreModalOpen.value = true
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
  color: #fff;
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

/* AJUSTE NETFLIX-STYLE */
.content-container {
  padding: 0;
  margin-top: -150px;
  position: relative;
  z-index: 2;
  overflow: visible;
  padding-bottom: 50px;
}

@media (max-width: 768px) {
  .content-container {
    margin-top: -100px;
  }
}
</style>
