<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="genre-modal">
        <div class="genre-modal__overlay" @click="closeModal"></div>
        
        <div class="genre-modal__content">
          <div class="genre-modal__header">
            <div class="genre-modal__header-left">
              <button class="genre-modal__back" @click="closeModal" aria-label="Voltar">
                <ArrowLeft class="back-icon" />
              </button>
              <h1 class="genre-modal__title">{{ genreTitle }}</h1>
            </div>
            
            <button class="genre-modal__close" @click="closeModal" aria-label="Fechar">
              <X class="close-icon" />
            </button>
          </div>

          <div class="genre-modal__body">
            <div class="genre-modal__grid">
              <MovieCard
                v-for="movie in movies"
                :key="movie.id"
                :movie="movie"
                :is-carousel="false"
                @select-movie="selectMovie"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { ArrowLeft, X } from 'lucide-vue-next'
import MovieCard from './movie-card.vue'

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

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.isOpen) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.genre-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  background-color: #141414;
}

.genre-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
}

.genre-modal__content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
  background-color: #141414;
}

.genre-modal__header {
  position: sticky;
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 20, 1) 0%,
    rgba(20, 20, 20, 0.98) 70%,
    rgba(20, 20, 20, 0.95) 100%
  );
  backdrop-filter: blur(10px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 4%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.genre-modal__header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.genre-modal__back,
.genre-modal__close {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.genre-modal__back:hover,
.genre-modal__close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.back-icon,
.close-icon {
  width: 22px;
  height: 22px;
}

.genre-modal__title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.genre-modal__body {
  padding: 40px 4% 80px;
}

.genre-modal__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active {
  transition: opacity 0.3s ease-out;
}

.modal-fade-leave-active {
  transition: opacity 0.25s ease-in;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1200px) {
  .genre-modal__grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .genre-modal__header {
    padding: 16px 3%;
  }

  .genre-modal__header-left {
    gap: 12px;
  }

  .genre-modal__title {
    font-size: 1.5rem;
  }

  .genre-modal__back,
  .genre-modal__close {
    width: 40px;
    height: 40px;
  }

  .back-icon,
  .close-icon {
    width: 20px;
    height: 20px;
  }

  .genre-modal__body {
    padding: 24px 3% 60px;
  }

  .genre-modal__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .genre-modal__title {
    font-size: 1.25rem;
  }

  .genre-modal__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .genre-modal__body {
    padding: 20px 3% 50px;
  }
}
</style>
