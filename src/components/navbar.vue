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
            
            <div v-if="searchLoading" class="search-loading">
              <div class="mini-spinner"></div>
              Buscando...
            </div>
            
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
              <div class="notifications-actions">
                <button 
                  v-if="notifications.length > 0"
                  @click="handleMarkAllAsRead" 
                  class="mark-all-btn"
                  title="Marcar todas como lidas"
                >
                  ✓ Marcar todas
                </button>
                <button 
                  v-if="notifications.length > 0"
                  @click="handleClearAll" 
                  class="clear-all-btn"
                  title="Limpar todas"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <!-- Loading -->
            <div v-if="notificationsLoading" class="notifications-loading">
              <div class="mini-spinner"></div>
              Carregando...
            </div>
            
            <!-- Lista de Notificações -->
            <div v-else-if="notifications.length > 0" class="notifications-list">
              <div 
                v-for="notif in notifications" 
                :key="notif.id"
                class="notification-item"
                :class="{ unread: !notif.read }"
                @click="handleNotificationClick(notif)"
              >
                <div class="notification-icon">
                  {{ getNotificationIcon(notif.notification_type) }}
                </div>
                <div class="notification-content">
                  <h4 class="notification-title">{{ notif.title }}</h4>
                  <p class="notification-message">{{ notif.message }}</p>
                  <span class="notification-time">{{ formatTimeAgo(notif.created_at) }}</span>
                </div>
                <button 
                  v-if="!notif.read"
                  @click.stop="markAsRead(notif.id)"
                  class="mark-read-btn"
                  title="Marcar como lida"
                >
                  ✓
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="notifications-empty">
              <div class="empty-icon">🔔</div>
              <p>Sem notificações</p>
            </div>
          </div>
        </Transition>
        
        <!-- PERFIL -->
        <div class="navbar-profile" @click="toggleProfileMenu">
          <img 
            v-if="currentProfile?.avatar" 
            :src="currentProfile.avatar" 
            :alt="currentProfile.name" 
            class="navbar-profile-img"
          />
          <div v-else class="navbar-profile-placeholder">P</div>
          
          <div v-if="showProfileMenu" class="navbar-profile-menu">
            <div class="navbar-profile-arrow"></div>
            
            <div class="navbar-profile-header">
              <img 
                v-if="currentProfile?.avatar" 
                :src="currentProfile.avatar" 
                :alt="currentProfile.name" 
                class="navbar-profile-img-lg"
              />
              <div v-else class="navbar-profile-placeholder-lg">P</div>
              <div class="navbar-profile-details-text">
                <span class="navbar-profile-name-lg">{{ currentProfile?.name || 'Perfil' }}</span>
                <span class="navbar-profile-email-lg">{{ currentUser?.email || '' }}</span>
              </div>
            </div>
            
            <ul class="navbar-profile-options">
              <li class="navbar-profile-option" @click="goToProfiles">
                <User class="navbar-option-icon" />
                Gerenciar Perfis
              </li>
              <li class="navbar-profile-option" @click="goToHelp">
                <HelpCircle class="navbar-option-icon" />
                Ajuda
              </li>
              <!-- ✅ NOVO - BOTÃO EXCLUIR CONTA -->
              <li class="navbar-profile-option navbar-profile-danger" @click="openDeleteModal">
                <Trash2 class="navbar-option-icon" />
                Excluir Conta
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

    <!-- ✅ MODAL DE EXCLUSÃO DE CONTA -->
    <DeleteAccountModal
      :is-open="showDeleteModal"
      @close="showDeleteModal = false"
      @account-deleted="handleAccountDeleted"
    />
  </header>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Bell, User, HelpCircle, LogOut, Trash2 } from 'lucide-vue-next'
import { useAuth } from '../stores/use-auth.js'
import { useMovies } from '../composables/use-movies.js'
import { useNotifications } from '../composables/use-notifications.js'
import DeleteAccountModal from './delete-account-modal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuth()
const moviesStore = useMovies()

// ✅ NOTIFICAÇÕES (REAL)
const {
  notifications,
  loading: notificationsLoading,
  unreadCount,
  loadNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
  startPolling,
  stopPolling,
  formatTimeAgo,
} = useNotifications()

// PERFIL E USUÁRIO
const currentProfile = computed(() => {
  const profileData = localStorage.getItem('metflix_active_profile')
  if (profileData) {
    try {
      return JSON.parse(profileData)
    } catch (e) {
      console.error('Erro ao carregar perfil:', e)
      return null
    }
  }
  return null
})

const currentUser = computed(() => authStore.user)

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
    }, 500)
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
  if (route.name !== 'Home') {
    router.push({ name: 'Home' })
  }
}

// NOTIFICAÇÕES
const showNotifications = ref(false)

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  
  if (showNotifications.value && notifications.value.length === 0) {
    await loadNotifications()
  }
}

const handleNotificationClick = async (notification) => {
  // Marcar como lida
  if (!notification.read) {
    await markAsRead(notification.id)
  }
  
  // Navegar se tiver link
  if (notification.link) {
    router.push(notification.link)
    showNotifications.value = false
  }
}

const handleMarkAllAsRead = async () => {
  await markAllAsRead()
}

const handleClearAll = async () => {
  if (confirm('Tem certeza que deseja limpar todas as notificações?')) {
    await clearAll()
  }
}

const getNotificationIcon = (type) => {
  const icons = {
    'new_content': '🎬',
    'favorite_added': '⭐',
    'recommendation': '💡',
    'system': '🔔',
    'achievement': '🏆',
  }
  return icons[type] || '🔔'
}

// PERFIL
const isScrolled = ref(false)
const showProfileMenu = ref(false)
const showDeleteModal = ref(false) // ✅ NOVO

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const goToProfiles = () => {
  showProfileMenu.value = false
  router.push({ name: 'ProfileManagement' })
}

const goToHelp = () => {
  showProfileMenu.value = false
  router.push({ name: 'Help' })
}

// ✅ NOVO - ABRIR MODAL DE EXCLUSÃO
const openDeleteModal = () => {
  showProfileMenu.value = false
  showDeleteModal.value = true
}

// ✅ NOVO - APÓS EXCLUSÃO DA CONTA
const handleAccountDeleted = () => {
  console.log('🗑️ Conta excluída, fazendo logout...')
  handleLogout()
}

const handleLogout = async () => {
  console.log('🚪 Iniciando logout...')
  
  showProfileMenu.value = false
  
  // Parar polling de notificações
  stopPolling()
  
  // Limpar tudo
  localStorage.clear()
  sessionStorage.clear()
  
  authStore.user = null
  authStore.isAuthenticated = false
  
  await new Promise(resolve => setTimeout(resolve, 100))
  
  window.location.href = '/'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // ✅ Iniciar polling de notificações a cada 30 segundos
  if (authStore.isAuthenticated) {
    startPolling(30000)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(searchTimeout)
  stopPolling()
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
  height: 70px;
  /* ✅ GRADIENTE ESCURO NO TOPO (NETFLIX STYLE) */
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 10%, transparent);
  transition: background-color 0.4s ease;
}

/* ✅ AO ROLAR, FICA TOTALMENTE ESCURO */
.navbar.scrolled {
  background-color: rgb(20, 20, 20); /* ✅ PRETO SÓLIDO */
  background-image: none; /* ✅ REMOVE GRADIENTE */
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
  gap: 25px;
}

.navbar-logo {
  color: var(--metflix-red);
  font-size: 1.73rem;
  font-weight: 900;
  letter-spacing: 0.1rem;
  text-decoration: none;
}

.navbar-links {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

@media (min-width: 768px) {
  .navbar-links {
    display: flex;
  }
}

.navbar-link {
  color: #e5e5e5;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.4s;
  text-decoration: none;
}

.navbar-link:hover {
  color: #b3b3b3;
}

.navbar-link.router-link-active {
  font-weight: 700;
  color: #fff;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
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
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 2px;
  padding: 0 10px;
  gap: 8px;
  min-width: 270px;
  height: 34px;
}

.search-icon-inside {
  width: 16px;
  height: 16px;
  color: #fff;
  flex-shrink: 0;
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  padding: 6px 0;
  font-size: 14px;
  width: 100%;
}

.search-input::placeholder {
  color: #808080;
}

.search-clear {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.search-clear:hover {
  color: #b3b3b3;
}

.search-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: rgba(0, 0, 0, 0.98);
  border: 1px solid rgba(229, 9, 20, 0.8);
  border-radius: 0;
  width: 450px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.9);
}

.search-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.search-dropdown-header span {
  font-size: 14px;
  color: #b3b3b3;
  font-weight: 600;
}

.view-all-btn {
  background: none;
  border: none;
  color: #e50914;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px 20px;
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
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.3s;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item img {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 3px;
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
  font-weight: 600;
  color: white;
  margin: 0;
}

.search-result-meta {
  font-size: 13px;
  color: #808080;
}

/* NOTIFICAÇÕES */
.notification-container {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e50914;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid #141414;
}

.notifications-dropdown {
  position: absolute;
  top: 50px;
  right: 80px;
  background: rgba(0, 0, 0, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  width: 400px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.9);
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.notifications-header h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.notifications-actions {
  display: flex;
  gap: 8px;
}

.mark-all-btn,
.clear-all-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.mark-all-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #e50914;
}

.clear-all-btn:hover {
  background: rgba(229, 9, 20, 0.2);
  border-color: #e50914;
}

.notifications-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: #999;
}

.notifications-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(229, 9, 20, 0.08);
}

.notification-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #fff;
}

.notification-message {
  font-size: 13px;
  margin: 0 0 6px 0;
  color: #b3b3b3;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #808080;
}

.mark-read-btn {
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.mark-read-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #e50914;
}

.notifications-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.3;
}

.notifications-empty p {
  font-size: 14px;
  color: #808080;
  margin: 0;
}

/* PERFIL */
.navbar-profile {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
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
  background-color: #808080;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.navbar-profile-menu {
  position: absolute;
  top: 45px;
  right: -10px;
  background-color: rgba(0, 0, 0, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0;
  min-width: 220px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.9);
}

.navbar-profile-arrow {
  position: absolute;
  top: -6px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(255, 255, 255, 0.25);
}

.navbar-profile-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  gap: 10px;
}

.navbar-profile-img-lg {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.navbar-profile-placeholder-lg {
  width: 36px;
  height: 36px;
  background-color: #808080;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.navbar-profile-details-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.navbar-profile-name-lg {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.navbar-profile-email-lg {
  font-size: 12px;
  color: #808080;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-profile-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-profile-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-profile-option:last-child {
  border-bottom: none;
}

.navbar-profile-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: underline;
}

.navbar-option-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ✅ NOVO - ESTILO PARA EXCLUIR CONTA */
.navbar-profile-danger {
  color: #ff4444;
}

.navbar-profile-danger:hover {
  background-color: rgba(229, 9, 20, 0.1);
  color: #e50914;
}

.navbar-profile-logout {
  border-top: 2px solid rgba(255, 255, 255, 0.25);
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
