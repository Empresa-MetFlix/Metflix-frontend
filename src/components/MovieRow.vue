<template>
  <div class="row">
    <h2 class="row-title">{{ title }}</h2>

    <div class="row-list">
      <div
        v-for="movie in items"
        :key="movie.id"
        class="movie-card"
      >
        <img :src="movie.image" :alt="movie.title" />
        <p class="movie-title">{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  items: Array,
})
</script>

<style scoped>
.row {
  margin-bottom: 40px;
}

.row-title {
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: bold;
  color: white;
}

.row-list {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 10px;
}

.row-list::-webkit-scrollbar {
  height: 6px;
}

.row-list::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

.movie-card {
  min-width: 180px;
  height: 260px;
  border-radius: 8px;
  overflow: hidden;
  background: #222;
  transition: 0.25s;
  cursor: pointer;
  flex-shrink: 0;
}

.movie-card:hover {
  transform: scale(1.08);
}

.movie-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-title {
  text-align: center;
  font-size: 0.9rem;
  padding: 4px 0;
  color: white;
}
</style>
