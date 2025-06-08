<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <nav class="navbar-container">
      <div class="navbar-left">
        <h1 class="navbar-logo">METFLIX</h1>
        <ul class="navbar-links">
          <li><a href="#" class="navbar-link active">Início</a></li>
          <li><a href="#" class="navbar-link">Séries</a></li>
          <li><a href="#" class="navbar-link">Filmes</a></li>
          <li><a href="#" class="navbar-link">Bombando</a></li>
          <li><a href="#" class="navbar-link">Minha Lista</a></li>
        </ul>
      </div>
      <div class="navbar-right">
        <Search class="navbar-icon" />
        <Bell class="navbar-icon" />
        <div class="navbar-profile">
          <div class="navbar-profile-img"></div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Bell } from 'lucide-vue-next'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  transition: background-color 0.3s ease;
  padding: 0.75rem 4%;
}

.navbar.scrolled {
  background-color: #000;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-logo {
  color: #e50914;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 2rem;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.navbar-links {
  display: none;
  list-style: none;
}

@media (min-width: 768px) {
  .navbar-links {
    display: flex;
    gap: 1.25rem;
  }
}

.navbar-link {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  font-weight: 500;
}

.navbar-link:hover, .navbar-link.active {
  color: #fff;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.navbar-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.navbar-icon:hover {
  color: #b3b3b3;
}

.navbar-profile {
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.navbar-profile-img {
  width: 100%;
  height: 100%;
  background-color: #e50914;
  border-radius: 4px;
}
</style>
