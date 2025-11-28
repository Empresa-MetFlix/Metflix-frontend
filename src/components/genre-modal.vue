<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="genre-modal" @click="closeModal">
        <div class="genre-modal__content" @click.stop>
          <!-- HEADER -->
          <div class="genre-modal__header">
            <button class="genre-modal__back" @click="closeModal">
              <ArrowLeft class="back-icon" />
            </button>
            <h1 class="genre-modal__title">{{ genreTitle }}</h1>
            <button class="genre-modal__close" @click="closeModal">
              <X class="close-icon" />
            </button>
          </div>

          <!-- GRID DE FILMES -->
          <div class="genre-modal__grid">
            <div 
              v-for="movie in movies" 
              :key="movie.id"
              class="genre-modal__card"
              @click="selectMovie(movie)"
            >
              <img 
                :src="movie.image" 
                :alt="movie.title" 
                class="genre-modal__card-image"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ArrowLeft, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  genreTitle: {
    type: String,
    default: ''
  },
  movies: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select-movie'])

const closeModal = () => {
  emit('close')
}

const selectMovie = (movie) => {
  emit('select-movie', movie)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x170/141414/ffffff?text=Sem+Imagem'
}
</script>

<style scoped>
.genre-modal {
  position: fixed;
  inset: 0;
  background-color: #141414;
  z-index: 1000;
  overflow-y: auto;
}

.genre-modal__content {
  min-height: 100vh;
  padding-bottom: 4rem;
}

/* ✅ HEADER */
.genre-modal__header {
  position: sticky;
  top: 0;
  background-color: #141414;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 1rem 4%;
  gap: 1rem;
}

.genre-modal__back,
.genre-modal__close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.genre-modal__back:hover,
.genre-modal__close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon,
.close-icon {
  width: 24px;
  height: 24px;
}

.genre-modal__title {
  flex: 1;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

/* ✅ GRID */
.genre-modal__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 2rem 4%;
}

.genre-modal__card {
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.genre-modal__card:hover {
  transform: scale(1.05);
}

.genre-modal__card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ✅ TRANSIÇÕES */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
