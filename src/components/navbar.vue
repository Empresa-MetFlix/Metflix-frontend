<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <nav class="navbar-container">
      <div class="navbar-left">
        <router-link :to="{ name: 'Home' }" class="navbar-logo">METFLIX</router-link>
        
        <ul class="navbar-links">
          <li><router-link :to="{ name: 'Home' }" class="navbar-link">Início</router-link></li>
          <li><router-link :to="{ name: 'Series' }" class="navbar-link">Séries</router-link></li>
          <li><router-link :to="{ name: 'Filmes' }" class="navbar-link">Filmes</router-link></li>
          <li><router-link :to="{ name: 'Bombando' }" class="navbar-link">Bombando</router-link></li>
          <li><router-link :to="{ name: 'MinhaLista' }" class="navbar-link">Minha Lista</router-link></li>
        </ul>
      </div>
      
      <div class="navbar-right">
        <!-- BUSCA -->
        <div class="search-container" :class="{ active: searchActive }">
          <Search 
            v-show="!searchActive"
            class="navbar-icon search-icon" 
            @click="toggleSearch"
          />
          
          <Transition name="search-expand">
            <div v-if="searchActive" class="search-input-wrapper">
              <Search class="search-icon-inside" />
              <input
                ref="searchInput"
                v-model="searchQuery"
                @input="handleSearch"
                @keyup.enter="performSearch"
                @blur="closeSearchDelayed"
                type="text"
                placeholder="Títulos, pessoas, gêneros"
                class="search-input"
              />
              <button 
                v-if="searchQuery" 
                @click="clearSearch" 
                class="search-clear"
              >
                ✕
              </button>
            </div>
          </Transition>
        </div>

        <!-- Dropdown de Resultados -->
        <Transition name="fade">
          <div v-if="searchResults.length > 0 && !isSearchPage" class="search-dropdown">
            <div class="search-dropdown-header">
              <span>Resultados para "{{ searchQuery }}"</span>
              <button @click="performSearch" class="view-all-btn">
                Ver todos
              </button>
            </div>
            
            <!-- Loading State -->
            <div v-if="searchLoading" class="search-loading">
              <div class="mini-spinner"></div>
              Buscando...
            </div>
            
            <!-- Results -->
            <div 
              v-else
              v-for="result in searchResults.slice(0, 5)" 
              :key="result.id"
              class="search-result-item"
              @mousedown.prevent="selectSearchResult(result)"
            >
              <img :src="result.image" :alt="result.title" />
              <div class="search-result-info">
                <h4>{{ result.title }}</h4>
                <span class="search-result-meta">
                  {{ result.year || 'N/A' }} • {{ result.mediaType === 'tv' ? 'Série' : 'Filme' }}
                </span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- NOTIFICAÇÕES -->
        <div class="notification-container">
          <Bell class="navbar-icon" @click="toggleNotifications" />
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </div>

        <Transition name="fade">
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="notifications-header">
              <h3>Notificações</h3>
            </div>
            <div class="notifications-list">
              <div 
                v-for="notif in notifications" 
                :key="notif.id"
                class="notification-item"
                :class="{ unread: !notif.read }"
              >
                <div class="notification-icon">🔔</div>
                <div class="notification-content">
                  <p>{{ notif.message }}</p>
                  <span class="notification-time">{{ notif.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
        
        <!-- PERFIL -->
        <div class="navbar-profile" @click="toggleProfileMenu">
          <img 
            v-if="currentProfileAvatar" 
            :src="currentProfileAvatar" 
            :alt="currentProfileName" 
            class="navbar-profile-img"
          />
          <div v-else class="navbar-profile-placeholder"></div>
          
          <div v-if="showProfileMenu" class="navbar-profile-menu">
            <div class="navbar-profile-arrow"></div>
            
            <div class="navbar-profile-header">
              <img 
                v-if="currentProfileAvatar" 
                :src="currentProfileAvatar" 
                :alt="currentProfileName" 
                class="navbar-profile-img-lg"
              />
              <div v-else class="navbar-profile-placeholder-lg"></div>
              <div class="navbar-profile-details-text">
                <span class="navbar-profile-name-lg">{{ currentProfileName }}</span>
                <span class="navbar-profile-email-lg">{{ currentUserEmail }}</span>
              </div>
            </div>

            <div class="navbar-profile-details">
              <div class="navbar-profile-detail">
                <span class="navbar-profile-detail-label">Plano:</span>
                <span class="navbar-profile-detail-value">Premium Ultra HD</span>
              </div>
              <div class="navbar-profile-detail">
                <span class="navbar-profile-detail-label">Status:</span>
                <span class="navbar-profile-detail-value">Ativo</span>
              </div>
            </div>
            
            <ul class="navbar-profile-options">
              <li class="navbar-profile-option" @click="goToProfiles">
                <User class="navbar-option-icon" />
                Gerenciar Perfis
              </li>
              <li class="navbar-profile-option">
                <Settings class="navbar-option-icon" />
                Conta
              </li>
              <li class="navbar-profile-option">
                <HelpCircle class="navbar-option-icon" />
                Ajuda
              </li>
              <li class="navbar-profile-option navbar-profile-logout" @click="handleLogout">
                <LogOut class="navbar-option-icon" />
                Sair da Metflix
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-vue-next'
import { useAuth } from '../composables/use-auth.js'
import { useMovies } from '../composables/use-movies.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuth()
const moviesStore = useMovies()

// BUSCA
const searchActive = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)
const searchLoading = ref(false)
const isSearchPage = computed(() => route.name === 'Search')

let searchTimeout = null

const toggleSearch = async () => {
  searchActive.value = !searchActive.value
  if (searchActive.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    clearSearch()
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  
  if (searchQuery.value.length > 2) {
    searchLoading.value = true
    searchTimeout = setTimeout(async () => {
      searchResults.value = await moviesStore.searchMovies(searchQuery.value)
      searchLoading.value = false
    }, 500) // Debounce de 500ms
  } else {
    searchResults.value = []
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'Search',
      query: { q: searchQuery.value }
    })
    searchActive.value = false
    searchResults.value = []
  }
}

const closeSearchDelayed = () => {
  setTimeout(() => {
    if (!searchQuery.value) {
      searchActive.value = false
    }
    searchResults.value = []
  }, 200)
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const selectSearchResult = (movie) => {
  console.log('Selecionou:', movie.title)
  clearSearch()
  searchActive.value = false
  // Navegar para home e abrir modal
  if (route.name !== 'Home') {
    router.push({ name: 'Home' })
  }
}

// NOTIFICAÇÕES
const showNotifications = ref(false)
const unreadCount = ref(3)
const notifications = ref([
  { id: 1, message: 'Nova temporada de Stranger Things disponível!', time: '2h atrás', read: false },
  { id: 2, message: 'Seu plano será renovado em 3 dias', time: '1 dia atrás', read: false },
  { id: 3, message: 'Novo filme adicionado em Ação', time: '2 dias atrás', read: true }
])

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    setTimeout(() => {
      notifications.value.forEach(n => n.read = true)
      unreadCount.value = 0
    }, 1000)
  }
}

// PERFIL
const isScrolled = ref(false)
const showProfileMenu = ref(false)
const currentProfileName = ref('Perfil')
const currentProfileAvatar = ref('https://placehold.co/40x40/e50914/ffffff?text=P')
const currentUserEmail = ref('usuario@metflix.com')

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = () => {
  authStore.logout()
  localStorage.removeItem("metflix_active_profile")
  router.push({ name: 'Login' })
  showProfileMenu.value = false
}

const goToProfiles = () => {
  router.push({ name: 'Profiles' })
  showProfileMenu.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(searchTimeout)
})
</script>

<style scoped>
:root {
  --metflix-red: #e50914;
  --metflix-dark: #141414;
  --metflix-gray: #b3b3b3;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0 4%;
  height: 68px;
  background-color: transparent;
  transition: background-color 0.4s ease;
}

.navbar.scrolled {
  background-color: var(--metflix-dark);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-logo {
  color: var(--metflix-red);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -1px;
}

.navbar-links {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 18px;
}

@media (min-width: 768px) {
  .navbar-links {
    display: flex;
  }
}

.navbar-link {
  color: #e5e5e5;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.navbar-link:hover {
  color: var(--metflix-gray);
}

.navbar-link.router-link-active {
  font-weight: 600;
  color: #fff;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.navbar-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #fff;
  transition: color 0.2s;
}

.navbar-icon:hover {
  color: var(--metflix-gray);
}

/* BUSCA */
.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid white;
  border-radius: 4px;
  padding: 0 15px;
  gap: 10px;
  min-width: 300px;
}

.search-icon-inside {
  width: 18px;
  height: 18px;
  color: #999;
  flex-shrink: 0;
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  padding: 8px 0;
  font-size: 14px;
  width: 100%;
}

.search-clear {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.search-clear:hover {
  color: white;
}

.search-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  width: 450px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
}

.search-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-dropdown-header span {
  font-size: 14px;
  color: #999;
}

.view-all-btn {
  background: none;
  border: none;
  color: #e50914;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #999;
}

.mini-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(229, 9, 20, 0.3);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-result-item {
  display: flex;
  gap: 15px;
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item img {
  width: 70px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.search-result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.search-result-info h4 {
  font-size: 15px;
  font-weight: 500;
  color: white;
  margin: 0;
}

.search-result-meta {
  font-size: 13px;
  color: #999;
}

/* NOTIFICAÇÕES */
.notification-container {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e50914;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.notifications-dropdown {
  position: absolute;
  top: 60px;
  right: 80px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1001;
}

.notifications-header {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notifications-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.notifications-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(229, 9, 20, 0.1);
}

.notification-icon {
  font-size: 24px;
}

.notification-content p {
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

/* PERFIL */
.navbar-profile {
  position: relative;
  cursor: pointer;
}

.navbar-profile-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

.navbar-profile-placeholder {
  width: 32px;
  height: 32px;
  background-color: #555;
  border-radius: 4px;
}

.navbar-profile-menu {
  position: absolute;
  top: 40px;
  right: -10px;
  background-color: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  min-width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.navbar-profile-arrow {
  position: absolute;
  top: -10px;
  right: 15px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid rgba(255, 255, 255, 0.2);
}

.navbar-profile-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 10px;
}

.navbar-profile-img-lg,
.navbar-profile-placeholder-lg {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.navbar-profile-details-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar-profile-name-lg {
  font-size: 1rem;
  font-weight: 500;
}

.navbar-profile-email-lg {
  font-size: 0.8rem;
  color: var(--metflix-gray);
  margin: 4px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-profile-details {
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-profile-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.navbar-profile-detail:last-child {
  margin-bottom: 0;
}

.navbar-profile-detail-label {
  color: var(--metflix-gray);
}

.navbar-profile-detail-value {
  color: #fff;
  font-weight: 500;
}

.navbar-profile-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-profile-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.navbar-profile-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-option-icon {
  width: 20px;
  height: 20px;
}

.navbar-profile-logout {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* ANIMATIONS */
.search-expand-enter-active,
.search-expand-leave-active {
  transition: all 0.3s ease;
}

.search-expand-enter-from {
  opacity: 0;
  transform: scaleX(0);
  transform-origin: right;
}

.search-expand-leave-to {
  opacity: 0;
  transform: scaleX(0);
  transform-origin: right;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
