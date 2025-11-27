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
      @profile-selected="handleProfileSelected"
      @profile-confirmed="handleProfileConclude"
      @back="activeProfile = null"
    />

    <LoginPage 
      v-else
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import { useAuth } from "./composables/use-auth.js"
import { useRouter } from "vue-router"
import Navbar from "./components/navbar.vue"
import LoginPage from "./components/login-page.vue"
import ProfileManagement from "./components/profile-management.vue"

const authStore = useAuth()
const router = useRouter()

const isAuthenticated = ref(false)

const activeProfile = ref(null)

const checkAuth = () => {
  const token = localStorage.getItem('metflix_auth_token')
  isAuthenticated.value = !!token
  console.log(' checkAuth:', isAuthenticated.value)
}

onMounted(() => {
  console.log(' Metflix-app montado')
  checkAuth()
  
  const saved = localStorage.getItem("metflix_active_profile")
  if (saved) {
    try {
      activeProfile.value = JSON.parse(saved)
      console.log(' Perfil carregado:', activeProfile.value)
    } catch (e) {
      console.error(' Erro ao carregar perfil:', e)
      localStorage.removeItem("metflix_active_profile")
    }
  }
})

const handleLoginSuccess = async () => {
  console.log(' Login success no metflix-app')
  
  await nextTick()
  checkAuth()
  
  const saved = localStorage.getItem("metflix_active_profile")
  console.log(' Perfil salvo:', saved)
  
  if (!saved) {
    console.log(' Indo para seleção de perfis')
    activeProfile.value = null
  } else {
    try {
      activeProfile.value = JSON.parse(saved)
      console.log(' Perfil carregado, indo para home:', activeProfile.value)
      await nextTick()
      router.push('/')
    } catch (e) {
      console.error(' Erro ao carregar perfil:', e)
      activeProfile.value = null
    }
  }
}

const handleProfileSelected = (profile) => {
  console.log("Profile selected:", profile.name)
}

const handleProfileConclude = async (profile) => {
  console.log(" Perfil concluído:", profile)
  
  localStorage.setItem("metflix_active_profile", JSON.stringify(profile))
  activeProfile.value = profile
  
  await nextTick()
  router.push('/')
}

const openProfileManagement = () => {
  activeProfile.value = null
}

const handleLogout = () => {
  console.log('🚪 Fazendo logout')
  
  localStorage.removeItem("metflix_active_profile")
  localStorage.removeItem("metflix_auth_token")
  localStorage.removeItem("metflix_refresh_token")
  
  activeProfile.value = null
  isAuthenticated.value = false
  
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
