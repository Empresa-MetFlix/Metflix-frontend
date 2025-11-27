import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

// Instância do axios para TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'pt-BR'
  }
})

// Helpers para URLs de imagens
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/141414/ffffff?text=Sem+Imagem'
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720/141414/ffffff?text=Sem+Imagem'
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Normalizar dados do TMDB para formato do app
const normalizeMovie = (item, mediaType = 'movie') => {
  const isMovie = mediaType === 'movie' || item.media_type === 'movie'
  
  return {
    id: item.id,
    title: isMovie ? item.title : item.name,
    originalTitle: isMovie ? item.original_title : item.original_name,
    description: item.overview || 'Descrição não disponível.',
    image: getImageUrl(item.poster_path),
    backgroundImage: getBackdropUrl(item.backdrop_path),
    year: isMovie 
      ? item.release_date?.split('-')[0] 
      : item.first_air_date?.split('-')[0],
    releaseDate: isMovie ? item.release_date : item.first_air_date,
    voteAverage: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    genreIds: item.genre_ids || [],
    mediaType: mediaType || item.media_type,
    adult: item.adult,
    originalLanguage: item.original_language,
    
    // Campos calculados
    relevance: Math.round(item.vote_average * 10),
    ageRating: item.adult ? '18' : '14',
    quality: item.vote_average > 7.5 ? '4K' : 'HD'
  }
}

// ========== ENDPOINTS ==========

// Filmes em Alta (Trending)
export const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`)
    return response.data.results.map(item => normalizeMovie(item, mediaType))
  } catch (error) {
    console.error('Erro ao buscar trending:', error)
    return []
  }
}

// Filmes Populares
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', { params: { page } })
    return response.data.results.map(item => normalizeMovie(item, 'movie'))
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error)
    return []
  }
}

// Séries Populares
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', { params: { page } })
    return response.data.results.map(item => normalizeMovie(item, 'tv'))
  } catch (error) {
    console.error('Erro ao buscar séries populares:', error)
    return []
  }
}

// Filmes Top Rated
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', { params: { page } })
    return response.data.results.map(item => normalizeMovie(item, 'movie'))
  } catch (error) {
    console.error('Erro ao buscar top rated:', error)
    return []
  }
}

// Filmes em Lançamento
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', { params: { page } })
    return response.data.results.map(item => normalizeMovie(item, 'movie'))
  } catch (error) {
    console.error('Erro ao buscar lançamentos:', error)
    return []
  }
}

// Filmes por Gênero
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page
      }
    })
    return response.data.results.map(item => normalizeMovie(item, 'movie'))
  } catch (error) {
    console.error('Erro ao buscar filmes por gênero:', error)
    return []
  }
}

// Séries por Gênero
export const getTVShowsByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page
      }
    })
    return response.data.results.map(item => normalizeMovie(item, 'tv'))
  } catch (error) {
    console.error('Erro ao buscar séries por gênero:', error)
    return []
  }
}

// Buscar (Filmes e Séries)
export const searchMulti = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: { query, page }
    })
    return response.data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => normalizeMovie(item))
  } catch (error) {
    console.error('Erro ao buscar:', error)
    return []
  }
}

// Detalhes do Filme
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar'
      }
    })
    
    const data = response.data
    
    return {
      ...normalizeMovie(data, 'movie'),
      genres: data.genres?.map(g => g.name) || [],
      runtime: data.runtime,
      budget: data.budget,
      revenue: data.revenue,
      status: data.status,
      tagline: data.tagline,
      cast: data.credits?.cast?.slice(0, 10).map(c => c.name).join(', ') || 'N/A',
      director: data.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A',
      trailer: data.videos?.results?.find(v => v.type === 'Trailer')?.key || null,
      similarMovies: data.similar?.results?.slice(0, 6).map(item => normalizeMovie(item, 'movie')) || []
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error)
    return null
  }
}

// Detalhes da Série
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits,videos,similar'
      }
    })
    
    const data = response.data
    
    return {
      ...normalizeMovie(data, 'tv'),
      genres: data.genres?.map(g => g.name) || [],
      numberOfSeasons: data.number_of_seasons,
      numberOfEpisodes: data.number_of_episodes,
      episodeRunTime: data.episode_run_time?.[0] || null,
      status: data.status,
      tagline: data.tagline,
      cast: data.credits?.cast?.slice(0, 10).map(c => c.name).join(', ') || 'N/A',
      creator: data.created_by?.[0]?.name || 'N/A',
      trailer: data.videos?.results?.find(v => v.type === 'Trailer')?.key || null,
      similarShows: data.similar?.results?.slice(0, 6).map(item => normalizeMovie(item, 'tv')) || []
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error)
    return null
  }
}

// Listar Gêneros
export const getGenres = async (mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/genre/${mediaType}/list`)
    return response.data.genres
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error)
    return []
  }
}

export default {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  getTopRatedMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  getTVShowsByGenre,
  searchMulti,
  getMovieDetails,
  getTVShowDetails,
  getGenres,
  getImageUrl,
  getBackdropUrl
}
