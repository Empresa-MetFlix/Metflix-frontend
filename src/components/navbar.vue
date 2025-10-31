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
        <div class="navbar-profile" @click="toggleProfileMenu">
          <img 
            v-if="currentProfileAvatar" 
            :src="currentProfileAvatar" 
            :alt="currentProfileName" 
            class="navbar-profile-img"
          />
          <div v-else class="navbar-profile-placeholder"></div>
          
          <!-- Menu dropdown -->
          <div v-if="showProfileMenu" class="navbar-profile-menu">
            <div class="navbar-profile-arrow"></div>
            
            <!-- Cabeçalho do perfil -->
            <div class="navbar-profile-header">
              <img 
                v-if="currentProfileAvatar" 
                :src="currentProfileAvatar" 
                :alt="currentProfileName" 
                class="navbar-profile-user-img"
              />
              <div class="navbar-profile-user-info">
                <h3 class="navbar-profile-user-name">{{ currentProfileName }}</h3>
                <p class="navbar-profile-user-email">{{ user?.email }}</p>
              </div>
            </div>
            
            <!-- Detalhes da conta -->
            <div class="navbar-profile-details">
              <div class="navbar-profile-detail">
                <span class="navbar-profile-detail-label">Plano:</span>
                <span class="navbar-profile-detail-value">Premium</span>
              </div>
              <div class="navbar-profile-detail">
                <span class="navbar-profile-detail-label">Perfil ativo:</span>
                <span class="navbar-profile-detail-value">{{ currentProfileName }}</span>
              </div>
            </div>
            
            <!-- Opções do menu -->
            <ul class="navbar-profile-options">
              <li class="navbar-profile-option">
                <a href="#" @click.prevent="handleManageProfiles" class="navbar-profile-option-link">
                  <User class="navbar-profile-option-icon" />
                  Gerenciar perfis
                </a>
              </li>
              <li class="navbar-profile-option">
                <a href="#" class="navbar-profile-option-link">
                  <Settings class="navbar-profile-option-icon" />
                  Conta
                </a>
              </li>
              <li class="navbar-profile-option">
                <a href="#" class="navbar-profile-option-link">
                  <HelpCircle class="navbar-profile-option-icon" />
                  Central de Ajuda
                </a>
              </li>
              <li class="navbar-profile-option navbar-profile-logout">
                <a href="#" @click.prevent="handleLogout" class="navbar-profile-option-link">
                  <LogOut class="navbar-profile-option-icon" />
                  Sair da Metflix
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-vue-next'
import { useAuth } from '../composables/use-auth';

const emit = defineEmits(['logout', 'manage-profiles'])
const { user, logout } = useAuth()

const isScrolled = ref(false)
const showProfileMenu = ref(false)
const activeProfile = ref(null)

// Hooks must be called at the top level
const loadActiveProfile = () => {
  if (typeof window !== "undefined") {
    const storedActiveProfile = localStorage.getItem("metflix_active_profile")
    if (storedActiveProfile) {
      activeProfile.value = JSON.parse(storedActiveProfile)
    }
  }
}

const currentProfileName = computed(() => {
  return activeProfile.value?.name || user.value?.name || 'Usuário'
})

const currentProfileAvatar = computed(() => {
  return activeProfile.value?.avatar || user.value?.avatar
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = () => {
  showProfileMenu.value = false
  logout()
  emit('logout')
}

const handleManageProfiles = () => {
  showProfileMenu.value = false
  emit('manage-profiles')
}

const handleClickOutside = (event) => {
  if (showProfileMenu.value && !event.target.closest('.navbar-profile')) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  loadActiveProfile()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
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
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  overflow: visible;
  cursor: pointer;
}

.navbar-profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.navbar-profile-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e50914;
  border-radius: 4px;
}

.navbar-profile-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: hidden;
}

.navbar-profile-arrow {
  position: absolute;
  top: -8px;
  right: 15px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(0, 0, 0, 0.95);
}

.navbar-profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-profile-user-img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.navbar-profile-user-info {
  flex: 1;
  min-width: 0;
}

.navbar-profile-user-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-profile-user-email {
  font-size: 0.8rem;
  color: #b3b3b3;
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
  color: #b3b3b3;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.navbar-profile-option:last-child {
  border-bottom: none;
}

.navbar-profile-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-profile-option-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.navbar-profile-option-icon {
  width: 16px;
  height: 16px;
  color: #b3b3b3;
}

.navbar-profile-logout {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.navbar-profile-logout .navbar-profile-option-link {
  color: #e50914;
}

.navbar-profile-logout .navbar-profile-option-icon {
  color: #e50914;
}
</style>
