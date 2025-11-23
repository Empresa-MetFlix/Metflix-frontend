import { ref, readonly, computed } from "vue"
import axios from 'axios'

// --- Configuração da API ---
const API_BASE_URL = 'http://localhost:19003/api'
const REGISTER_URL = `${API_BASE_URL}/auth/register/`
const LOGIN_URL = `${API_BASE_URL}/token/`

// --- Estados globais ---
const user = ref(null)
const isAuthenticated = ref(false)
const profiles = ref([])
const activeProfileId = ref(null)

// --- Inicialização ---
const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("metflix_auth_token")
    const storedUser = localStorage.getItem("metflix_user")
    const storedProfiles = localStorage.getItem("metflix_profiles")
    const storedActiveProfile = localStorage.getItem("metflix_active_profile")

    // 🔥 garante que apenas quando houver token e user o login é válido
    if (storedToken && storedUser) {
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    } else {
      isAuthenticated.value = false
    }

    if (storedProfiles) profiles.value = JSON.parse(storedProfiles)
    if (storedActiveProfile) activeProfileId.value = JSON.parse(storedActiveProfile)
  }
}

loadFromStorage()

// --- RETORNA PERFIL ATIVO ---
const activeProfile = computed(() => {
  return profiles.value.find(p => p.id === activeProfileId.value) || null
})

export function useAuth() {

  // ------------------------------
  // REGISTRO
  // ------------------------------
  const register = async (name, email, password) => {
    try {
      const payload = { name, email, password }
      const response = await axios.post(REGISTER_URL, payload)
      return response.data
    } catch (error) {
      console.error("Erro no registro:", error)
      if (error.response) {
        const data = error.response.data
        const message = data.detail || data.error || data.email?.[0] || "Erro de validação."
        throw new Error(message)
      }
      throw new Error("Falha na conexão com o servidor.")
    }
  }


  // ------------------------------
  // LOGIN
  // ------------------------------
  const login = async (email, password) => {
    try {
      const payload = { email, password }
      const response = await axios.post(LOGIN_URL, payload)
      const { access: token } = response.data

      if (!token) throw new Error("Token ausente na resposta da API.")

      // MOCK dos perfis
      const tempUser = { email, name: email.split('@')[0] }
      const tempProfiles = [
        { id: 1, name: "Principal", avatar: "https://placehold.co/40x40/e50914/ffffff?text=P", isMain: true },
        { id: 2, name: "Kids", avatar: "https://placehold.co/40x40/e50914/ffffff?text=K", isKids: true }
      ]

      // Atualiza estado
      user.value = tempUser
      isAuthenticated.value = true
      profiles.value = tempProfiles
      activeProfileId.value = tempProfiles[0].id

      // Salva no localStorage
      localStorage.setItem("metflix_auth_token", token)
      localStorage.setItem("metflix_user", JSON.stringify(tempUser))
      localStorage.setItem("metflix_profiles", JSON.stringify(tempProfiles))
      localStorage.setItem("metflix_active_profile", JSON.stringify(activeProfileId.value))

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return tempUser
    } catch (error) {
      console.error("Erro no login:", error)
      if (error.response) {
        if (error.response.status === 401) throw new Error("Credenciais inválidas.")
        const message = error.response.data.detail || error.response.data.error || "Erro desconhecido."
        throw new Error(message)
      }
      throw new Error("Falha na conexão com o servidor.")
    }
  }


  // ------------------------------
  // LOGOUT
  // ------------------------------
 const logout = () => {
  // 1) Remover APENAS o token e user — deslogar corretamente
  localStorage.removeItem("metflix_auth_token")
  localStorage.removeItem("metflix_user")

  // 2) NÃO remover perfis e NÃO remover perfil ativo!
  //    Isso que estava quebrando tudo:
  // localStorage.removeItem("metflix_profiles")
  // localStorage.removeItem("metflix_active_profile")

  // 3) Atualizar estados globais
  user.value = null
  isAuthenticated.value = false

  // Perfis e activeProfileId continuam intactos!
  // profiles.value = []
  // activeProfileId.value = null

  delete axios.defaults.headers.common['Authorization']
}


  // ------------------------------
  // TROCA DE PERFIL
  // ------------------------------
  const setActiveProfile = (profileId) => {
    const exists = profiles.value.find(p => p.id === profileId)
    if (!exists) return
    activeProfileId.value = profileId
    localStorage.setItem("metflix_active_profile", JSON.stringify(profileId))
  }


  // ------------------------------
  // 🔥 FUNÇÃO QUE FALTAVA — checkAuth()
  // ------------------------------
  const checkAuth = () => {
    const token = localStorage.getItem("metflix_auth_token")
    const storedUser = localStorage.getItem("metflix_user")

    if (token && storedUser) {
      isAuthenticated.value = true
      return true
    }

    isAuthenticated.value = false
    return false
  }


  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    profiles: readonly(profiles),
    activeProfile,
    login,
    register,
    logout,
    setActiveProfile,

    // 🔥 ADICIONADO
    checkAuth
  }
}
