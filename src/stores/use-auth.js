import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/services/api'

export const useAuth = defineStore('auth', () => {
  const savedUser = localStorage.getItem('metflix-user')
  
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const token = ref(localStorage.getItem('metflix-auth-token'))
  const refreshToken = ref(localStorage.getItem('metflix-refresh-token'))
  const isAuthenticated = ref(!!token.value)
  
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (credentials) => {
    try {
      console.log('🔐 Tentando login com:', { email: credentials.email })
      
      const response = await api.post('/token/', {
        email: credentials.email,
        password: credentials.password
      })
      
      console.log('✅ Login bem-sucedido:', response.data)
      
      if (response.data) {
        const { access, refresh, user: userData } = response.data
        
        token.value = access
        refreshToken.value = refresh
        user.value = userData
        isAuthenticated.value = true
        
        localStorage.setItem('metflix-auth-token', access)
        localStorage.setItem('metflix-refresh-token', refresh)
        localStorage.setItem('metflix-user', JSON.stringify(userData))
        
        console.log('✅ Token salvo:', localStorage.getItem('metflix-auth-token') ? 'SIM' : 'NÃO')
        console.log('✅ User salvo:', localStorage.getItem('metflix-user') ? 'SIM' : 'NÃO')
        
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`
        
        return userData
      }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      console.error('Detalhes:', error.response?.data)
      
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

  // ✅ RENOMEADO: register -> signup (para compatibilidade)
  const signup = async (userData) => {
    try {
      console.log('🔐 Tentando registrar:', { email: userData.email, name: userData.name })
      
      const response = await api.post('/users/', {  // ✅ MUDEI /register/ para /users/
        email: userData.email,
        password: userData.password,
        name: userData.name
      })
      
      console.log('✅ Usuário criado:', response.data)
      
      // ✅ RETORNAR OS DADOS SEM FAZER LOGIN AUTOMÁTICO
      return response.data
    } catch (error) {
      console.error('❌ Erro no cadastro:', error)
      console.error('Detalhes:', error.response?.data)
      
      if (error.response?.data) {
        const errors = error.response.data
        if (errors.email) {
          throw new Error(errors.email[0])
        }
        if (errors.password) {
          throw new Error(errors.password[0])
        }
        throw new Error('Erro ao criar conta. Verifique os dados.')
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.')
    }
  }

  const logout = () => {
    console.log('🚪 Saindo da Metflix...')
    
    user.value = null
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    
    localStorage.clear()
    sessionStorage.clear()
    
    delete api.defaults.headers.common['Authorization']
    
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/token/refresh/', {
        refresh: refreshToken.value
      })
      
      if (response.data?.access) {
        token.value = response.data.access
        localStorage.setItem('metflix-auth-token', response.data.access)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
        return response.data.access
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      logout()
      return null
    }
  }

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
    signup,  // ✅ MUDEI DE register PARA signup
    logout,
    checkAuth,
    refreshAccessToken
  }
})
