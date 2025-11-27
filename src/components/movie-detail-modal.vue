<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">
            <X :size="24" />
          </button>

          <!-- Hero Background -->
          <div 
            class="modal-hero" 
            :style="{ backgroundImage: `url(${movie.backgroundImage || movie.image})` }"
          >
            <div class="modal-hero-overlay"></div>
            <div class="modal-hero-content">
              <h1 class="modal-title">{{ movie.title }}</h1>
              
              <!-- Tagline -->
              <p v-if="movie.tagline" class="modal-tagline">{{ movie.tagline }}</p>
              
              <div class="modal-actions">
                <button class="modal-btn modal-btn-play" @click="playMovie">
                  <Play :size="20" /> Assistir
                </button>
                <button 
                  class="modal-btn modal-btn-icon" 
                  @click="toggleFavorite"
                  :class="{ active: isFavorited }"
                  :title="isFavorited ? 'Remover da lista' : 'Adicionar à lista'"
                >
                  <Check v-if="isFavorited" :size="20" />
                  <Plus v-else :size="20" />
                </button>
                <button class="modal-btn modal-btn-icon" title="Curtir">
                  <ThumbsUp :size="20" />
                </button>
              </div>
            </div>
          </div>

          <!-- Movie Info -->
          <div class="modal-info">
            <div class="modal-info-main">
              <div class="modal-metadata">
                <span class="modal-match">{{ movie.relevance || 85 }}% relevante</span>
                <span class="modal-year">{{ movie.year || 'N/A' }}</span>
                <span class="modal-rating">{{ movie.ageRating || '14' }}</span>
                <span class="modal-quality">{{ movie.quality || 'HD' }}</span>
                <span v-if="movie.mediaType" class="modal-type">
                  {{ movie.mediaType === 'tv' ? 'Série' : 'Filme' }}
                </span>
              </div>

              <!-- Duração / Temporadas -->
              <div v-if="movie.runtime || movie.numberOfSeasons" class="modal-duration">
                <Clock :size="16" />
                <span v-if="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
                <span v-else-if="movie.numberOfSeasons">
                  {{ movie.numberOfSeasons }} temporada(s) • {{ movie.numberOfEpisodes }} episódio(s)
                </span>
              </div>

              <p class="modal-description">
                {{ movie.description || 'Descrição não disponível para este título.' }}
              </p>

              <!-- Trailer -->
              <div v-if="movie.trailer" class="modal-trailer">
                <button @click="watchTrailer" class="trailer-btn">
                  <Video :size="18" /> Assistir Trailer
                </button>
              </div>
            </div>

            <div class="modal-info-side">
              <div class="modal-detail" v-if="movie.cast">
                <span class="modal-label">Elenco:</span>
                <span class="modal-value">{{ movie.cast }}</span>
              </div>
              <div class="modal-detail" v-if="movie.genres && movie.genres.length > 0">
                <span class="modal-label">Gêneros:</span>
                <span class="modal-value">{{ displayGenres }}</span>
              </div>
              <div class="modal-detail" v-if="movie.director || movie.creator">
                <span class="modal-label">{{ movie.mediaType === 'tv' ? 'Criador:' : 'Direção:' }}</span>
                <span class="modal-value">{{ movie.director || movie.creator }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">Classificação:</span>
                <span class="modal-value">{{ movie.ageRating || '14' }} anos</span>
              </div>
              <div class="modal-detail" v-if="movie.voteAverage">
                <span class="modal-label">Avaliação TMDB:</span>
                <span class="modal-value">
                  <Star :size="14" style="color: #ffd700;" /> {{ movie.voteAverage.toFixed(1) }}/10
                </span>
              </div>
              <div class="modal-detail" v-if="movie.originalLanguage">
                <span class="modal-label">Idioma:</span>
                <span class="modal-value">{{ getLanguageName(movie.originalLanguage) }}</span>
              </div>
            </div>
          </div>

          <!-- Similar Movies/Shows -->
          <div v-if="movie.similarMovies && movie.similarMovies.length > 0" class="modal-similar">
            <h3>Títulos Semelhantes</h3>
            <div class="similar-grid">
              <div 
                v-for="similar in movie.similarMovies" 
                :key="similar.id"
                class="similar-item"
                @click="openSimilar(similar)"
              >
                <img :src="similar.image" :alt="similar.title" />
                <div class="similar-info">
                  <h4>{{ similar.title }}</h4>
                  <span>{{ similar.year }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X, Play, Plus, Check, ThumbsUp, Clock, Video, Star } from 'lucide-vue-next'
import { useFavoritesStore } from '@/composables/use-favorites.js'

const props = defineProps({
  show: Boolean,
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'play'])

const favoritesStore = useFavoritesStore()

const isFavorited = computed(() => {
  return favoritesStore.isFavorite(props.movie.id)
})

const displayGenres = computed(() => {
  if (props.movie.genres && Array.isArray(props.movie.genres)) {
    return props.movie.genres.join(', ')
  }
  return 'N/A'
})

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
}

const getLanguageName = (code) => {
  const languages = {
    'en': 'Inglês',
    'pt': 'Português',
    'es': 'Espanhol',
    'fr': 'Francês',
    'de': 'Alemão',
    'it': 'Italiano',
    'ja': 'Japonês',
    'ko': 'Coreano',
    'zh': 'Chinês'
  }
  return languages[code] || code.toUpperCase()
}

const closeModal = () => {
  emit('close')
}

const playMovie = () => {
  emit('play', props.movie)
}

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.movie)
}

const watchTrailer = () => {
  if (props.movie.trailer) {
    window.open(`https://www.youtube.com/watch?v=${props.movie.trailer}`, '_blank')
  }
}

const openSimilar = (similar) => {
  emit('close')
  // Reabrir com novo filme
  setTimeout(() => {
    emit('play', similar)
  }, 300)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: #181818;
  border-radius: 8px;
  max-width: 950px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.95);
}

.modal-hero {
  position: relative;
  height: 480px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

.modal-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(24, 24, 24, 1) 0%,
    rgba(24, 24, 24, 0) 50%
  );
}

.modal-hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.modal-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
}

.modal-tagline {
  font-size: 1.1rem;
  color: #e5e5e5;
  font-style: italic;
  margin-bottom: 20px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn-play {
  background: white;
  color: black;
  font-size: 16px;
}

.modal-btn-play:hover {
  background: rgba(255, 255, 255, 0.8);
}

.modal-btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
  background: rgba(42, 42, 42, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
}

.modal-btn-icon:hover {
  border-color: white;
  background: rgba(42, 42, 42, 0.8);
}

.modal-btn-icon.active {
  background: white;
  color: black;
  border-color: white;
}

.modal-info {
  padding: 40px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

@media (max-width: 768px) {
  .modal-info {
    grid-template-columns: 1fr;
  }
}

.modal-metadata {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  font-size: 14px;
  flex-wrap: wrap;
}

.modal-match {
  color: #46d369;
  font-weight: 600;
}

.modal-year {
  color: #e5e5e5;
}

.modal-rating,
.modal-quality,
.modal-type {
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 2px 6px;
  font-size: 12px;
}

.modal-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
  margin-bottom: 15px;
}

.modal-description {
  line-height: 1.6;
  color: #e5e5e5;
  margin-bottom: 20px;
}

.modal-trailer {
  margin-top: 20px;
}

.trailer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.trailer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.modal-info-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 14px;
}

.modal-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-label {
  color: #777;
  font-weight: 600;
}

.modal-value {
  color: #e5e5e5;
  display: flex;
  align-items: center;
  gap: 4px;
}

.modal-similar {
  padding: 0 40px 40px;
}

.modal-similar h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.similar-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.similar-item:hover {
  transform: scale(1.05);
}

.similar-item img {
  width: 100%;
  height: 225px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.similar-info h4 {
  font-size: 14px;
  margin-bottom: 4px;
}

.similar-info span {
  font-size: 12px;
  color: #999;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
