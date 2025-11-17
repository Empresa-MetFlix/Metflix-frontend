<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <nav class="navbar-container">
      <div class="navbar-left">
        <!-- Logo Metflix (Link para Início) -->
        <router-link :to="{ name: 'Home' }" class="navbar-logo">METFLIX</router-link>
        
        <!-- Links de Navegação usando router-link -->
        <ul class="navbar-links">
          <li><router-link :to="{ name: 'Home' }" class="navbar-link">Início</router-link></li>
          <li><router-link :to="{ name: 'Series' }" class="navbar-link">Séries</router-link></li>
          <li><router-link :to="{ name: 'Filmes' }" class="navbar-link">Filmes</router-link></li>
          <li><router-link :to="{ name: 'Bombando' }" class="navbar-link">Bombando</router-link></li>
          <li><router-link :to="{ name: 'MinhaLista' }" class="navbar-link">Minha Lista</router-link></li>
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
                class="navbar-profile-img-lg"
              />
              <div v-else class="navbar-profile-placeholder-lg"></div>
              <div class="navbar-profile-details-text">
                <span class="navbar-profile-name-lg">{{ currentProfileName }}</span>
                <span class="navbar-profile-email-lg">{{ currentUserEmail }}</span>
              </div>
            </div>

            <!-- Detalhes da conta (Mock) -->
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
            
            <!-- Opções do menu -->
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-vue-next'

// IMPORTAÇÃO CORRETA DO STORE DO PINIA
import { useAuth } from '../composables/use-auth.js'

const router = useRouter()
const authStore = useAuth()   // ✔ agora está reativo e conectado ao app

const isScrolled = ref(false)
const showProfileMenu = ref(false)

const currentProfileName = ref(
  localStorage.getItem("metflix_active_profile") || "Perfil"
)

const currentProfileAvatar = ref('https://placehold.co/40x40/e50914/ffffff?text=P')
const currentUserEmail = ref('usuario@metflix.com')

// Scroll da navbar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

// Abrir/Fechar menu
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

// Logout CORRIGIDO
const handleLogout = () => {
  authStore.logout()  // ✔ AGORA FUNCIONA
  localStorage.removeItem("metflix_active_profile")
  router.push({ name: 'Login' })
  showProfileMenu.value = false
}

// Gerenciar perfis
const goToProfiles = () => {
  router.push({ name: 'Profiles' })
  showProfileMenu.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>


<style scoped>
/* Variáveis de cor */
:root {
  --metflix-red: #e50914;
  --metflix-dark: #141414;
  --metflix-gray: #b3b3b3;
}

/* Estilos da barra de navegação */
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

/* Lado Esquerdo */
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
  display: none; /* Esconde links no mobile por padrão */
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

/* Classe de link ativo definida no router/index.js */
.navbar-link.navbar-link-active {
  font-weight: 600;
  color: #fff;
}

/* Lado Direito */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
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

/* Perfil e Dropdown */
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

/* Menu Dropdown */
.navbar-profile-menu {
  position: absolute;
  top: 40px;
  right: -10px; /* Ajuste a posição para alinhar com o ícone */
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

/* Estilos do cabeçalho do menu */
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

/* Estilos para detalhes da conta */
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

/* Estilos para opções do menu */
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
</style>