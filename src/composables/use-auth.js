import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/services/api.js'

export const useAuth = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('metflix_auth_token'))
  const refreshToken = ref(localStorage.getItem('metflix_refresh_token'))
  const isAuthenticated = ref(!!token.value)

  // Configurar token padrão do axios
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Login
  const login = async (credentials) => {
    try {
      console.log('🔐 Tentando login com:', { email: credentials.email })
      
      // ✅ CORRETO: Enviar "email" (não "username")
      const response = await api.post('/token/', {
        email: credentials.email,  // ✅ Serializer customizado espera "email"
        password: credentials.password
      })

      console.log('✅ Login bem-sucedido:', response.data)

      if (response.data) {
        const { access, refresh, user: userData } = response.data

        // Salvar tokens
        token.value = access
        refreshToken.value = refresh
        user.value = userData
        isAuthenticated.value = true

        localStorage.setItem('metflix_auth_token', access)
        localStorage.setItem('metflix_refresh_token', refresh)

        // Configurar header Authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`

        return userData
      }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      console.error('Detalhes:', error.response?.data)
      
      // Mensagem de erro mais específica
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail)
      } else if (error.response) {
        const { status } = error.response
        
        if (status === 400 || status === 401) {
          throw new Error('Email ou senha incorretos.')
        }
      }
      
      throw new Error('Erro ao tentar fazer login. Verifique sua conexão.')
    }
  }

  // Register (Cadastro)
  const register = async (userData) => {
    try {
      console.log('📝 Tentando registrar:', { email: userData.email, name: userData.name })
      
      // ✅ CORRETO: Endpoint /register/
      const response = await api.post('/register/', {
        email: userData.email,
        password: userData.password,
        name: userData.name
      })

      console.log('✅ Usuário criado:', response.data)

      if (response.data) {
        // Após registrar, fazer login automaticamente
        return await login({
          email: userData.email,
          password: userData.password
        })
      }
    } catch (error) {
      console.error('❌ Erro no cadastro:', error)
      console.error('Detalhes:', error.response?.data)
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail)
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.')
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false

    localStorage.removeItem('metflix_auth_token')
    localStorage.removeItem('metflix_refresh_token')
    delete api.defaults.headers.common['Authorization']
  }

  // Refresh Token
  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/token/refresh/', {
        refresh: refreshToken.value
      })

      if (response.data?.access) {
        token.value = response.data.access
        localStorage.setItem('metflix_auth_token', response.data.access)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
        return response.data.access
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      logout()
      return null
    }
  }

  // Verificar autenticação
  const checkAuth = async () => {
    if (!token.value) {
      isAuthenticated.value = false
      return false
    }

    try {
      const response = await api.get('/users/me/')
      user.value = response.data
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      
      // Tentar renovar token
      if (refreshToken.value) {
        const newToken = await refreshAccessToken()
        if (newToken) return true
      }
      
      logout()
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    refreshAccessToken
  }
})
