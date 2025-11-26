import { ref, readonly } from "vue"
import axios from 'axios'

// ✅ USAR A VARIÁVEL DE AMBIENTE
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const REGISTER_URL = `${API_BASE_URL}/auth/register/`
const LOGIN_URL = `${API_BASE_URL}/token/`     

// --- Estado Global da Autenticação ---
const user = ref(null) 
const isAuthenticated = ref(false)

/**
 * Tenta carregar o token ou usuário do localStorage ao inicializar.
 */
const loadUserFromStorage = () => {
    if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("metflix_auth_token")
        const storedUser = localStorage.getItem("metflix_user")

        if (storedToken && storedUser) {
            // Se houver um token, assume que o usuário está logado
            user.value = JSON.parse(storedUser)
            isAuthenticated.value = true
            // Configura o token no axios para futuras requisições autenticadas
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        }
    }
}

// Inicializa o estado
loadUserFromStorage()

/**
 * @description Hook composable/Store para gerenciar a autenticação via API real.
 */
export function useAuth() {
  
  // Função de cadastro (chama a API real)
  const register = async (name, email, password) => {
    try {
        const payload = { name, email, password }
        const response = await axios.post(REGISTER_URL, payload)
        
        // O servidor deve retornar os dados do novo usuário criado
        return response.data;
        
    } catch (error) {
        console.error("Erro na comunicação com a API de registro:", error)
        
        if (error.response) {
            const errorData = error.response.data
            // Prioriza mensagens de erro detalhadas do servidor
            const message = errorData.detail || errorData.error || errorData.email?.[0] || "Erro de validação ou no servidor."
            throw new Error(message)
        }
        
        throw new Error("Falha na conexão com o servidor.")
    }
  }

  // Função de login (chama a API real - rota JWT)
  const login = async (email, password) => {
    try {
        // A rota /api/token/ espera 'username' e 'password', 
        // mas como seu USERNAME_FIELD é 'email', você deve enviar 'email' e 'password'
        // Depende de como a sua implementação JWT está configurada! 
        // Se ela espera 'username', ajuste aqui. Se espera 'email', está correto.
        const payload = { email, password } 
        
        const response = await axios.post(LOGIN_URL, payload)

        // Assumindo que o back-end JWT retorna: { refresh: '...', access: '...' }
        const { access: token } = response.data 

        if (!token) {
            throw new Error("Resposta da API incompleta (token ausente).")
        }
        
        // **IMPORTANTE**: Após obter o token, você deve fazer uma requisição separada para 
        // obter os dados do usuário autenticado (geralmente para /api/usuarios/me).
        // Por simplificação, vamos mockar o usuário para testar o fluxo de autenticação, 
        // mas em produção, você faria um GET para o endpoint de perfil.

        const tempUser = { email, name: email.split('@')[0] } // Mock simples

        // 1. Atualizar estado local
        user.value = tempUser
        isAuthenticated.value = true

        // 2. Salvar token e usuário no LocalStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("metflix_auth_token", token)
            localStorage.setItem("metflix_user", JSON.stringify(tempUser))
        }
        
        // 3. Configurar axios para requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return tempUser

    } catch (error) {
        console.error("Erro na comunicação com a API de login:", error)
        
        if (error.response && error.response.status === 401) {
             throw new Error("Credenciais inválidas.")
        }
        if (error.response) {
            const errorData = error.response.data
            const message = errorData.detail || errorData.error || "Erro desconhecido ao logar."
            throw new Error(message)
        }
        
        throw new Error("Falha na conexão com o servidor.")
    }
  }

  // Função de logout
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    
    // Remover token do LocalStorage e do axios
    if (typeof window !== "undefined") {
        localStorage.removeItem("metflix_auth_token")
        localStorage.removeItem("metflix_user")
    }
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    login,
    register,
    logout,
  }
}
