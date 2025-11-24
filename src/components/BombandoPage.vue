<template>
  <div class="bombando-page">

    <!-- Hero: Destaque Principal igual à Home -->
    <section
      class="hero"
      :style="{
        backgroundImage: `url(${heroMovie.backgroundImage})`,
      }"
    >
      <div class="hero-content">
        <h1>{{ heroMovie.title }}</h1>
        <p>{{ heroMovie.description }}</p>

        <div class="hero-buttons">
          <button class="btn btn-primary">
            ▶ Assistir
          </button>

          <button class="btn btn-secondary">
            ⊕ Minha Lista
          </button>
        </div>
      </div>
    </section>

    <!-- Lista principal: Bombando no momento -->
    <MovieRow title="🔥 Bombando Agora" :items="trendingMovies" />

    <!-- Segunda sessão — Criativa: “Explosões Recentes” -->
    <div class="creative-section">
      <h2>💥 Explosões Recentes</h2>
      <div class="creative-grid">
        <div
          v-for="movie in actionMovies"
          :key="movie.id"
          class="creative-card"
        >
          <img :src="movie.image" :alt="movie.title" />
          <div class="overlay">
            <h3>{{ movie.title }}</h3>

            <button class="btn btn-primary small-btn">
              ▶ Assistir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 3 — Humor que está viralizando -->
    <MovieRow title="😂 Bombando em Comédia" :items="comedyMovies" />

  </div>
</template>

<script setup>
import { useMovies } from "../composables/use-movies"
import MovieRow from "../components/MovieRow.vue"

const {
  heroMovie,
  trendingMovies,
  actionMovies,
  comedyMovies,
} = useMovies()
</script>

<style scoped>
.bombando-page {
  background-color: #000;
  color: white;
  min-height: 100vh;
}

/* HERO */
.hero {
  height: 70vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 60px;
  position: relative;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.85));
}

.hero-content {
  position: relative;
  max-width: 600px;
  z-index: 2;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 15px;
}

.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

/* Botões iguais aos da Home */
.hero-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: white;
  color: black;
}

.btn-secondary {
  background: rgba(109, 109, 110, 0.7);
  backdrop-filter: blur(4px);
  color: white;
}

.btn:hover {
  transform: scale(1.05);
  transition: 0.2s;
}

/* Creative Section */
.creative-section {
  padding: 30px;
  margin-top: 40px;
}

.creative-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

/* Grid estiloso */
.creative-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 20px;
}

.creative-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s;
}

.creative-card:hover {
  transform: scale(1.06);
}

.creative-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* Overlay criativo */
.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.9));
  opacity: 0;
  transition: 0.3s;
}

.creative-card:hover .overlay {
  opacity: 1;
}

.overlay h3 {
  margin: 0 0 10px;
}

.small-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
}
</style>
