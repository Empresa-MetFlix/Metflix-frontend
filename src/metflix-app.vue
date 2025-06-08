<template>
  <div class="metflix-app">
    <!-- Header -->
    <Navbar />

    <!-- Hero Section -->
    <HeroSection 
      :hero-movie="heroMovie"
      @play-movie="handlePlayMovie"
      @show-more-info="handleShowMoreInfo"
    />

    <!-- Content Sections -->
    <main class="content-container">
      <!-- Trending Now -->
      <MovieSection 
        title="Em alta"
        :movies="trendingMovies"
        @select-movie="handleMovieSelect"
      />
      
      <!-- Netflix Originals -->
      <MovieSection 
        title="Originais Metflix"
        :movies="originalMovies"
        @select-movie="handleMovieSelect"
      />
      
      <!-- Action Movies -->
      <MovieSection 
        title="Filmes de Ação"
        :movies="actionMovies"
        @select-movie="handleMovieSelect"
      />
      
      <!-- Comedy Movies -->
      <MovieSection 
        title="Comédias"
        :movies="comedyMovies"
        @select-movie="handleMovieSelect"
      />
      
      <!-- Horror Movies -->
      <MovieSection 
        title="Terror"
        :movies="horrorMovies"
        @select-movie="handleMovieSelect"
      />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-social">
          <a href="#" class="footer-social-link">
            <Facebook class="footer-social-icon" />
          </a>
          <a href="#" class="footer-social-link">
            <Instagram class="footer-social-icon" />
          </a>
          <a href="#" class="footer-social-link">
            <Twitter class="footer-social-icon" />
          </a>
          <a href="#" class="footer-social-link">
            <Youtube class="footer-social-icon" />
          </a>
        </div>
        
        <div class="footer-links">
          <div class="footer-links-column">
            <a href="#" class="footer-link">Audiodescrição</a>
            <a href="#" class="footer-link">Relações com investidores</a>
            <a href="#" class="footer-link">Avisos legais</a>
          </div>
          <div class="footer-links-column">
            <a href="#" class="footer-link">Central de ajuda</a>
            <a href="#" class="footer-link">Carreiras</a>
            <a href="#" class="footer-link">Preferências de cookies</a>
          </div>
          <div class="footer-links-column">
            <a href="#" class="footer-link">Cartão pré-pago</a>
            <a href="#" class="footer-link">Termos de uso</a>
            <a href="#" class="footer-link">Informações corporativas</a>
          </div>
          <div class="footer-links-column">
            <a href="#" class="footer-link">Imprensa</a>
            <a href="#" class="footer-link">Privacidade</a>
            <a href="#" class="footer-link">Entre em contato</a>
          </div>
        </div>
        
        <div class="footer-service">
          <button class="footer-service-button">Código de serviço</button>
        </div>
        
        <div class="footer-copyright">
          © 2023-2024 Metflix, Inc.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/navbar.vue'
import HeroSection from './components/hero-section.vue'
import MovieSection from './components/movie-section.vue'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-vue-next'
import { useMovies } from './composables/use-movies.js'

// Use the movies composable
const {
  heroMovie,
  trendingMovies,
  originalMovies,
  actionMovies,
  comedyMovies,
  horrorMovies
} = useMovies()

// Event handlers
const handlePlayMovie = (movie) => {
  console.log('Playing movie:', movie.title)
}

const handleShowMoreInfo = (movie) => {
  console.log('Showing more info for:', movie.title)
}

const handleMovieSelect = (movie) => {
  console.log('Movie selected:', movie.title)
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: "Roboto", sans-serif;
  background-color: #141414;
  color: #fff;
  overflow-x: hidden;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  background-color: #141414;
}

button {
  cursor: pointer;
  font-family: "Roboto", sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  height: auto;
}

ul, ol {
  list-style: none;
}
</style>

<style scoped>
.metflix-app {
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
}

.content-container {
  position: relative;
  z-index: 10;
  margin-top: -150px;
  padding-bottom: 5rem;
}

.footer {
  background-color: #141414;
  padding: 3rem 4%;
  color: #808080;
}

.footer-content {
  max-width: 980px;
  margin: 0 auto;
}

.footer-social {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.footer-social-link {
  color: #808080;
  transition: color 0.2s ease;
}

.footer-social-link:hover {
  color: #fff;
}

.footer-social-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .footer-links {
    grid-template-columns: repeat(4, 1fr);
  }
}

.footer-links-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-link {
  color: #808080;
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-service {
  margin-bottom: 1.5rem;
}

.footer-service-button {
  background: transparent;
  border: 1px solid #808080;
  color: #808080;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-service-button:hover {
  color: #fff;
  border-color: #fff;
}

.footer-copyright {
  font-size: 0.8rem;
}
</style>
