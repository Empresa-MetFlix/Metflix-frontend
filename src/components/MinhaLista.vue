<template>
  <div class="minha-lista-view">

    <!-- Loading -->
    <div v-if="loading" class="empty-list">
      <p>Carregando sua lista...</p>
    </div>

    <!-- Grelha de Favoritos -->
    <div v-else-if="favoritesStore.getCount > 0" class="favorites-grid">
      <MovieCard
        v-for="movie in favoritesStore.getFavorites"
        :key="movie.id"
        :movie="movie"
        @select-movie="handleMovieSelect"
      />
    </div>

    <!-- Mensagem de Lista Vazia -->
    <div v-else class="empty-list">
      <p>A sua lista está vazia.</p>
      <p>Adicione filmes e séries do catálogo para vê-los aqui.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFavoritesStore } from '../stores/use-favorites'
import MovieCard from '../components/movie-card.vue'

const favoritesStore = useFavoritesStore()
const loading = ref(true)

onMounted(async () => {
  try {
    // CHAMADA IMPORTANTE
    await favoritesStore.loadFavorites()
  } catch (e) {
    console.error("Erro ao carregar favoritos:", e)
  } finally {
    loading.value = false
  }
})

// Apenas log
const handleMovieSelect = (movie) => {
  console.log('Selecionou (da Minha Lista):', movie.title)
}
</script>

<style scoped>
.minha-lista-view {
  padding-left: 4%;
  padding-right: 4%;
  padding-top: 2rem;
  min-height: 100vh;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2rem;
  padding-top: 1rem;
}

.empty-list {
  text-align: center;
  padding: 6rem 2rem;
  color: #808080;
  font-size: 1.3rem;
}

</style>
