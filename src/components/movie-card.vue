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

          <!-- PLAY (bloqueia clique do card) -->
          <button 
            class="movie-card-button movie-card-play-button"
            @click.stop
          >
            <Play class="movie-card-button-icon" />
          </button>

          <!-- FAVORITOS -->
          <button 
            class="movie-card-button"
            @click.stop="handleToggleFavorite"
          >
            <Check v-if="isFavorited" class="movie-card-button-icon" />
            <Plus v-else class="movie-card-button-icon" />
          </button>

          <!-- LIKE (bloqueia clique do card) -->
          <button 
            class="movie-card-button"
            @click.stop
          >
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
            <span>Fantasia</span>
            <span>Drama</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isHovered" class="movie-card-title-hover">
      {{ movie.title }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Play, Plus, ThumbsUp, Check } from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/use-favorites.js'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-movie'])

const isHovered = ref(false)
const favoritesStore = useFavoritesStore()

// Verifica se o filme está favoritado
const isFavorited = computed(() => {
  return favoritesStore.isFavorite(props.movie.id)
})

// Clique no card
const selectMovie = () => {
  emit('select-movie', props.movie)
}

// Fallback de imagem
const handleImageError = (event) => {
  event.target.src = `https://placehold.co/500x750/141414/ffffff?text=${encodeURIComponent(props.movie.title)}`
}

// ADD / REMOVE da Minha Lista
const handleToggleFavorite = () => {
  // Enviar o filme completo
  favoritesStore.toggleFavorite(props.movie)
}
</script>


<style scoped>
.movie-card {
  width: 250px;
  min-width: 250px;
  height: 140px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Efeito de zoom e sombra ao passar o mouse */
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
  z-index: 20; /* Garante que o card fique acima dos vizinhos */
}

.movie-card-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.movie-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Estilo para o botão de 'favoritado' */
.movie-card-button:nth-child(2) {
  border-color: rgba(255, 255, 255, 0.5); /* Borda mais clara para ícones secundários */
}

/* Cor de fundo para o botão de 'favoritado' (se estiver ativo) */
.movie-card-button:nth-child(2) > .lucide-check {
  background-color: #fff;
  color: #000;
  border: none;
  padding: 2px; /* Ajuste para o ícone de check */
  border-radius: 50%;
}

.movie-card-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.movie-card-play-button {
  background-color: #fff;
  border: none;
}

.movie-card-play-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.movie-card-button-icon {
  width: 18px;
  height: 18px;
  color: #fff;
}

.movie-card-play-button > .movie-card-button-icon {
  color: #000;
  fill: #000;
}

.movie-card-info {
  display: flex;
  flex-direction: column;
  color: #fff;
}

.movie-card-match {
  font-size: 0.9rem;
  font-weight: 600;
  color: #46d369;
  margin-bottom: 4px;
}

.movie-card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.movie-card-age {
  border: 1px solid #fff;
  padding: 1px 4px;
  font-size: 0.7rem;
}

.movie-card-duration {
  color: #b3b3b3;
}

.movie-card-genres {
  display: flex;
  gap: 8px;
  font-size: 0.7rem;
  color: #b3b3b3;
}

.movie-card-genres span:not(:last-child)::after {
  content: "•";
  margin-left: 8px;
  color: #b3b3b3;
}

.movie-card-title-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 10px 5px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  /* Inicialmente oculto */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-card-title-hover {
  opacity: 1;
}

/* Garantir que o card expanda corretamente */
.movie-card:hover {
  /* No hover, o card pode se expandir em altura ou largura se a imagem for grande */
  /* Mantendo a altura original para não quebrar a grade, mas permitindo o scale(1.05) */
}
</style>