<template>
  <div class="minha-lista">
    <h1 class="page-title">Minha Lista</h1>

    <!-- Empty State -->
    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">📺</div>
      <h2>Sua lista está vazia</h2>
      <p>Adicione filmes e séries à sua lista para assistir depois.</p>
      <router-link to="/" class="browse-btn">
        Explorar Conteúdo
      </router-link>
    </div>

    <!-- Lista de Favoritos -->
    <div v-else class="favorites-grid">
      <MovieCard
        v-for="movie in favorites"
        :key="movie.id"
        :movie="movie"
        @select-movie="openMovieDetail"
        @play-movie="playMovie"
      />
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
import { ref, computed } from 'vue'
import { useFavoritesStore } from '@/composables/use-favorites'
import { useMovies } from '@/composables/use-movies'
import MovieCard from './movie-card.vue'
import MovieDetailModal from './movie-detail-modal.vue'

const favoritesStore = useFavoritesStore()
const moviesStore = useMovies()

const favorites = computed(() => favoritesStore.favorites)
const showModal = ref(false)
const selectedMovie = ref({})

const openMovieDetail = async (movie) => {
  const details = await moviesStore.getMovieById(movie.id, movie.mediaType)
  selectedMovie.value = details || movie
  showModal.value = true
}

const playMovie = (movie) => {
  console.log('Assistir:', movie.title)
  // TODO: Implementar player
}
</script>

<style scoped>
.minha-lista {
  min-height: 100vh;
  padding: 100px 4% 50px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #fff;
}

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
  display: inline-block;
  padding: 12px 30px;
  background: #e50914;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #b20710;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px 20px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px 15px;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px 10px;
  }
}
</style>
