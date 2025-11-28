// ✅ USAR VARIÁVEIS DE AMBIENTE DO VITE
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '0ad4409dd89b198348fe7f0ca70e1e11'
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'

// ============================================
// FUNÇÕES DE FILMES
// ============================================

const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&language=pt-BR`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status, response.statusText)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformMovie) : []
  } catch (error) {
    console.error('❌ Erro ao buscar trending:', error)
    return []
  }
}

const getPopularMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformMovie) : []
  } catch (error) {
    console.error('❌ Erro ao buscar filmes populares:', error)
    return []
  }
}

const getTopRatedMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformMovie) : []
  } catch (error) {
    console.error('❌ Erro ao buscar top rated:', error)
    return []
  }
}

const getMoviesByGenre = async (genreId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformMovie) : []
  } catch (error) {
    console.error(`❌ Erro ao buscar filmes do gênero ${genreId}:`, error)
    return []
  }
}

const getMovieDetails = async (movieId) => {
  try {
    const [details, credits, videos, similar] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`).then(r => r.json()),
      fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=pt-BR`).then(r => r.json()),
      fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`).then(r => r.json()),
      fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=pt-BR&page=1`).then(r => r.json())
    ])

    const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    const cast = credits.cast?.slice(0, 5).map(c => c.name).join(', ')
    const director = credits.crew?.find(c => c.job === 'Director')

    return {
      id: details.id,
      title: details.title,
      description: details.overview,
      tagline: details.tagline,
      image: details.poster_path 
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : 'https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem',
      backgroundImage: details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : null,
      year: details.release_date ? details.release_date.split('-')[0] : 'N/A',
      runtime: details.runtime,
      genres: details.genres?.map(g => g.name) || [],
      voteAverage: details.vote_average,
      ageRating: '14',
      quality: 'HD',
      cast: cast || 'N/A',
      director: director ? director.name : 'N/A',
      trailer: trailer ? trailer.key : null,
      similarMovies: similar.results?.slice(0, 6).map(transformMovie) || [],
      mediaType: 'movie',
      originalLanguage: details.original_language
    }
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes do filme:', error)
    return null
  }
}

// ============================================
// FUNÇÕES DE SÉRIES (TV SHOWS)
// ============================================

const getTrendingTV = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformTVShow) : []
  } catch (error) {
    console.error('❌ Erro ao buscar séries em alta:', error)
    return []
  }
}

const getPopularTV = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformTVShow) : []
  } catch (error) {
    console.error('❌ Erro ao buscar séries populares:', error)
    return []
  }
}

const getTopRatedTV = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformTVShow) : []
  } catch (error) {
    console.error('❌ Erro ao buscar séries top rated:', error)
    return []
  }
}

const getTVByGenre = async (genreId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results ? data.results.map(transformTVShow) : []
  } catch (error) {
    console.error(`❌ Erro ao buscar séries do gênero ${genreId}:`, error)
    return []
  }
}

const getTVShowDetails = async (tvId) => {
  try {
    const [details, credits, videos, similar] = await Promise.all([
      fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=pt-BR`).then(r => r.json()),
      fetch(`${BASE_URL}/tv/${tvId}/credits?api_key=${API_KEY}&language=pt-BR`).then(r => r.json()),
      fetch(`${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=pt-BR`).then(r => r.json()),
      fetch(`${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}&language=pt-BR&page=1`).then(r => r.json())
    ])

    const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    const cast = credits.cast?.slice(0, 5).map(c => c.name).join(', ')
    const creator = details.created_by && details.created_by.length > 0 
      ? details.created_by[0].name 
      : 'N/A'

    return {
      id: details.id,
      title: details.name,
      description: details.overview,
      tagline: details.tagline,
      image: details.poster_path 
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : 'https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem',
      backgroundImage: details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : null,
      year: details.first_air_date ? details.first_air_date.split('-')[0] : 'N/A',
      numberOfSeasons: details.number_of_seasons,
      numberOfEpisodes: details.number_of_episodes,
      genres: details.genres?.map(g => g.name) || [],
      voteAverage: details.vote_average,
      ageRating: '14',
      quality: 'HD',
      cast: cast || 'N/A',
      creator: creator,
      trailer: trailer ? trailer.key : null,
      similarMovies: similar.results?.slice(0, 6).map(transformTVShow) || [],
      mediaType: 'tv',
      originalLanguage: details.original_language
    }
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes da série:', error)
    return null
  }
}

// ============================================
// BUSCA
// ============================================

const searchMulti = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
    )
    if (!response.ok) {
      console.error('❌ Erro TMDB API:', response.status)
      return []
    }
    const data = await response.json()
    return data.results
      ?.filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => item.media_type === 'tv' ? transformTVShow(item) : transformMovie(item)) || []
  } catch (error) {
    console.error('❌ Erro ao buscar:', error)
    return []
  }
}

// ============================================
// TRANSFORMAÇÕES
// ============================================

const transformMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title || movie.original_title,
    description: movie.overview,
    image: movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem',
    backgroundImage: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
    voteAverage: movie.vote_average,
    genres: movie.genre_ids || [],
    mediaType: 'movie',
    originalLanguage: movie.original_language,
    popularity: movie.popularity
  }
}

const transformTVShow = (tv) => {
  return {
    id: tv.id,
    title: tv.name || tv.original_name,
    description: tv.overview,
    image: tv.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
      : 'https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem',
    backgroundImage: tv.backdrop_path
      ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
      : null,
    year: tv.first_air_date ? tv.first_air_date.split('-')[0] : 'N/A',
    voteAverage: tv.vote_average,
    genres: tv.genre_ids || [],
    mediaType: 'tv',
    originalLanguage: tv.original_language,
    popularity: tv.popularity
  }
}

// ============================================
// EXPORT
// ============================================

export default {
  // Filmes
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getMovieDetails,
  
  // Séries (TV Shows)
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getTVByGenre,
  getTVShowDetails,
  
  // Busca
  searchMulti
}
