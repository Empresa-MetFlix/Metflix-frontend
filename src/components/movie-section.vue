<template>
  <section class="movie-section">
    <div class="movie-section__header">
      <h2 class="movie-section__title">{{ title }}</h2>
      <button
        class="movie-section__explore-btn"
        @click="handleExploreAll"
      >
        <span class="explore-text">Explorar tudo</span>
        <ChevronRight class="explore-icon" />
      </button>
    </div>

    <div class="movie-section__slider">
      <button
        v-if="showLeftArrow"
        class="movie-section__arrow movie-section__arrow--left"
        @click="scrollLeft"
        aria-label="Rolar para esquerda"
      >
        <ChevronLeft class="arrow-icon" />
      </button>

      <div
        ref="sliderContainer"
        class="movie-section__container"
        @scroll="handleScroll"
      >
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          :is-carousel="true"
          @select-movie="handleMovieSelect"
          @play-movie="handlePlayMovie"
        />
      </div>

      <button
        v-if="showRightArrow"
        class="movie-section__arrow movie-section__arrow--right"
        @click="scrollRight"
        aria-label="Rolar para direita"
      >
        <ChevronRight class="arrow-icon" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import MovieCard from "./movie-card.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["select-movie", "play-movie", "explore-all"]);

const sliderContainer = ref(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(true);

const handleScroll = () => {
  if (!sliderContainer.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = sliderContainer.value;

  showLeftArrow.value = scrollLeft > 0;
  showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10;
};

const scrollLeft = () => {
  if (!sliderContainer.value) return;
  sliderContainer.value.scrollBy({ left: -900, behavior: "smooth" });
};

const scrollRight = () => {
  if (!sliderContainer.value) return;
  sliderContainer.value.scrollBy({ left: 900, behavior: "smooth" });
};

const handleMovieSelect = (movie) => {
  emit("select-movie", movie);
};

const handlePlayMovie = (movie) => {
  emit("play-movie", movie);
};

const handleExploreAll = () => {
  emit("explore-all", { title: props.title, movies: props.movies });
};

onMounted(() => {
  handleScroll();
  window.addEventListener("resize", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleScroll);
});
</script>

<style scoped>
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
  transition: color 0.2s ease;
}

.movie-section__header:hover .movie-section__title {
  color: #fff;
}

.movie-section__explore-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #54b9c5;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-10px);
}

.movie-section__header:hover .movie-section__explore-btn {
  opacity: 1;
  transform: translateX(0);
}

.movie-section__explore-btn:hover {
  color: #6dd5e0;
  background: rgba(84, 185, 197, 0.1);
}

.explore-text {
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}

.explore-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.movie-section__explore-btn:hover .explore-icon {
  transform: translateX(4px);
}

.movie-section__slider {
  position: relative;
  width: 100%;
}

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
  backdrop-filter: blur(5px);
}

.movie-section__arrow:hover {
  background: rgba(20, 20, 20, 0.9);
}

.movie-section__arrow--left {
  left: 0;
  border-radius: 0 4px 4px 0;
}

.movie-section__arrow--right {
  right: 0;
  border-radius: 4px 0 0 4px;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  color: #fff;
  transition: transform 0.2s ease;
}

.movie-section__arrow:hover .arrow-icon {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .movie-section__title {
    font-size: 18px;
  }

  .movie-section__explore-btn {
    opacity: 1;
    transform: translateX(0);
    font-size: 0.8rem;
  }

  .explore-text {
    display: none;
  }

  .explore-icon {
    width: 18px;
    height: 18px;
  }

  .movie-section__arrow {
    width: 40px;
  }

  .arrow-icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .movie-section__header {
    padding: 0 3%;
  }

  .movie-section__container {
    padding: 15px 3%;
    gap: 6px;
  }
}
</style>
