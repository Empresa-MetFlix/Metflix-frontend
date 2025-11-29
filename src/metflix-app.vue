<template>
  <div class="metflix-app">
    <div v-if="isAuthenticated && activeProfile">
      <Navbar
        :profile="activeProfile"
        :user="currentUser"
        @logout="handleLogout"
        @manage-profiles="openProfileManagement"
      />

      <router-view :key="profileKey" />

      <footer class="footer">
        <div class="footer-content">
          <div class="footer-links">
            <router-link to="/faq" class="footer-link">Perguntas frequentes</router-link>
            <router-link to="/help" class="footer-link">Central de Ajuda</router-link>
            <router-link to="/terms" class="footer-link">Termos de Uso</router-link>
            <router-link to="/privacy" class="footer-link">Privacidade</router-link>
          </div>
          <p class="footer-text">© 2023-2024 Metflix, Inc.</p>
        </div>
      </footer>
    </div>

    <ProfileManagement
      v-else-if="isAuthenticated && !activeProfile"
      ref="profileManagementRef"
      @profile-selected="handleProfileSelected"
      @profile-confirmed="handleProfileConfirmed"
      @back="activeProfile = null"
    />

    <SignupPage 
      v-else-if="showSignup"
      @signup-success="handleSignupSuccess"
      @back-to-login="showSignup = false"
    />

    <LoginPage 
      v-else
      @login-success="handleLoginSuccess"
      @go-to-signup="showSignup = true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue"
import { useAuth } from "./stores/use-auth.js"
import { useRouter, useRoute } from "vue-router"
import Navbar from "./components/navbar.vue"
import LoginPage from "./components/login-page.vue"
import SignupPage from "./components/signup-page.vue"
import ProfileManagement from "./components/profile-management.vue"

const authStore = useAuth()
const router = useRouter()
const route = useRoute()

const isAuthenticated = ref(false)
const activeProfile = ref(null)
const profileManagementRef = ref(null)
const showSignup = ref(false)

// ✅ User do authStore
const currentUser = computed(() => authStore.user)

// ✅ Key reativa
const profileKey = computed(() => {
  return activeProfile.value?.id ? `profile-${activeProfile.value.id}` : 'no-profile'
})

const checkAuth = () => {
  const token = localStorage.getItem('metflix-auth-token')
  console.log('🔍 Checando token:', token ? 'EXISTE' : 'NÃO EXISTE')
  isAuthenticated.value = !!token
  console.log('🔐 checkAuth:', isAuthenticated.value)
}

onMounted(() => {
  console.log('📱 Metflix-app montado')
  checkAuth()
  
  const saved = localStorage.getItem("metflix-active-profile")
  if (saved && isAuthenticated.value) {
    try {
      activeProfile.value = JSON.parse(saved)
      console.log('✅ Perfil carregado do localStorage:', activeProfile.value)
    } catch (e) {
      console.error('❌ Erro ao carregar perfil:', e)
      localStorage.removeItem("metflix-active-profile")
      activeProfile.value = null
    }
  }
})

const handleLoginSuccess = async () => {
  console.log('✅ Login success no metflix-app')
  await new Promise(resolve => setTimeout(resolve, 150))
  checkAuth()
  localStorage.removeItem('metflix-active-profile')
  activeProfile.value = null
  showSignup.value = false
  console.log('🎭 Mostrando tela de seleção de perfis')
}

const handleSignupSuccess = () => {
  console.log('✅ Cadastro realizado com sucesso!')
  showSignup.value = false
}

const handleProfileSelected = (profile) => {
  console.log("📌 Profile selected:", profile.name)
}

const handleProfileConfirmed = async (profile) => {
  console.log("✅ Perfil confirmado:", profile.name)
  
  // Salvar no localStorage
  localStorage.setItem('metflix-active-profile', JSON.stringify(profile))
  
  // Atualizar activeProfile
  activeProfile.value = profile
  
  // ✅ SEMPRE recarregar a página quando confirmar perfil
  console.log('🔄 Recarregando página com novo perfil')
  await nextTick()
  window.location.href = '/' // ✅ Forçar navegação + reload
}

const openProfileManagement = () => {
  console.log('🔄 Abrindo tela de seleção de perfis')
  activeProfile.value = null
}

const handleLogout = () => {
  console.log('🚪 Fazendo logout')
  localStorage.removeItem("metflix-active-profile")
  localStorage.removeItem("metflix-auth-token")
  localStorage.removeItem("metflix-refresh-token")
  activeProfile.value = null
  isAuthenticated.value = false
  showSignup.value = false
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.metflix-app {
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
}

.footer {
  padding: 40px 60px;
  background-color: #141414;
  border-top: 1px solid #333;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.footer-link {
  color: #808080;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #fff;
}

.footer-text {
  margin: 0;
  color: #808080;
  font-size: 13px;
}

@media (max-width: 768px) {
  .footer {
    padding: 30px 20px;
  }

  .footer-links {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
