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
 const toggleFavorite = async (movieData, mediaType = 'movie') => {
  // ✅ Aceitar tanto o ID quanto o objeto inteiro
  const movieId = typeof movieData === 'object' ? movieData.id : movieData
  const type = typeof movieData === 'object' ? (movieData.mediaType || mediaType) : mediaType
  
  console.log('🔄 Toggle favorito - ID:', movieId, 'Type:', type)
  
  try {
    const response = await api.post('/favorites/toggle/', {
      media_id: movieId,  // ✅ MUDAR DE movie_id para media_id
      media_type: type
    })
    
    if (response.data.action === 'removed') {
      console.log('✅ Favorito removido via toggle')
      favorites.value = favorites.value.filter(fav => fav.id !== movieId)
    } else {
      console.log('✅ Favorito adicionado via toggle')
      // Se não tiver o filme completo na resposta, fazer busca
      if (!response.data.movie) {
        await loadFavorites()
      } else {
        favorites.value.push(response.data.movie)
      }
    }
    
    return response.data
  } catch (error) {
    console.error('❌ Erro ao toggle favorito:', error)
    console.error('❌ Detalhes:', error.response?.data) // Ver o que o backend está respondendo
    
    // ✅ Mensagem mais amigável
    if (error.response?.status === 400) {
      console.error('❌ Dados enviados:', { media_id: movieId, media_type: type })
      alert('Erro ao processar favorito. Dados inválidos.')
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      alert('Erro de conexão com o servidor. Por favor, tente novamente mais tarde.')
    } else if (error.response?.status === 500) {
      alert('Erro no servidor. Por favor, tente novamente mais tarde.')
    } else {
      alert('Erro ao adicionar/remover favorito. Tente novamente.')
    }
    
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
