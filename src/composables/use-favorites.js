import { ref, computed } from 'vue'
import api from '@/api/services/api'
import tmdbService from '@/api/services/tmdbService'
import { useNotifications } from './use-notifications' // ✅ ADICIONAR

const favorites = ref([])
const loading = ref(false)

export function useFavorites() {
  
  // ✅ ADICIONAR - Importar função de notificações
  const { loadNotifications } = useNotifications()
  
  const loadFavorites = async () => {
    try {
      loading.value = true
      const response = await api.get('/favorites/')
      const data = response.data.results || response.data

      const favoritesWithData = await Promise.all(
        data.map(async (fav) => {
          try {
            const movieData = await tmdbService.getMovieDetails(fav.media_id)
            return {
              id: fav.id,
              media_id: fav.media_id,
              addedAt: fav.created_at,
              ...movieData
            }
          } catch (error) {
            console.error(`Erro ao buscar dados da mídia ${fav.media_id}:`, error)
            return {
              id: fav.id,
              media_id: fav.media_id,
              addedAt: fav.created_at,
              title: `Mídia ${fav.media_id}`,
              image: 'https://via.placeholder.com/300x450/333/fff?text=Sem+Dados'
            }
          }
        })
      )

      favorites.value = favoritesWithData
      console.log('✅ Favoritos carregados:', favorites.value.length)
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  // ✅ USA A ROTA /toggle/ DO BACKEND
  const toggleFavorite = async (movie) => {
    try {
      console.log('🔄 Toggle favorito:', movie.title || movie.name)
      
      const response = await api.post('/favorites/toggle/', {
        media_id: movie.id.toString(),
        title: movie.title || movie.name || 'Conteúdo',
        media_type: movie.media_type || (movie.title ? 'filme' : 'série')
      })
      
      if (response.data.action === 'added') {
        // ✅ ADICIONAR AO ARRAY LOCAL
        favorites.value.unshift({
          id: response.data.favorite.id,
          media_id: movie.id.toString(),
          addedAt: response.data.favorite.created_at,
          ...movie
        })
        console.log('✅ Favorito adicionado via toggle, email enviado')
        
        // ✅ ADICIONAR - Recarregar notificações após 500ms
        setTimeout(() => {
          console.log('🔔 Recarregando notificações...')
          loadNotifications()
        }, 500)
        
        return true
      } else {
        // ✅ REMOVER DO ARRAY LOCAL
        favorites.value = favorites.value.filter(f => f.media_id !== movie.id.toString())
        console.log('✅ Favorito removido via toggle')
        return false
      }
    } catch (error) {
      console.error('Erro ao toggle favorito:', error)
      throw error
    }
  }

  // ✅ MANTIDO PARA COMPATIBILIDADE (mas não é mais usado)
  const addFavorite = async (movie) => {
    return await toggleFavorite(movie)
  }

  // ✅ MANTIDO PARA COMPATIBILIDADE (mas não é mais usado)
  const removeFavorite = async (mediaId) => {
    const movie = favorites.value.find(f => f.media_id === mediaId.toString())
    if (movie) {
      return await toggleFavorite(movie)
    }
  }

  const isFavorite = (mediaId) => {
    return favorites.value.some(f => f.media_id === mediaId.toString())
  }

  const clearAllFavorites = async () => {
    try {
      await api.delete('/favorites/clear_all/')
      favorites.value = []
      console.log('✅ Todos os favoritos removidos')
    } catch (error) {
      console.error('Erro ao limpar favoritos:', error)
      throw error
    }
  }

  const favoritesCount = computed(() => favorites.value.length)

  return {
    favorites,
    loading,
    favoritesCount,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
  }
}
