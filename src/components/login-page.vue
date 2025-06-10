<template>
  <div class="login-page">
    <div class="login-background">
      <img 
        src="https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8999/a449fabb-05e4-4c8a-b062-b0bec7d03085/BR-pt-20240617-trifectadaily-perspective_alpha_website_large.jpg" 
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
import { ref, reactive } from 'vue'
import { useAuth } from '../composables/use-auth.js'

const emit = defineEmits(['login-success'])
const useAuthHook = useAuth()
const { login } = useAuthHook

const isLoginMode = ref(true)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  remember: true
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const clearError = (field) => {
  errors[field] = ''
}

const validateForm = () => {
  let isValid = true
  
  if (!isLoginMode.value && !form.name.trim()) {
    errors.name = 'Nome é obrigatório.'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'Informe um email ou número de telefone válido.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Informe um email válido.'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'A senha deve ter entre 4 e 60 caracteres.'
    isValid = false
  } else if (form.password.length < 4 || form.password.length > 60) {
    errors.password = 'A senha deve ter entre 4 e 60 caracteres.'
    isValid = false
  }
  
  if (!isLoginMode.value) {
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha.'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.'
      isValid = false
    }
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    if (isLoginMode.value) {
      await login(form.email, form.password)
      emit('login-success')
    } else {
      // Simular cadastro
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Após cadastro bem-sucedido, fazer login automaticamente
      await login(form.email, form.password)
      emit('login-success')
    }
  } catch (error) {
    if (isLoginMode.value) {
      errors.password = 'Email ou senha incorretos. Tente novamente.'
    } else {
      errors.email = 'Este email já está em uso. Tente outro.'
    }
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  // Limpar erros ao trocar de modo
  Object.keys(errors).forEach(key => errors[key] = '')
  // Limpar formulário
  Object.keys(form).forEach(key => {
    if (key !== 'remember') form[key] = ''
  })
}
</script>

<style scoped>
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

.has-error .login-input {
  border-bottom: 2px solid #e87c03;
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
