<template>
  <section class="movie-section">
    <!-- TÍTULO COM "VER TUDO" -->
    <div 
      class="movie-section__header"
      @mouseenter="showExploreAll = true"
      @mouseleave="showExploreAll = false"
    >
      <h2 class="movie-section__title">{{ title }}</h2>
      <Transition name="explore-fade">
        <button 
          v-if="showExploreAll" 
          class="movie-section__explore-btn"
          @click="handleExploreAll"
        >
          Ver tudo
          <ChevronRight class="explore-icon" />
        </button>
      </Transition>
    </div>

    <!-- SLIDER COM SETAS -->
    <div class="movie-section__slider">
      <!-- SETA ESQUERDA -->
      <button 
        v-if="showLeftArrow"
        class="movie-section__arrow movie-section__arrow--left"
        @click="scrollLeft"
      >
        <ChevronLeft class="arrow-icon" />
      </button>

      <!-- CONTAINER DE CARDS -->
      <div 
        ref="sliderContainer" 
        class="movie-section__container"
        @scroll="handleScroll"
      >
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id"
          :movie="movie"
          @select-movie="handleMovieSelect"
          @play-movie="handlePlayMovie"
        />
      </div>

      <!-- SETA DIREITA -->
      <button 
        v-if="showRightArrow"
        class="movie-section__arrow movie-section__arrow--right"
        @click="scrollRight"
      >
        <ChevronRight class="arrow-icon" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import MovieCard from './movie-card.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  movies: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-movie', 'play-movie', 'explore-all'])

const sliderContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(true)
const showExploreAll = ref(false)

const handleScroll = () => {
  if (!sliderContainer.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = sliderContainer.value
  
  showLeftArrow.value = scrollLeft > 0
  showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10
}

const scrollLeft = () => {
  if (!sliderContainer.value) return
  sliderContainer.value.scrollBy({ left: -900, behavior: 'smooth' })
}

const scrollRight = () => {
  if (!sliderContainer.value) return
  sliderContainer.value.scrollBy({ left: 900, behavior: 'smooth' })
}

const handleMovieSelect = (movie) => {
  emit('select-movie', movie)
}

const handlePlayMovie = (movie) => {
  emit('play-movie', movie)
}

const handleExploreAll = () => {
  emit('explore-all', { title: props.title, movies: props.movies })
}

onMounted(() => {
  handleScroll()
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
/* ✅ SEÇÃO */
.movie-section {
  padding: 3vw 0;
  position: relative;
  z-index: 1;
}

.movie-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1em;
  padding: 0 4%;
  position: relative;
}

.movie-section__title {
  font-size: 1.4vw;
  font-weight: 700;
  color: #e5e5e5;
  margin: 0;
}

@media (max-width: 768px) {
  .movie-section__title {
    font-size: 18px;
  }
}

.movie-section__explore-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #e5e5e5;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.movie-section__explore-btn:hover {
  color: #fff;
}

.explore-icon {
  width: 14px;
  height: 14px;
}

.movie-section__slider {
  position: relative;
  width: 100%;
}

/* ✅ CONTAINER - SEM PADDING EXCESSIVO */
.movie-section__container {
  display: flex;
  overflow-x: auto;
  overflow-y: visible;
  padding: 20px 4%;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 8px;
}

.movie-section__container::-webkit-scrollbar {
  display: none;
}

/* ✅ SETAS */
.movie-section__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: calc(100% - 40px);
  background: rgba(20, 20, 20, 0.7);
  border: none;
  cursor: pointer;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.movie-section__arrow:hover {
  background: rgba(20, 20, 20, 0.9);
}

.movie-section__arrow--left {
  left: 0;
}

.movie-section__arrow--right {
  right: 0;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  color: #fff;
}

.explore-fade-enter-active,
.explore-fade-leave-active {
  transition: opacity 0.2s ease;
}

.explore-fade-enter-from,
.explore-fade-leave-to {
  opacity: 0;
}
</style>
