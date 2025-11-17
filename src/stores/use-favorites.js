import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store Pinia para gerenciar a lista de filmes favoritos.
 * Mantém compatibilidade com sua lógica atual (Set de IDs),
 * mas adiciona suporte total para a página Minha Lista.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  
  // Guarda apenas IDs dos filmes favoritados
  const favoriteMovieIds = ref(new Set())

  // Guarda TEMPORARIAMENTE os filmes completos adicionados
  // Isso permite que a Minha Lista funcione antes da API real
  const favoriteMovies = ref([])

  /** 
   * Alterna favorito
   * Recebe o FILME COMPLETO (não só ID)
   */
  function toggleFavorite(movie) {
    const id = movie.id

    if (favoriteMovieIds.value.has(id)) {
      favoriteMovieIds.value.delete(id)
      favoriteMovies.value = favoriteMovies.value.filter(m => m.id !== id)
      console.log(`Filme ${id} removido dos favoritos.`)
    } else {
      favoriteMovieIds.value.add(id)
      favoriteMovies.value.push(movie)
      console.log(`Filme ${id} adicionado aos favoritos.`)
    }

    // Força reatividade no Set
    favoriteMovieIds.value = new Set(favoriteMovieIds.value)
  }

  /**
   * Getter — retorna TRUE se o filme já está na lista
   */
  const isFavorite = computed(() => (movieId) => {
    return favoriteMovieIds.value.has(movieId)
  })

  /**
   * Getter — retorna todos os filmes completos
   */
  const getFavorites = computed(() => {
    return favoriteMovies.value
  })

  /**
   * Getter — número de filmes
   */
  const getCount = computed(() => {
    return favoriteMovies.value.length
  })

  /**
   * loadFavorites() — usado pela página Minha Lista
   * No futuro irá buscar no Django
   * Por enquanto apenas mantém o estado atual.
   */
  async function loadFavorites() {
    // Sem backend por enquanto — apenas simula carregamento
    console.log("Favoritos carregados (modo local).")
    return true
  }

  return {
    favoriteMovieIds,
    favoriteMovies,
    toggleFavorite,
    isFavorite,
    getFavorites,
    getCount,
    loadFavorites,
  }
})
