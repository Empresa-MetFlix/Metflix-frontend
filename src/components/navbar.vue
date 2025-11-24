<template>
  <!-- Não renderiza a navbar se estiver na rota de login -->
  <header v-if="!isLoginRoute" class="navbar" :class="{ 'scrolled': isScrolled }">
    <nav class="navbar-container">
      <div class="navbar-left">
        <div class="navbar-logo">METFLIX</div>
        <ul class="navbar-links">
          <li>
            <router-link to="/" class="navbar-link navbar-link-active">Início</router-link>
          </li>
          <router-link to="/series">Séries</router-link>
<router-link to="/filmes">Filmes</router-link>
<router-link to="/bombando">Bombando</router-link>
          <li>
            <router-link to="/minha-lista" class="navbar-link">Minha Lista</router-link>
          </li>
        </ul>
      </div>

      <div class="navbar-right">
        <!-- Ícones completos -->
        <svg xmlns="http://www.w3.org/2000/svg" class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        <!-- Perfil -->
        <div class="navbar-profile" @mouseenter="showProfileMenu = true" @mouseleave="showProfileMenu = false">
          <img :src="currentProfileAvatar" :alt="currentProfileName" class="navbar-profile-img" />
          <div v-if="showProfileMenu" class="navbar-profile-menu">
            <div class="navbar-profile-arrow"></div>
            <div class="navbar-profile-header">
              <img :src="currentProfileAvatar" :alt="currentProfileName" class="navbar-profile-img-lg"/>
              <div class="navbar-profile-details-text">
                <span class="navbar-profile-name-lg">{{ currentProfileName }}</span>
                <span class="navbar-profile-email-lg">{{ userEmail || 'usuário@metflix.com' }}</span>
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
                <svg xmlns="http://www.w3.org/2000/svg" class="navbar-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Gerenciar Perfis
              </li>
              <li class="navbar-profile-option">
                <svg xmlns="http://www.w3.org/2000/svg" class="navbar-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12.22 2h-.44C9.75 2 9 2.75 9 4v.5C9 5.33 8.33 6 7.5 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h3.5c.83 0 1.5.67 1.5 1.5V20c0 1.25.75 2 2.22 2h.44c1.47 0 2.22-.75 2.22-2v-.5c0-.83.67-1.5 1.5-1.5H20c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.5c-.83 0-1.5-.67-1.5-1.5V4c0-1.25-.75-2-2.22-2z"/>
                </svg>
                Conta
              </li>
              <li class="navbar-profile-option">
                <svg xmlns="http://www.w3.org/2000/svg" class="navbar-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
                Ajuda
              </li>
              <li class="navbar-profile-option navbar-profile-logout" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" class="navbar-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  profile: Object,
  userEmail: String,
})
const emit = defineEmits(['logout', 'manage-profiles'])

const route = useRoute()
const isLoginRoute = computed(() => route.path === '/login')

const isScrolled = ref(false)
const showProfileMenu = ref(false)

const currentProfileName = computed(() => props.profile?.name || 'Selecione um Perfil')
const currentProfileAvatar = computed(() => props.profile?.avatar || 'https://placehold.co/40x40/555555/ffffff?text=P')

const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const handleLogout = () => { emit('logout'); showProfileMenu.value = false }
const goToProfiles = () => { emit('manage-profiles'); showProfileMenu.value = false }
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
  cursor: pointer;
}

.navbar-link:hover {
  color: var(--metflix-gray);
}

.navbar-link-active {
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

/* Menu Dropdown */
.navbar-profile-menu {
  position: absolute;
  top: 40px;
  right: -10px; 
  background-color: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  min-width: 280px; /* Aumentado para caber o layout */
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

.navbar-profile-img-lg {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
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
  color: #fff;
  transition: background-color 0.2s;
}

.navbar-profile-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-option-icon {
  width: 20px;
  height: 20px;
  color: var(--metflix-gray);
}

.navbar-profile-option:hover .navbar-option-icon {
    color: #fff;
}

.navbar-profile-logout {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>