<template>
  <div class="metflix-app">

    <!-- 1️⃣ Tela de Login -->
    <LoginPage 
      v-if="!isAuthenticated"
      @login-success="handleLoginSuccess"
    />

    <!-- 2️⃣ Seleção / Gerenciamento de Perfis -->
    <ProfileManagement
      v-else-if="showProfileManagement"
      @profile-selected="handleProfileSelected"
      @profile-confirmed="handleProfileConclude"
      @back="showProfileManagement = false"
    />

    <!-- 3️⃣ Aplicação Principal -->
    <div v-else>
      <Navbar
        :profile="activeProfile"
        @logout="handleLogout"
        @manage-profiles="openProfileManagement"
      />

      <router-view />

      <footer class="footer">
        <div class="footer-content">
          © 2023-2024 Metflix, Inc.
        </div>
      </footer>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuth } from "./composables/use-auth.js"

// Componentes
import Navbar from "./components/navbar.vue"
import LoginPage from "./components/login-page.vue"
import ProfileManagement from "./components/profile-management.vue"

// Auth
const { isAuthenticated, refreshAuthState } = useAuth()

// Estado reativo do perfil ativo
const activeProfile = ref(null)

// Controle do gerenciador de perfis
const showProfileManagement = ref(false)

// Verifica se tem perfil ativo salvo
const hasActiveProfile = () => {
  return !!localStorage.getItem("metflix_active_profile")
}

//
// LOGIN
//
const handleLoginSuccess = () => {
  refreshAuthState()

  if (!hasActiveProfile()) {
    showProfileManagement.value = true
  }
}

//
// PERFIS
//

// Clicou em um perfil (apenas seleção visual)
const handleProfileSelected = (profile) => {
  console.log("Profile selected:", profile.name)
}

// Confirmou o perfil (CONCLUÍDO)
const handleProfileConclude = (profile) => {
  console.log("Perfil concluído no MetflixApp:", profile)

  // Salvar no localStorage
  localStorage.setItem("metflix_active_profile", JSON.stringify(profile))

  // Atualiza estado reativo
  activeProfile.value = profile

  // Fecha tela de perfis
  showProfileManagement.value = false
}

// Abriu o gerenciador via navbar
const openProfileManagement = () => {
  showProfileManagement.value = true
}

//
// LOGOUT
//
const handleLogout = () => {
  localStorage.removeItem("metflix_active_profile")
  activeProfile.value = null

  refreshAuthState()
  showProfileManagement.value = false
}

//
// Ao iniciar o app
//
onMounted(() => {
  if (!isAuthenticated.value) return

  const saved = localStorage.getItem("metflix_active_profile")

  if (saved) {
    activeProfile.value = JSON.parse(saved)
  } else {
    showProfileManagement.value = true
  }
})
</script>

<style scoped>
.metflix-app {
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
}
</style>
