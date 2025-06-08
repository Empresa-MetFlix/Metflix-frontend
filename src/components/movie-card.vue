<template>
  <div 
    class="movie-card"
    @click="selectMovie"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="movie-card-image-container">
      <img 
        :src="movie.image" 
        :alt="movie.title"
        class="movie-card-image"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="movie-card-overlay" :class="{ 'active': isHovered }">
        <div class="movie-card-buttons">
          <button class="movie-card-button movie-card-play-button">
            <Play class="movie-card-button-icon" />
          </button>
          <button class="movie-card-button">
            <Plus class="movie-card-button-icon" />
          </button>
          <button class="movie-card-button">
            <ThumbsUp class="movie-card-button-icon" />
          </button>
        </div>
        <div class="movie-card-info">
          <div class="movie-card-match">97% relevante</div>
          <div class="movie-card-rating">
            <span class="movie-card-age">16</span>
            <span class="movie-card-duration">3 temporadas</span>
          </div>
          <div class="movie-card-genres">
            <span>Suspense</span>
            <span>Sobrenatural</span>
            <span>Terror</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Play, Plus, ThumbsUp } from 'lucide-vue-next'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-movie'])
const isHovered = ref(false)

const selectMovie = () => {
  emit('select-movie', props.movie)
}

const handleImageError = (event) => {
  event.target.src = `https://via.placeholder.com/300x450/141414/e50914?text=${encodeURIComponent(props.movie.title)}`
}
</script>

<style scoped>
.movie-card {
  flex: 0 0 auto;
  width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 4px;
  position: relative;
  z-index: 1;
}

.movie-card:hover {
  transform: scale(1.5);
  z-index: 10;
  margin: 0 30px;
}

.movie-card-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  width: 100%;
  padding-top: 150%;
  background-color: #141414;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.movie-card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.movie-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(0,0,0,0.8) 0%,
    rgba(0,0,0,0) 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
}

.movie-card-overlay.active {
  opacity: 1;
}

.movie-card-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.movie-card-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: rgba(42, 42, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.movie-card-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.movie-card-play-button {
  background-color: #fff;
}

.movie-card-play-button .movie-card-button-icon {
  color: #000;
}

.movie-card-button-icon {
  width: 16px;
  height: 16px;
  color: #fff;
}

.movie-card-info {
  font-size: 0.7rem;
  color: #fff;
}

.movie-card-match {
  color: #46d369;
  font-weight: 700;
  margin-bottom: 4px;
}

.movie-card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.movie-card-age {
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0 4px;
}

.movie-card-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.movie-card-genres span:not(:last-child)::after {
  content: "•";
  margin: 0 4px;
}
</style>
