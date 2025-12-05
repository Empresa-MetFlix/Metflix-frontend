<template>
  <div class="minha-lista">
    <header class="lista-header">
      <div class="lista-header__title-wrapper">
        <h1 class="page-title">
          <font-awesome-icon :icon="['fas', 'bookmark']" class="page-title__icon" />
          Minha Lista
        </h1>
        <p v-if="favorites.length > 0" class="page-subtitle">
          Sua coleção pessoal de filmes e séries
        </p>
      </div>

      <div v-if="favorites.length > 0" class="lista-controls">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar na sua lista..."
            class="search-input"
          />
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
        </div>

        <div class="filters">
          <select v-model="filterType" class="filter-select">
            <option value="all">Tudo</option>
            <option value="movie">Filmes</option>
            <option value="tv">Séries</option>
          </select>

          <select v-model="sortBy" class="filter-select">
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="title">A-Z</option>
            <option value="rating">Avaliação</option>
          </select>
        </div>
      </div>
    </header>

    <div v-if="favorites.length > 0" class="stats">
      <div class="stat-card stat-card--total">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-card stat-card--movies">
        <span class="stat-number">{{ stats.movies }}</span>
        <span class="stat-label">Filmes</span>
      </div>
      <div class="stat-card stat-card--series">
        <span class="stat-number">{{ stats.series }}</span>
        <span class="stat-label">Séries</span>
      </div>
    </div>

    <div v-if="favorites.length === 0 && !loading" class="empty-state">
      <font-awesome-icon :icon="['fas', 'tv']" class="empty-icon" />
      <h2>Sua lista está vazia</h2>
      <p>Adicione filmes e séries à sua lista para assistir depois.</p>
      <router-link to="/" class="browse-btn">
        <font-awesome-icon :icon="['fas', 'video']" class="btn-icon" />
        Explorar Conteúdo
      </router-link>
    </div>

    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando sua lista...</p>
    </div>

    <div v-else-if="filteredFavorites.length > 0">
      <div class="results-info">
        <p>
          {{ filteredFavorites.length }}
          {{ filteredFavorites.length === 1 ? "resultado" : "resultados" }}
        </p>
      </div>

      <div class="favorites-grid">
        <MovieCard
          v-for="movie in filteredFavorites"
          :key="`${movie.id}-${movie.mediaType}`"
          :movie="movie"
          :is-carousel="false"
          @select-movie="openMovieDetail"
          @play-movie="playMovie"
        />
      </div>
    </div>

    <div v-else class="no-results">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="no-results-icon" />
      <h3>Nenhum resultado encontrado</h3>
      <p>Tente buscar por outro título ou ajustar os filtros.</p>
      <button @click="clearFilters" class="clear-filters-btn">
        <font-awesome-icon :icon="['fas', 'filter']" class="filter-icon" />
        Limpar Filtros
      </button>
    </div>

    <MovieDetailModal
      :show="showModal"
      :movie="selectedMovie"
      @close="showModal = false"
      @open-similar="handleOpenSimilar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFavorites } from "@/composables/use-favorites.js";
import { useMovies } from "@/composables/use-movies.js";
import MovieCard from "@/components/movie-card.vue";
import MovieDetailModal from "@/components/movie-detail-modal.vue";

const { favorites, loading, loadFavorites } = useFavorites();
const { getMovieById } = useMovies();

const searchQuery = ref("");
const filterType = ref("all");
const sortBy = ref("recent");

const showModal = ref(false);
const selectedMovie = ref({});

const stats = computed(() => {
  const total = favorites.value.length;
  const movies = favorites.value.filter((f) => f.mediaType !== "tv").length;
  const series = favorites.value.filter((f) => f.mediaType === "tv").length;

  return { total, movies, series };
});

const filteredFavorites = computed(() => {
  let result = [...favorites.value];

  if (filterType.value !== "all") {
    if (filterType.value === "movie") {
      result = result.filter((f) => f.mediaType !== "tv");
    } else if (filterType.value === "tv") {
      result = result.filter((f) => f.mediaType === "tv");
    }
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (f) =>
        f.title?.toLowerCase().includes(query) ||
        f.description?.toLowerCase().includes(query)
    );
  }

  switch (sortBy.value) {
    case "recent":
      result.sort(
        (a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0)
      );
      break;
    case "oldest":
      result.sort(
        (a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0)
      );
      break;
    case "title":
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      break;
    case "rating":
      result.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
      break;
  }

  return result;
});

const clearFilters = () => {
  searchQuery.value = "";
  filterType.value = "all";
  sortBy.value = "recent";
};

const openMovieDetail = async (movie) => {
  const details = await getMovieById(movie.id, movie.mediaType);
  selectedMovie.value = details || movie;
  showModal.value = true;
};

const handleOpenSimilar = async (similar) => {
  showModal.value = false;
  await new Promise((resolve) => setTimeout(resolve, 300));
  const details = await getMovieById(similar.id, similar.mediaType || "movie");
  selectedMovie.value = details || similar;
  showModal.value = true;
};

const playMovie = (movie) => {
  console.log("Assistir:", movie.title);
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.minha-lista {
  min-height: 100vh;
  padding: 100px 4% 50px;
  background-color: #141414;
}

.lista-header {
  margin-bottom: 40px;
}

.lista-header__title-wrapper {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 8px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title__icon {
  font-size: 2.2rem;
  color: #e50914;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #999;
  margin: 0;
  font-weight: 400;
}

.lista-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #e50914;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.filter-select:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.filter-select:focus {
  outline: none;
  border-color: #e50914;
  box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1);
}

.filter-select option {
  background: #181818;
  padding: 10px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.15),
    rgba(229, 9, 20, 0.05)
  );
  border: 2px solid rgba(229, 9, 20, 0.3);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.3);
  border-color: rgba(229, 9, 20, 0.5);
}

.stat-card--total {
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.25),
    rgba(229, 9, 20, 0.1)
  );
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  color: #e50914;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.results-info {
  margin-bottom: 20px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.results-info p {
  color: #999;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 24px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(229, 9, 20, 0.2);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-container p {
  color: #999;
  font-size: 1.1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  margin-bottom: 24px;
  opacity: 0.5;
  color: #999;
}

.empty-state h2 {
  font-size: 2.2rem;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
}

.empty-state p {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 36px;
  max-width: 500px;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 36px;
  background: #e50914;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(229, 9, 20, 0.4);
}

.browse-btn:hover {
  background: #b20710;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.6);
}

.btn-icon {
  font-size: 1.2rem;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.4;
  color: #999;
}

.no-results h3 {
  font-size: 2rem;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
}

.no-results p {
  font-size: 1.1rem;
  color: #999;
  margin-bottom: 28px;
}

.clear-filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #e50914;
  transform: translateY(-2px);
}

.filter-icon {
  font-size: 0.95rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 32px;
  margin-top: 24px;
}

@media (max-width: 1024px) {
  .lista-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .filters {
    width: 100%;
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1;
    min-width: calc(50% - 6px);
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .favorites-grid {
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .minha-lista {
    padding: 90px 3% 40px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-title__icon {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .empty-icon {
    font-size: 4rem;
  }

  .empty-state h2 {
    font-size: 1.75rem;
  }
}
</style>
