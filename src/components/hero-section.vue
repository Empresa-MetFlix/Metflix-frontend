<template>
  <section class="hero">
    <div 
      class="hero-background"
      :style="{ backgroundImage: `url('${heroMovie.backgroundImage}')` }"
    >
      <div class="hero-overlay"></div>
    </div>
    
    <div class="hero-content">
      <h1 class="hero-title">{{ heroMovie.title }}</h1>
      <p class="hero-description">
        {{ heroMovie.description }}
      </p>
      <div class="hero-buttons">
        <button 
          @click="playMovie"
          class="hero-button hero-button-play"
        >
          <Play class="hero-button-icon" />
          Assistir
        </button>
        <button 
          @click="showMoreInfo"
          class="hero-button hero-button-info"
        >
          <Info class="hero-button-icon" />
          Mais informações
        </button>
      </div>
    </div>
    
    <div class="hero-age-rating">
      <span class="hero-rating">16</span>
    </div>
  </section>
</template>

<script setup>
import { Play, Info } from 'lucide-vue-next'

const props = defineProps({
  heroMovie: {
    type: Object,
    default: () => ({
      title: 'Stranger Things',
      description: 'Quando um garoto desaparece, uma pequena cidade descobre um mistério envolvendo experimentos secretos, forças sobrenaturais aterrorizantes e uma garota muito estranha.',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80'
    })
  }
})

const emit = defineEmits(['play-movie', 'show-more-info'])

const playMovie = () => {
  emit('play-movie', props.heroMovie)
}

const showMoreInfo = () => {
  emit('show-more-info', props.heroMovie)
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 20%;
  background-repeat: no-repeat;
  background-color: #141414;
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
    rgba(20,20,20,0) 20%
  );
}

.hero-content {
  position: relative;
  z-index: 10;
  padding: 0 4%;
  max-width: 700px;
  margin-top: 80px;
}

@media (min-width: 768px) {
  .hero-content {
    padding: 0 60px;
    max-width: 800px;
  }
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 4.5rem;
    margin-bottom: 2rem;
  }
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #e5e5e5;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  max-width: 500px;
}

@media (min-width: 768px) {
  .hero-description {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
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
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 140px;
}

@media (min-width: 768px) {
  .hero-button {
    padding: 12px 24px;
    font-size: 1.1rem;
    min-width: 160px;
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
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
}

.hero-age-rating {
  position: absolute;
  bottom: 35%;
  right: 0;
  background-color: rgba(51, 51, 51, 0.6);
  border-left: 3px solid #fff;
  padding: 0.5rem 4% 0.5rem 1rem;
  display: flex;
  align-items: center;
}

.hero-rating {
  color: #fff;
  font-weight: 500;
  font-size: 1.1rem;
}
</style>
