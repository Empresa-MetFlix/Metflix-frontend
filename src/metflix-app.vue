<template>
  <div class="metflix-app">
    <div v-if="isAuthenticated && activeProfile">
      <Navbar
        :profile="activeProfile"
        @logout="handleLogout"
        @manage-profiles="openProfileManagement"
      />

      <router-view />

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

    <!-- ✅ TELA DE CADASTRO -->
    <SignupPage 
      v-else-if="showSignup"
      @signup-success="handleSignupSuccess"
      @back-to-login="showSignup = false"
    />

    <!-- ✅ TELA DE LOGIN -->
    <LoginPage 
      v-else
      @login-success="handleLoginSuccess"
      @go-to-signup="showSignup = true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import { useAuth } from "./stores/use-auth.js"
import { useRouter } from "vue-router"
import Navbar from "./components/navbar.vue"
import LoginPage from "./components/login-page.vue"
import SignupPage from "./components/signup-page.vue"
import ProfileManagement from "./components/profile-management.vue"

const authStore = useAuth()
const router = useRouter()

const isAuthenticated = ref(false)
const activeProfile = ref(null)
const profileManagementRef = ref(null)
const showSignup = ref(false)

const checkAuth = () => {
  const token = localStorage.getItem('metflix_auth_token')
  isAuthenticated.value = !!token
  console.log('🔐 checkAuth:', isAuthenticated.value)
}

onMounted(() => {
  console.log('📱 Metflix-app montado')
  checkAuth()
  
  const saved = localStorage.getItem("metflix_active_profile")
  if (saved && isAuthenticated.value) {
    try {
      activeProfile.value = JSON.parse(saved)
      console.log('✅ Perfil carregado do localStorage:', activeProfile.value)
    } catch (e) {
      console.error('❌ Erro ao carregar perfil:', e)
      localStorage.removeItem("metflix_active_profile")
      activeProfile.value = null
    }
  }
})

const handleLoginSuccess = async () => {
  console.log('✅ Login success no metflix-app')
  
  await nextTick()
  checkAuth()
  
  localStorage.removeItem('metflix_active_profile')
  activeProfile.value = null
  showSignup.value = false
  
  console.log('🎭 Mostrando tela de seleção de perfis')
}

// ✅ NOVO - Após cadastro bem-sucedido
const handleSignupSuccess = () => {
  console.log('✅ Cadastro realizado com sucesso!')
  showSignup.value = false
  // Usuário será redirecionado para login automaticamente
}

const handleProfileSelected = (profile) => {
  console.log("📌 Profile selected:", profile.name)
}

const handleProfileConfirmed = async (profile) => {
  console.log("✅ Perfil confirmado:", profile.name)
  
  localStorage.setItem('metflix_active_profile', JSON.stringify(profile))
  activeProfile.value = profile
  
  await nextTick()
  router.push('/')
}

const openProfileManagement = () => {
  console.log('🔄 Abrindo gerenciamento de perfis')
  activeProfile.value = null
  
  nextTick(() => {
    if (profileManagementRef.value) {
      profileManagementRef.value.activateManageMode()
    }
  })
}

const handleLogout = () => {
  console.log('🚪 Fazendo logout')
  
  localStorage.removeItem("metflix_active_profile")
  localStorage.removeItem("metflix_auth_token")
  localStorage.removeItem("metflix_refresh_token")
  
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
