import { ref, onMounted, computed } from "vue";
import tmdbService from "@/api/services/tmdbService.js";

const GENRE_IDS = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  DRAMA: 18,
  SCIFI: 878,
  THRILLER: 53,
};

// TV GENRE IDS
const TV_GENRE_IDS = {
  ACTION_ADVENTURE: 10759,
  COMEDY: 35,
  CRIME: 80,
  DRAMA: 18,
  SCIFI_FANTASY: 10765,
};

let globalMoviesState = null;

export function useMovies() {
  if (!globalMoviesState) {
    globalMoviesState = {
      // FILMES
      heroMovie: ref(null),
      trendingMovies: ref([]),
      popularMovies: ref([]),
      topRatedMovies: ref([]),
      actionMovies: ref([]),
      comedyMovies: ref([]),
      horrorMovies: ref([]),
      
      // SÉRIES
      trendingSeries: ref([]),
      popularSeries: ref([]),
      topRatedSeries: ref([]),
      actionSeries: ref([]),
      comedySeries: ref([]),
      dramaSeries: ref([]),
      crimeSeries: ref([]),
      
      loading: ref(true),
      error: ref(null),
      
      allMovies: computed(() => {
        return [
          ...globalMoviesState.trendingMovies.value,
          ...globalMoviesState.popularMovies.value,
          ...globalMoviesState.topRatedMovies.value,
          ...globalMoviesState.actionMovies.value,
          ...globalMoviesState.comedyMovies.value,
          ...globalMoviesState.horrorMovies.value,
        ];
      }),
      
      allSeries: computed(() => {
        return [
          ...globalMoviesState.trendingSeries.value,
          ...globalMoviesState.popularSeries.value,
          ...globalMoviesState.topRatedSeries.value,
          ...globalMoviesState.actionSeries.value,
          ...globalMoviesState.comedySeries.value,
          ...globalMoviesState.dramaSeries.value,
          ...globalMoviesState.crimeSeries.value,
        ];
      }),
      
      // CARREGAR FILMES
      loadMovies: async () => {
        try {
          globalMoviesState.loading.value = true;
          globalMoviesState.error.value = null;
          
          const [trending, popular, topRated, action, comedy, horror] =
            await Promise.all([
              tmdbService.getTrending("movie", "week"),
              tmdbService.getPopularMovies(),
              tmdbService.getTopRatedMovies(),
              tmdbService.getMoviesByGenre(GENRE_IDS.ACTION),
              tmdbService.getMoviesByGenre(GENRE_IDS.COMEDY),
              tmdbService.getMoviesByGenre(GENRE_IDS.HORROR),
            ]);
          
          globalMoviesState.trendingMovies.value = trending;
          globalMoviesState.popularMovies.value = popular;
          globalMoviesState.topRatedMovies.value = topRated;
          globalMoviesState.actionMovies.value = action;
          globalMoviesState.comedyMovies.value = comedy;
          globalMoviesState.horrorMovies.value = horror;
          globalMoviesState.heroMovie.value = trending[0] || null;
          
          // CARREGAR SÉRIES TAMBÉM
          await globalMoviesState.loadSeries();
          
          globalMoviesState.loading.value = false;
        } catch (err) {
          console.error("Erro ao carregar filmes:", err);
          globalMoviesState.error.value =
            "Erro ao carregar conteúdo. Verifique sua API Key do TMDB.";
          globalMoviesState.loading.value = false;
        }
      },
      
      // CARREGAR SÉRIES
      loadSeries: async () => {
        try {
          const [trending, popular, topRated, action, comedy, drama, crime] =
            await Promise.all([
              tmdbService.getTrendingTV(),
              tmdbService.getPopularTV(),
              tmdbService.getTopRatedTV(),
              tmdbService.getTVByGenre(TV_GENRE_IDS.ACTION_ADVENTURE),
              tmdbService.getTVByGenre(TV_GENRE_IDS.COMEDY),
              tmdbService.getTVByGenre(TV_GENRE_IDS.DRAMA),
              tmdbService.getTVByGenre(TV_GENRE_IDS.CRIME),
            ]);
          
          globalMoviesState.trendingSeries.value = trending;
          globalMoviesState.popularSeries.value = popular;
          globalMoviesState.topRatedSeries.value = topRated;
          globalMoviesState.actionSeries.value = action;
          globalMoviesState.comedySeries.value = comedy;
          globalMoviesState.dramaSeries.value = drama;
          globalMoviesState.crimeSeries.value = crime;
        } catch (err) {
          console.error("Erro ao carregar séries:", err);
        }
      },
      
      getMovieById: async (id, mediaType = "movie") => {
        try {
          if (mediaType === "tv") {
            return await tmdbService.getTVShowDetails(id);
          }
          return await tmdbService.getMovieDetails(id);
        } catch (err) {
          console.error("Erro ao buscar detalhes:", err);
          return null;
        }
      },
      
      searchMovies: async (query) => {
        try {
          return await tmdbService.searchMulti(query);
        } catch (err) {
          console.error("Erro ao buscar:", err);
          return [];
        }
      },
    };
  }
  
  onMounted(() => {
    if (globalMoviesState.trendingMovies.value.length === 0) {
      globalMoviesState.loadMovies();
    }
  });

  return {
    // FILMES
    heroMovie: globalMoviesState.heroMovie,
    trendingMovies: globalMoviesState.trendingMovies,
    popularMovies: globalMoviesState.popularMovies,
    topRatedMovies: globalMoviesState.topRatedMovies,
    actionMovies: globalMoviesState.actionMovies,
    comedyMovies: globalMoviesState.comedyMovies,
    horrorMovies: globalMoviesState.horrorMovies,
    allMovies: globalMoviesState.allMovies,
    
    // SÉRIES
    trendingSeries: globalMoviesState.trendingSeries,
    popularSeries: globalMoviesState.popularSeries,
    topRatedSeries: globalMoviesState.topRatedSeries,
    actionSeries: globalMoviesState.actionSeries,
    comedySeries: globalMoviesState.comedySeries,
    dramaSeries: globalMoviesState.dramaSeries,
    crimeSeries: globalMoviesState.crimeSeries,
    allSeries: globalMoviesState.allSeries,
    
    // FUNÇÕES
    loading: globalMoviesState.loading,
    error: globalMoviesState.error,
    loadMovies: globalMoviesState.loadMovies,
    loadSeries: globalMoviesState.loadSeries,
    getMovieById: globalMoviesState.getMovieById,
    searchMovies: globalMoviesState.searchMovies,
  };
}
