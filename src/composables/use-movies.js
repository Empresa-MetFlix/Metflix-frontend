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
let globalMoviesState = null;

export function useMovies() {
  if (!globalMoviesState) {
    globalMoviesState = {
      heroMovie: ref(null),
      trendingMovies: ref([]),
      popularMovies: ref([]),
      topRatedMovies: ref([]),
      actionMovies: ref([]),
      comedyMovies: ref([]),
      horrorMovies: ref([]),
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
          globalMoviesState.loading.value = false;
        } catch (err) {
          console.error("Erro ao carregar filmes:", err);
          globalMoviesState.error.value =
            "Erro ao carregar filmes. Verifique sua API Key do TMDB.";
          globalMoviesState.loading.value = false;
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
    heroMovie: globalMoviesState.heroMovie,
    trendingMovies: globalMoviesState.trendingMovies,
    popularMovies: globalMoviesState.popularMovies,
    topRatedMovies: globalMoviesState.topRatedMovies,
    actionMovies: globalMoviesState.actionMovies,
    comedyMovies: globalMoviesState.comedyMovies,
    horrorMovies: globalMoviesState.horrorMovies,
    allMovies: globalMoviesState.allMovies,
    loading: globalMoviesState.loading,
    error: globalMoviesState.error,
    loadMovies: globalMoviesState.loadMovies,
    getMovieById: globalMoviesState.getMovieById,
    searchMovies: globalMoviesState.searchMovies,
  };
}
