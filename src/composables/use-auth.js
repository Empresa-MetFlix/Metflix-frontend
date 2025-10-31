// Arquivo: /src/composables/use-auth.js

import { ref, readonly } from "vue"

// Usuários mockados persistentes (simulando um "banco de dados" global no cliente)
const mockUsers = ref([
  {
    email: "usuario@teste.com",
    password: "senha123",
    name: "Usuário Teste",
    avatar:
      "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png",
  },
  {
    email: "admin@metflix.com",
    password: "admin123",
    name: "Admin",
    avatar:
      "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png",
  },
])

// --- Estado Global da Autenticação ---
const user = ref(null)
const isAuthenticated = ref(false)

/**
 * Tenta carregar o usuário do localStorage ao inicializar.
 */
const loadUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("metflix_user")
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      } catch (e) {
        console.error("Erro ao parsear usuário do localStorage:", e)
        localStorage.removeItem("metflix_user")
      }
    }
  }
}

// Inicializa o estado
loadUserFromStorage()

/**
 * @description Hook composable/Store para gerenciar a autenticação.
 * É EXPORTADO COM O NOME CORRETO 'useAuth'.
 */
export function useAuth() {
  
  // Função de cadastro
  const register = async (name, email, password) => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar se email já existe
    const existingUser = mockUsers.value.find((u) => u.email === email)
    if (existingUser) {
      // Usamos throw new Error para que o try/catch no componente funcione
      throw new Error("Email já está em uso")
    }

    // Criar e adicionar novo usuário
    const newUser = {
      email,
      password,
      name,
      avatar:
        "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png",
    }

    mockUsers.value.push(newUser)

    return newUser
  }

  // Função de login
  const login = async (email, password) => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar credenciais
    const foundUser = mockUsers.value.find((u) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("Credenciais inválidas")
    }

    // Criar objeto de usuário sem a senha
    const loggedUser = {
      email: foundUser.email,
      name: foundUser.name,
      avatar: foundUser.avatar,
    }

    // Atualizar estado
    user.value = loggedUser
    isAuthenticated.value = true

    // Salvar no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("metflix_user", JSON.stringify(loggedUser))
    }

    return loggedUser
  }

  // Função de logout
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    if (typeof window !== "undefined") {
      localStorage.removeItem("metflix_user")
      localStorage.removeItem("metflix_profiles")
      localStorage.removeItem("metflix_active_profile")
    }
  }

  return {
    // Retorna o estado como somente leitura
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    login,
    register,
    logout,
  }
}