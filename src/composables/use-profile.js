import { ref, readonly } from "vue"

// Estado do perfil ativo compartilhado
const activeProfile = ref(null)

// Carregar perfil ativo do localStorage se existir
const loadActiveProfileFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedProfile = localStorage.getItem("metflix_active_profile")
    if (storedProfile) {
      activeProfile.value = JSON.parse(storedProfile)
    }
  }
}

// Carregar perfil ao inicializar
loadActiveProfileFromStorage()

export function useProfile() {
  // Função para definir o perfil ativo
  const setActiveProfile = (profile) => {
    activeProfile.value = profile

    // Salvar no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("metflix_active_profile", JSON.stringify(profile))
    }
  }

  // Função para limpar o perfil ativo
  const clearActiveProfile = () => {
    activeProfile.value = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("metflix_active_profile")
    }
  }

  // Função para verificar se há perfil ativo
  const hasActiveProfile = () => {
    return activeProfile.value !== null
  }

  return {
    activeProfile: readonly(activeProfile),
    setActiveProfile,
    clearActiveProfile,
    hasActiveProfile,
  }
}
