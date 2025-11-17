import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const isAuthenticated = ref(false)
  const token = ref(null)
  const userId = ref(null)
  const loading = ref(true)

  // Login
  function login(userToken, uid) {
    token.value = userToken || 'simulated-jwt-token-12345'
    userId.value = uid || 'simulated-user-id-54321'
    isAuthenticated.value = true

    localStorage.setItem('metflix_auth_token', token.value)
    console.log("Login realizado com sucesso. Token salvo.")
  }

  // Logout
  function logout() {
    token.value = null
    userId.value = null
    isAuthenticated.value = false

    localStorage.removeItem('metflix_auth_token')
    console.log("Logout realizado.")
  }

  /**
   * Função usada pelo Vue Router.
   * Esta é a função da Opção 1 que você pediu.
   * Ela verifica o token direto no localStorage.
   */
  function checkAuth() {
    const saved = localStorage.getItem('metflix_auth_token')
    return !!saved
  }

  // Inicializa o estado na abertura do app
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('metflix_auth_token')

    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      userId.value = 'restored-user-id'
    }

    loading.value = false
    console.log(`Auth Store Inicializado. Autenticado: ${isAuthenticated.value}`)
  }

  initializeAuth()

  return {
    isAuthenticated,
    token,
    userId,
    loading,
    login,
    logout,
    checkAuth,
  }
})
