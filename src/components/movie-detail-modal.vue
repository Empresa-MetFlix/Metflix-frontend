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
                <!-- Botão Trailer (principal) -->
                <button 
                  v-if="movie.trailer" 
                  class="modal-btn modal-btn-play" 
                  @click="watchTrailer"
                >
                  <Play :size="20" /> Assistir Trailer
                </button>
                
                <!-- Mensagem se não houver trailer -->
                <div v-else class="no-trailer-msg">
                  <Info :size="18" />
                  Trailer não disponível
                </div>
                
                <!-- Botão Add/Remove da Lista -->
                <button 
                  class="modal-btn modal-btn-icon" 
                  @click="handleToggleFavorite"
                  :class="{ active: isFavorited }"
                  :title="isFavorited ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'"
                >
                  <Check v-if="isFavorited" :size="20" />
                  <Plus v-else :size="20" />
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
                {{ movie.description || movie.overview || 'Descrição não disponível para este título.' }}
              </p>
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
                <img 
                  :src="similar.image" 
                  :alt="similar.title"
                  @error="handleImageError"
                />
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
import { X, Play, Plus, Check, Clock, Star, Info } from 'lucide-vue-next'
import { useFavorites } from '@/composables/use-favorites.js'  // ✅ CORRETO

const props = defineProps({
  show: Boolean,
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'open-similar'])

// ✅ USAR useFavorites (não useFavoritesStore)
const { isFavorite, toggleFavorite } = useFavorites()

const isFavorited = computed(() => {
  return isFavorite(props.movie.id)
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

const handleToggleFavorite = async () => {
  try {
    await toggleFavorite(props.movie.id, props.movie.mediaType) // ✅ CORRIGIDO
  } catch (error) {
    console.error('Erro ao alternar favorito:', error)
  }
}




const watchTrailer = () => {
  if (props.movie.trailer) {
    window.open(`https://www.youtube.com/watch?v=${props.movie.trailer}`, '_blank')
  }
}

const openSimilar = (similar) => {
  emit('open-similar', similar)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150x225/333/fff?text=Sem+Imagem'
}
</script>

<style scoped>
/* ✅ OVERLAY */
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
  backdrop-filter: blur(5px);
}

/* ✅ CONTENT */
.modal-content {
  background: #181818;
  border-radius: 8px;
  max-width: 950px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
}

/* ✅ SCROLL CUSTOMIZADO */
.modal-content::-webkit-scrollbar {
  width: 10px;
}

.modal-content::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* ✅ BOTÃO FECHAR */
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
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.95);
  transform: scale(1.1);
}

/* ✅ HERO */
.modal-hero {
  position: relative;
  height: 480px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

@media (max-width: 768px) {
  .modal-hero {
    height: 400px;
    padding: 30px 20px;
  }
}

.modal-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(24, 24, 24, 1) 0%,
    rgba(24, 24, 24, 0.8) 20%,
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
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
  line-height: 1.1;
}

@media (max-width: 768px) {
  .modal-title {
    font-size: 2rem;
  }
}

.modal-tagline {
  font-size: 1.1rem;
  color: #e5e5e5;
  font-style: italic;
  margin-bottom: 20px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9);
}

@media (max-width: 768px) {
  .modal-tagline {
    font-size: 1rem;
  }
}

/* ✅ BOTÕES DE AÇÃO */
.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
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
  font-size: 16px;
}

.modal-btn-play {
  background: white;
  color: black;
}

.modal-btn-play:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: scale(1.05);
}

.modal-btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
  background: rgba(42, 42, 42, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  backdrop-filter: blur(10px);
}

.modal-btn-icon:hover {
  border-color: white;
  background: rgba(42, 42, 42, 0.9);
  transform: scale(1.1);
}

.modal-btn-icon.active {
  background: white;
  color: black;
  border-color: white;
}

/* ✅ MENSAGEM SEM TRAILER */
.no-trailer-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: #999;
  font-size: 14px;
}

/* ✅ INFO */
.modal-info {
  padding: 40px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

@media (max-width: 768px) {
  .modal-info {
    grid-template-columns: 1fr;
    padding: 30px 20px;
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
  font-weight: 700;
  font-size: 15px;
}

.modal-year {
  color: #e5e5e5;
  font-weight: 500;
}

.modal-rating,
.modal-quality,
.modal-type {
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
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
  line-height: 1.7;
  color: #e5e5e5;
  margin-bottom: 20px;
  font-size: 15px;
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
  font-size: 13px;
}

.modal-value {
  color: #e5e5e5;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

/* ✅ SIMILARES */
.modal-similar {
  padding: 0 40px 40px;
}

@media (max-width: 768px) {
  .modal-similar {
    padding: 0 20px 30px;
  }
}

.modal-similar h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

@media (max-width: 768px) {
  .similar-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
}

.similar-item {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 4px;
  overflow: hidden;
  background: #2a2a2a;
}

.similar-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.similar-item img {
  width: 100%;
  height: 225px;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .similar-item img {
    height: 180px;
  }
}

.similar-info {
  padding: 8px;
}

.similar-info h4 {
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.similar-info span {
  font-size: 12px;
  color: #999;
}

/* ✅ TRANSITIONS */
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
