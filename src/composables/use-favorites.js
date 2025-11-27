import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  // Estado
  const favorites = ref([])

  // Carregar do localStorage ao iniciar
  const loadFavorites = () => {
    const stored = localStorage.getItem('metflix_favorites')
    if (stored) {
      try {
        favorites.value = JSON.parse(stored)
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
        favorites.value = []
      }
    }
  }

  // Salvar no localStorage
  const saveFavorites = () => {
    localStorage.setItem('metflix_favorites', JSON.stringify(favorites.value))
  }

  // Adicionar aos favoritos
  const addFavorite = (movie) => {
    if (!isFavorite(movie.id)) {
      favorites.value.push(movie)
      saveFavorites()
    }
  }

  // Remover dos favoritos
  const removeFavorite = (movieId) => {
    favorites.value = favorites.value.filter(m => m.id !== movieId)
    saveFavorites()
  }

  // Toggle (adicionar ou remover)
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  // Verificar se está nos favoritos
  const isFavorite = (movieId) => {
    return favorites.value.some(m => m.id === movieId)
  }

  // Limpar todos os favoritos
  const clearFavorites = () => {
    favorites.value = []
    saveFavorites()
  }

  // Total de favoritos
  const favoritesCount = computed(() => favorites.value.length)

  // Carregar ao iniciar
  loadFavorites()

  return {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }
})
