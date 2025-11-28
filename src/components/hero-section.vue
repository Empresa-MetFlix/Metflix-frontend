<template>
  <section class="hero">
    <!-- ✅ BACKGROUNDS COM TRANSIÇÃO -->
    <div 
      v-for="(movie, index) in featuredMovies"
      :key="`bg-${movie.id}`"
      class="hero-background"
      :class="{ active: index === currentIndex }"
      :style="{ backgroundImage: `url('${movie.backgroundImage}')` }"
    >
      <div class="hero-overlay"></div>
    </div>
    
    <!-- ✅ CONTEÚDO COM POSITION ABSOLUTE - UM POR VEZ -->
    <div 
      v-for="(movie, index) in featuredMovies"
      :key="`content-${movie.id}`"
      class="hero-content-wrapper"
      :class="{ active: index === currentIndex }"
    >
      <div class="hero-content">
        <h1 class="hero-title">{{ movie.title }}</h1>
        <p class="hero-description">{{ movie.description }}</p>
        <div class="hero-buttons">
          <button 
            @click="playMovie(movie)"
            class="hero-button hero-button-play"
          >
            <Play class="hero-button-icon" />
            Assistir
          </button>
          <button 
            @click="showMoreInfo(movie)"
            class="hero-button hero-button-info"
          >
            <Info class="hero-button-icon" />
            Mais informações
          </button>
        </div>
      </div>
    </div>
    
    <!-- ✅ INDICADORES -->
    <div class="hero-indicators">
      <button
        v-for="(movie, index) in featuredMovies"
        :key="`indicator-${index}`"
        class="hero-indicator"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      >
        <span class="hero-indicator-bar"></span>
      </button>
    </div>
    
    <!-- ✅ CLASSIFICAÇÃO ETÁRIA -->
    <div class="hero-age-rating">
      <span class="hero-rating">{{ featuredMovies[currentIndex]?.ageRating || '16' }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Play, Info } from 'lucide-vue-next'

const props = defineProps({
  featuredMovies: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['play-movie', 'show-more-info'])

const currentIndex = ref(0)
let autoplayInterval = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.featuredMovies.length
}

const goToSlide = (index) => {
  currentIndex.value = index
  resetAutoplay()
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    nextSlide()
  }, 7000)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const playMovie = (movie) => {
  emit('play-movie', movie)
}

const showMoreInfo = (movie) => {
  emit('show-more-info', movie)
}

onMounted(() => {
  if (props.featuredMovies.length > 1) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
/* ✅ HERO MAIS COMPACTO ESTILO NETFLIX */
.hero {
  position: relative;
  height: 80vh; /* ✅ Reduzido de 100vh para 80vh */
  min-height: 500px; /* ✅ Reduzido de 700px */
  max-height: 700px; /* ✅ Limitar altura máxima */
  display: flex;
  align-items: center;
  overflow: hidden;
}

@media (max-width: 768px) {
  .hero {
    height: 70vh;
    min-height: 450px;
  }
}

/* ✅ BACKGROUNDS */
.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 20%;
  background-repeat: no-repeat;
  background-color: #141414;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  pointer-events: none;
}

.hero-background.active {
  opacity: 1;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg, 
    rgba(0,0,0,0.8) 0%, 
    rgba(0,0,0,0.6) 30%, 
    rgba(0,0,0,0.4) 60%, 
    rgba(0,0,0,0.2) 100%
  ),
  linear-gradient(
    0deg,
    rgba(20,20,20,1) 0%,
    rgba(20,20,20,0.8) 10%,
    rgba(20,20,20,0) 30%
  );
}

/* ✅ WRAPPER DO CONTEÚDO - POSITION ABSOLUTE */
.hero-content-wrapper {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.8s ease;
}

.hero-content-wrapper.active {
  opacity: 1;
  pointer-events: auto;
}

/* ✅ CONTEÚDO INTERNO */
.hero-content {
  padding: 0 4%;
  max-width: 600px; /* ✅ Reduzido de 700px */
  margin-top: 50px; /* ✅ Reduzido de 80px */
}

@media (min-width: 768px) {
  .hero-content {
    padding: 0 60px;
    max-width: 700px; /* ✅ Reduzido de 800px */
  }
}

.hero-title {
  font-size: 2rem; /* ✅ Reduzido de 2.5rem */
  font-weight: bold;
  margin-bottom: 1rem; /* ✅ Reduzido de 1.5rem */
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.5rem; /* ✅ Reduzido de 4.5rem */
    margin-bottom: 1.5rem; /* ✅ Reduzido de 2rem */
  }
}

.hero-description {
  font-size: 1rem; /* ✅ Reduzido de 1.1rem */
  margin-bottom: 1.5rem; /* ✅ Reduzido de 2rem */
  color: #e5e5e5;
  line-height: 1.5; /* ✅ Reduzido de 1.6 */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  max-width: 450px; /* ✅ Reduzido de 500px */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* ✅ Limitar a 3 linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-description {
    font-size: 1.1rem; /* ✅ Reduzido de 1.25rem */
    margin-bottom: 2rem; /* ✅ Reduzido de 2.5rem */
  }
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px; /* ✅ Reduzido padding vertical */
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 130px; /* ✅ Reduzido de 140px */
}

@media (min-width: 768px) {
  .hero-button {
    padding: 12px 28px;
    font-size: 1.05rem; /* ✅ Reduzido de 1.1rem */
    min-width: 150px; /* ✅ Reduzido de 160px */
  }
}

.hero-button-play {
  background-color: #fff;
  color: #000;
}

.hero-button-play:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.hero-button-info {
  background-color: rgba(109, 109, 110, 0.7);
  color: #fff;
}

.hero-button-info:hover {
  background-color: rgba(109, 109, 110, 0.5);
}

.hero-button-icon {
  width: 1.1rem; /* ✅ Reduzido de 1.25rem */
  height: 1.1rem;
  margin-right: 0.6rem; /* ✅ Reduzido de 0.75rem */
}

.hero-indicators {
  position: absolute;
  bottom: 8%;
  right: 4%; /* ✅ Movido para direita como Netflix */
  display: flex;
  flex-direction: row;
  gap: 8px;
  z-index: 15;
  padding: 0;
}

@media (min-width: 768px) {
  .hero-indicators {
    bottom: 10%;
    right: 60px;
  }
}

.hero-indicator {
  width: 12px;
  height: 2px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.hero-indicator-bar {
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.hero-indicator.active .hero-indicator-bar {
  background-color: rgba(255, 255, 255, 1);
}

.hero-indicator:hover .hero-indicator-bar {
  background-color: rgba(255, 255, 255, 0.8);
}

/* ✅ CLASSIFICAÇÃO ETÁRIA */
.hero-age-rating {
  position: absolute;
  bottom: 35%;
  right: 0;
  background-color: rgba(51, 51, 51, 0.6);
  border-left: 3px solid #fff;
  padding: 0.4rem 4% 0.4rem 0.8rem; /* ✅ Mais compacto */
  display: flex;
  align-items: center;
  z-index: 10;
}

.hero-rating {
  color: #fff;
  font-weight: 500;
  font-size: 1rem; /* ✅ Reduzido de 1.1rem */
}
</style>
