<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Componentes
import Navbar from "./components/navbar.vue";
import ProfileManagement from "./components/ProfileManagement.vue";


// Store de autenticação
import { useAuth } from "./composables/use-auth.js";

const router = useRouter();
const store = useAuth();

const showProfileManager = ref(false);
const activeProfile = ref(JSON.parse(localStorage.getItem("metflix_active_profile")));

// Logout → redireciona para login isolado
const handleLogout = () => {
  localStorage.removeItem("metflix_auth_token");
  showProfileManager.value = false;
  router.push("/login"); // envia para login isolado
};
</script>

<template>
  <!-- Renderiza o app principal somente se houver perfil ativo -->
  <div v-if="activeProfile">
    <Navbar
      :profile="activeProfile"
      @logout="handleLogout"
      @manage-profiles="() => showProfileManager = true"
    />

    <ProfileManagement
      v-if="showProfileManager"
      @profile-selected="(p) => { activeProfile = p; showProfileManager = false; }"
      @back="() => showProfileManager = false"
    />

    <router-view :profile="activeProfile" />

    <FooterSection />
  </div>
</template>
