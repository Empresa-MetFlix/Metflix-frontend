<template>
  <div 
    class="movie-card"
    :class="{ 'movie-card--carousel': isCarousel }"
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
      
      <!-- BADGE TIPO (Filme/Série) -->
      <div v-if="movie.mediaType" class="movie-card__badge">
        {{ movie.mediaType === 'tv' ? 'SÉRIE' : 'FILME' }}
      </div>
      
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
                :class="{ 'movie-card__button--active': isFavorited }"
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
              <span v-if="movie.voteAverage" class="movie-card__rating">
                ⭐ {{ movie.voteAverage.toFixed(1) }}
              </span>
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
import { useFavorites } from '@/composables/use-favorites.js'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  isCarousel: {
    type: Boolean,
    default: true  // ✅ Por padrão é carrossel
  }
})

const emit = defineEmits(['select-movie', 'play-movie'])

const isHovered = ref(false)

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
  event.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(props.movie.title || 'Sem Imagem')}`
}

const handleToggleFavorite = async () => {
  try {
    await toggleFavorite(props.movie.id, props.movie.mediaType)
  } catch (error) {
    console.error('Erro ao alternar favorito:', error)
  }
}
</script>

<style scoped>
/* ✅ CARD BASE - Para GRID (Minha Lista) */
.movie-card {
  position: relative;
  width: 100%;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  background-color: #181818;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ VERSÃO CARROSSEL - Largura fixa */
.movie-card--carousel {
  width: 16vw;
  min-width: 200px;
  max-width: 350px;
  flex-shrink: 0;
}

.movie-card:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.9);
  z-index: 100;
}

/* ✅ BADGE TIPO */
.movie-card__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  background: rgba(229, 9, 20, 0.95);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 4px;
  letter-spacing: 0.5px;
  z-index: 5;
  backdrop-filter: blur(10px);
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
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-card__image {
  transform: scale(1.05);
}

/* ✅ OVERLAY HOVER */
.movie-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.85) 40%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.2) 100%
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
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 14px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

/* ✅ BOTÕES */
.movie-card__buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.movie-card__button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background-color: rgba(42, 42, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.movie-card__button:hover {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: #fff;
  transform: scale(1.2);
}

.movie-card__button--play {
  background-color: #fff;
  border-color: #fff;
}

.movie-card__button--play:hover {
  background-color: rgba(255, 255, 255, 0.95);
  transform: scale(1.2);
}

.movie-card__icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.movie-card__button--play .movie-card__icon {
  color: #000;
}

.movie-card__button--active {
  background-color: #fff;
  border-color: #fff;
}

.movie-card__button--active .movie-card__icon {
  color: #000;
}

/* ✅ META INFO */
.movie-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  color: #d2d2d2;
}

.movie-card__rating {
  color: #ffc107;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.movie-card__year {
  color: #999;
  font-weight: 500;
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

/* ✅ RESPONSIVO - CARROSSEL */
@media (max-width: 1400px) {
  .movie-card--carousel {
    width: 19vw;
  }
}

@media (max-width: 1200px) {
  .movie-card--carousel {
    width: 23vw;
  }
}

@media (max-width: 768px) {
  .movie-card--carousel {
    width: 30vw;
    min-width: 150px;
  }
  
  .movie-card__title {
    font-size: 0.95rem;
    -webkit-line-clamp: 1;
  }
  
  .movie-card__buttons {
    gap: 8px;
  }
  
  .movie-card__button {
    width: 34px;
    height: 34px;
  }
  
  .movie-card__icon {
    width: 18px;
    height: 18px;
  }
  
  .movie-card__badge {
    font-size: 0.65rem;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .movie-card:hover {
    transform: scale(1.03);
  }
  
  .movie-card__title {
    font-size: 0.85rem;
  }
  
  .movie-card__button {
    width: 32px;
    height: 32px;
  }
}
</style>
