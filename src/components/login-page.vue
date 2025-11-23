
<template>
  <div class="login-page">
    <div class="login-background">
      <img 
        src="https://reactflix-sigma-peach.vercel.app/assets/bannerNetflix.ae2c1792.jpg" 
        alt="Background" 
        class="login-background-image"
      />
      <div class="login-background-overlay"></div>
    </div>

    <header class="login-header">
      <h1 class="login-logo">METFLIX</h1>
    </header>

    <main class="login-container">
      <div class="login-form-container">
        <h2 class="login-title">{{ isLoginMode ? 'Entrar' : 'Criar Conta' }}</h2>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <div v-if="!isLoginMode" class="login-form-group" :class="{ 'has-error': errors.name }">
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="login-input"
              required
              @focus="clearError('name')"
            />
            <label for="name" class="login-label">Nome completo</label>
            <div v-if="errors.name" class="login-error">{{ errors.name }}</div>
          </div>

          <div class="login-form-group" :class="{ 'has-error': errors.email }">
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              class="login-input"
              required
              @focus="clearError('email')"
            />
            <label for="email" class="login-label">Email ou número de telefone</label>
            <div v-if="errors.email" class="login-error">{{ errors.email }}</div>
          </div>
          
          <div class="login-form-group" :class="{ 'has-error': errors.password }">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="form.password" 
              class="login-input"
              required
              @focus="clearError('password')"
            />
            <label for="password" class="login-label">Senha</label>
            <button 
              type="button" 
              class="login-password-toggle" 
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? 'OCULTAR' : 'MOSTRAR' }}
            </button>
            <div v-if="errors.password" class="login-error">{{ errors.password }}</div>
          </div>

          <div v-if="!isLoginMode" class="login-form-group" :class="{ 'has-error': errors.confirmPassword }">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="form.confirmPassword" 
              class="login-input"
              required
              @focus="clearError('confirmPassword')"
            />
            <label for="confirmPassword" class="login-label">Confirmar senha</label>
            <button 
              type="button" 
              class="login-password-toggle" 
              @click="toggleConfirmPasswordVisibility"
            >
              {{ showConfirmPassword ? 'OCULTAR' : 'MOSTRAR' }}
            </button>
            <div v-if="errors.confirmPassword" class="login-error">{{ errors.confirmPassword }}</div>
          </div>
          
          <div v-if="errors.general" class="login-error general-error">
            {{ errors.general }}
          </div>
          
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? (isLoginMode ? 'Entrando...' : 'Criando conta...') : (isLoginMode ? 'Entrar' : 'Criar Conta') }}
          </button>
          
          <div class="login-options">
            <div class="login-remember">
              <input type="checkbox" id="remember" v-model="form.remember" />
              <label for="remember">Lembre-se de mim</label>
            </div>
            <a href="#" class="login-help">Precisa de ajuda?</a>
          </div>
        </form>
        
        <div class="login-signup">
          <p>
            {{ isLoginMode ? 'Novo por aqui?' : 'Já tem uma conta?' }}
            <a href="#" @click.prevent="toggleMode" class="login-signup-link">
              {{ isLoginMode ? 'Assine agora' : 'Faça login' }}
            </a>.
          </p>
        </div>
        
        <div class="login-captcha">
          <p>Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô.</p>
        </div>
      </div>
    </main>

    <footer class="login-footer">
      <div class="login-footer-content">
        <p>Dúvidas? Ligue 0800-761-4631</p>
        <div class="login-footer-links">
          <a href="#">Perguntas frequentes</a>
          <a href="#">Central de Ajuda</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Privacidade</a>
          <a href="#">Preferências de cookies</a>
          <a href="#">Informações corporativas</a>
        </div>
        <div class="login-footer-language">
          <select class="login-language-selector">
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/use-auth' // seu composable atual

// --- reactive ---
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  remember: false,
})

const isLoginMode = ref(true)
const isLoading = ref(false)
const errors = ref({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const store = useAuth()
const router = useRouter()

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
    if (errors.value.general) delete errors.value.general
  }
}

const togglePasswordVisibility = () => (showPassword.value = !showPassword.value)
const toggleConfirmPasswordVisibility = () => (showConfirmPassword.value = !showConfirmPassword.value)
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errors.value = {}
  form.value.password = ''
  form.value.confirmPassword = ''
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!isLoginMode.value) {
    if (!form.value.name || form.value.name.length < 3) {
      errors.value.name = 'Nome completo é obrigatório e deve ter no mínimo 3 caracteres.'
      isValid = false
    }
    if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = 'As senhas não coincidem.'
      isValid = false
    }
  }

  if (!form.value.email || !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Insira um email válido.'
    isValid = false
  }

  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = 'A senha deve ter no mínimo 6 caracteres.'
    isValid = false
  }

  return isValid
}

// --- LOGIN ---
const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errors.value.general = null

  try {
    await store.login(form.value.email, form.value.password)

    if (form.value.remember) {
      localStorage.setItem('metflix_remember', 'true')
    } else {
      localStorage.removeItem('metflix_remember')
    }

    // 🔥 AGORA LOGIN → HOME DIRETO
    await router.push("/")

  } catch (error) {
    errors.value.general = error.message || 'Erro de autenticação. Tente novamente.'
    console.error('Login falhou:', error)
  } finally {
    isLoading.value = false
  }
}

// --- SIGNUP ---
const handleSignup = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errors.value.general = null

  try {
    await store.register(form.value.name, form.value.email, form.value.password)
    // após criar conta, alterna para modo login para permitir o login imediatamente
    isLoginMode.value = true
    form.value.password = ''
    form.value.confirmPassword = ''
  } catch (error) {
    errors.value.email = error.message || 'Erro ao criar conta.'
    console.error('Registro falhou:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = () => {
  if (isLoginMode.value) handleLogin()
  else handleSignup()
}
</script>

    
<style scoped>
/* O CSS é mantido inalterado */
.login-page {
  min-height: 100vh;
  position: relative;
  color: #fff;
  font-family: 'Roboto', sans-serif;
}

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.login-background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.login-header {
  padding: 1.5rem 3%;
}

.login-logo {
  color: #e50914;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.login-container {
  display: flex;
  justify-content: center;
  padding: 0 5%;
  margin-top: 2rem;
}

.login-form-container {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form-group {
  position: relative;
  margin-bottom: 1rem;
}

.login-input {
  width: 100%;
  background-color: rgba(51, 51, 51, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  padding: 1rem 1rem;
  font-size: 1rem;
  height: 3.5rem;
  outline: none;
  transition: all 0.3s ease;
}

.login-input:focus {
  border-color: #e50914;
  background-color: rgba(51, 51, 51, 0.9);
  box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.login-input:focus + .login-label,
.login-input:not(:placeholder-shown) + .login-label {
  transform: translateY(-0.75rem) scale(0.8);
  color: #8c8c8c;
}

.login-label {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #8c8c8c;
  transition: all 0.2s ease;
  pointer-events: none;
}

.login-password-toggle {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8c8c8c;
  font-size: 0.8rem;
  cursor: pointer;
}

.login-button {
  background: linear-gradient(135deg, #e50914 0%, #f40612 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  color: #b3b3b3;
  font-size: 0.9rem;
}

.login-remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-help {
  color: #b3b3b3;
  text-decoration: none;
}

.login-help:hover {
  text-decoration: underline;
}

.login-signup {
  margin-top: 4rem;
  color: #737373;
}

.login-signup-link {
  color: #e50914;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-signup-link:hover {
  color: #f40612;
  text-decoration: underline;
}

.login-captcha {
  margin-top: 1rem;
  color: #8c8c8c;
  font-size: 0.8rem;
}

.login-error {
  color: #e87c03;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.general-error {
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
}

.has-error .login-input {
  border: 1px solid #e87c03;
  box-shadow: 0 0 0 1px #e87c03;
}

.login-footer {
  background-color: rgba(0, 0, 0, 0.75);
  padding: 2rem 0;
  margin-top: 5rem;
}

.login-footer-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 5%;
  color: #737373;
}

.login-footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

@media (min-width: 768px) {
  .login-footer-links {
    grid-template-columns: repeat(3, 1fr);
  }
}

.login-footer-links a {
  color: #737373;
  text-decoration: none;
  font-size: 0.8rem;
}

.login-footer-links a:hover {
  text-decoration: underline;
}

.login-language-selector {
  background-color: #000;
  color: #737373;
  border: 1px solid #737373;
  padding: 0.5rem;
  border-radius: 2px;
}
</style>