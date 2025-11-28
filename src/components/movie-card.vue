<template>
  <div 
    class="movie-card"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="selectMovie"
  >
    <!-- IMAGEM -->
    <div class="movie-card__image-container">
      <img 
        :src="movie.image" 
        :alt="movie.title" 
        class="movie-card__image"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- OVERLAY HOVER -->
      <Transition name="overlay-fade">
        <div v-if="isHovered" class="movie-card__overlay">
          <div class="movie-card__content">
            <!-- Título -->
            <h3 class="movie-card__title">{{ movie.title }}</h3>
            
            <!-- Botões -->
            <div class="movie-card__buttons">
              <button 
                class="movie-card__button movie-card__button--play" 
                @click.stop="playMovie"
                title="Assistir"
              >
                <Play class="movie-card__icon" />
              </button>
              <button 
                class="movie-card__button" 
                @click.stop="handleToggleFavorite"
                :title="isFavorited ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'"
              >
                <Check v-if="isFavorited" class="movie-card__icon" />
                <Plus v-else class="movie-card__icon" />
              </button>
              <button 
                class="movie-card__button" 
                @click.stop="selectMovie"
                title="Mais informações"
              >
                <Info class="movie-card__icon" />
              </button>
            </div>
            
            <!-- Meta Info -->
            <div class="movie-card__meta">
              <span class="movie-card__match">{{ movie.relevance || 68 }}% relevante</span>
              <span class="movie-card__year">{{ movie.year || '2025' }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Play, Plus, Check, Info } from 'lucide-vue-next'
import { useFavorites } from '@/composables/use-favorites.js'  // ✅ CORRETO

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-movie', 'play-movie'])

const isHovered = ref(false)

// ✅ USAR useFavorites (não useFavoritesStore)
const { isFavorite, toggleFavorite } = useFavorites()

const isFavorited = computed(() => {
  return isFavorite(props.movie.id)
})

const selectMovie = () => {
  emit('select-movie', props.movie)
}

const playMovie = () => {
  emit('play-movie', props.movie)
}

const handleImageError = (event) => {
  event.target.src = `https://via.placeholder.com/300x170/141414/ffffff?text=${encodeURIComponent(props.movie.title || 'Sem Imagem')}`
}

const handleToggleFavorite = async () => {
  try {
    await toggleFavorite(props.movie)
  } catch (error) {
    console.error('Erro ao alternar favorito:', error)
  }
}
</script>

<style scoped>
/* ✅ CARD BASE - SEM EXPANSÃO */
.movie-card {
  position: relative;
  flex-shrink: 0;
  width: 16vw;
  min-width: 200px;
  max-width: 350px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  background-color: #181818;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
  z-index: 100;
}

/* ✅ IMAGEM */
.movie-card__image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.movie-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* ✅ OVERLAY HOVER - DENTRO DO CARD */
.movie-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 16px;
  z-index: 10;
}

.movie-card__content {
  width: 100%;
}

/* ✅ TÍTULO */
.movie-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ✅ BOTÕES */
.movie-card__buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.movie-card__button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background-color: rgba(42, 42, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.movie-card__button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #fff;
  transform: scale(1.15);
}

.movie-card__button--play {
  background-color: #fff;
  border-color: #fff;
}

.movie-card__button--play:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.movie-card__icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.movie-card__button--play .movie-card__icon {
  color: #000;
}

.movie-card__button:has(.lucide-check) {
  background-color: #fff;
  border-color: #fff;
}

.movie-card__button:has(.lucide-check) .movie-card__icon {
  color: #000;
}

/* ✅ META INFO */
.movie-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #d2d2d2;
}

.movie-card__match {
  color: #46d369;
  font-weight: 600;
}

.movie-card__year {
  color: #999;
}

/* ✅ TRANSIÇÕES */
.overlay-fade-enter-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* ✅ RESPONSIVO */
@media (max-width: 1400px) {
  .movie-card {
    width: 19vw;
  }
}

@media (max-width: 1200px) {
  .movie-card {
    width: 23vw;
  }
}

@media (max-width: 768px) {
  .movie-card {
    width: 30vw;
    min-width: 150px;
  }
  
  .movie-card__title {
    font-size: 0.9rem;
  }
  
  .movie-card__buttons {
    gap: 6px;
  }
  
  .movie-card__button {
    width: 32px;
    height: 32px;
  }
  
  .movie-card__icon {
    width: 18px;
    height: 18px;
  }
}
</style>
