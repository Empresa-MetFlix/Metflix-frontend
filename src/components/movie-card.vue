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
          <!-- PLAY -->
          <button 
            class="movie-card-button movie-card-play-button"
            @click.stop="playMovie"
            title="Assistir"
          >
            <Play class="movie-card-button-icon" />
          </button>

          <!-- FAVORITOS -->
          <button 
            class="movie-card-button"
            @click.stop="handleToggleFavorite"
            :title="isFavorited ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'"
          >
            <Check v-if="isFavorited" class="movie-card-button-icon" />
            <Plus v-else class="movie-card-button-icon" />
          </button>

          <!-- LIKE -->
          <button 
            class="movie-card-button"
            @click.stop
            title="Gostei"
          >
            <ThumbsUp class="movie-card-button-icon" />
          </button>
        </div>

        <div class="movie-card-info">
          <!-- Relevância (calculada do TMDB) -->
          <div class="movie-card-match">{{ movie.relevance || 85 }}% relevante</div>
          
          <div class="movie-card-rating">
            <span class="movie-card-age">{{ movie.ageRating || '14' }}</span>
            <span class="movie-card-year">{{ movie.year || 'N/A' }}</span>
            <span class="movie-card-quality">{{ movie.quality || 'HD' }}</span>
          </div>
          
          <!-- Gêneros (vindos do TMDB) -->
          <div v-if="displayGenres" class="movie-card-genres">
            <span v-for="(genre, index) in displayGenres.slice(0, 3)" :key="index">
              {{ genre }}
            </span>
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
import { useFavoritesStore } from '@/composables/use-favorites.js'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-movie', 'play-movie'])

const isHovered = ref(false)
const favoritesStore = useFavoritesStore()

// Verifica se o filme está favoritado
const isFavorited = computed(() => {
  return favoritesStore.isFavorite(props.movie.id)
})

// Gêneros formatados (se disponível)
const displayGenres = computed(() => {
  if (props.movie.genres && Array.isArray(props.movie.genres)) {
    return props.movie.genres
  }
  return null
})

// Clique no card (abre modal)
const selectMovie = () => {
  emit('select-movie', props.movie)
}

// Play direto
const playMovie = () => {
  emit('play-movie', props.movie)
}

// Fallback de imagem
const handleImageError = (event) => {
  event.target.src = `https://via.placeholder.com/500x750/141414/ffffff?text=${encodeURIComponent(props.movie.title || 'Sem Imagem')}`
}

// ADD / REMOVE da Minha Lista
const handleToggleFavorite = () => {
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
  transition: transform 0.3s ease, box-shadow 0.3s ease, z-index 0s 0.3s;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
  z-index: 20;
  transition: transform 0.3s ease, box-shadow 0.3s ease, z-index 0s;
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
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.4) 60%,
    rgba(0,0,0,0) 100%
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
  border: 2px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(42, 42, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.movie-card-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #fff;
  transform: scale(1.1);
}

.movie-card-play-button {
  background-color: #fff;
  border: 2px solid #fff;
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
}

/* Botão de favorito ativo */
.movie-card-button:has(.lucide-check) {
  background-color: #fff;
  border-color: #fff;
}

.movie-card-button:has(.lucide-check) .movie-card-button-icon {
  color: #000;
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
  font-size: 0.75rem;
  margin-bottom: 6px;
}

.movie-card-age {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 2px 5px;
  font-size: 0.7rem;
  font-weight: 600;
}

.movie-card-year,
.movie-card-quality {
  color: #e5e5e5;
  font-weight: 500;
}

.movie-card-genres {
  display: flex;
  gap: 8px;
  font-size: 0.7rem;
  color: #b3b3b3;
  flex-wrap: wrap;
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
  padding: 8px 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(
    0deg,
    rgba(0,0,0,0.8) 0%,
    rgba(0,0,0,0) 100%
  );
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  opacity: 1;
  transition: opacity 0.3s ease;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-card:hover .movie-card-title-hover {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .movie-card {
    width: 180px;
    min-width: 180px;
    height: 100px;
  }
  
  .movie-card-button {
    width: 28px;
    height: 28px;
  }
  
  .movie-card-button-icon {
    width: 14px;
    height: 14px;
  }
  
  .movie-card-match {
    font-size: 0.75rem;
  }
  
  .movie-card-rating {
    font-size: 0.65rem;
  }
  
  .movie-card-genres {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .movie-card {
    width: 140px;
    min-width: 140px;
    height: 80px;
  }
  
  .movie-card-overlay {
    padding: 8px;
  }
  
  .movie-card-buttons {
    gap: 6px;
  }
  
  .movie-card-button {
    width: 24px;
    height: 24px;
  }
  
  .movie-card-button-icon {
    width: 12px;
    height: 12px;
  }
  
  .movie-card-title-hover {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
}
</style>
