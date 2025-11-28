<template>
  <div class="login-container">
    <!-- Background com imagem -->
    <div class="login-background"></div>

    <!-- Logo no topo -->
    <header class="login-header">
      <h1 class="logo">METFLIX</h1>
    </header>

    <!-- Card de Login -->
    <div class="login-card">
      <h2 class="login-title">Entrar</h2>

      <!-- Mensagem de Erro -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <input
            type="email"
            v-model="loginForm.email"
            placeholder="Email ou número de telefone"
            class="form-input"
            :class="{ 'input-error': errors.email }"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <!-- Senha -->
        <div class="form-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="loginForm.password"
            placeholder="Senha"
            class="form-input"
            :class="{ 'input-error': errors.password }"
            @blur="validatePassword"
          />
          <button
            type="button"
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'OCULTAR' : 'MOSTRAR' }}
          </button>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <!-- Botão Entrar -->
        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>

        <!-- Opções -->
        <div class="login-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span>Lembre-se de mim</span>
          </label>
          <a href="#" class="link-help">Precisa de ajuda?</a>
        </div>
      </form>

      <!-- Cadastro -->
      <div class="signup-section">
        <span class="signup-text">Novo por aqui?</span>
        <a href="#" class="signup-link">Assine agora.</a>
      </div>

      <!-- reCAPTCHA info -->
      <div class="recaptcha-info">
        Esta página é protegida pelo Google reCAPTCHA para
        garantir que você não é um robô.
        <a href="#" class="link-info">Saiba mais</a>.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../stores/use-auth.js'

// Estado do formulário
const loginForm = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Auth store
const authStore = useAuth()

// Emit para informar login bem-sucedido
const emit = defineEmits(['login-success'])

// Validações
const validateEmail = () => {
  if (!loginForm.value.email) {
    errors.value.email = 'Informe um email ou número de telefone válido.'
    return false
  }
  errors.value.email = ''
  return true
}

const validatePassword = () => {
  if (!loginForm.value.password) {
    errors.value.password = 'A senha deve ter entre 4 e 60 caracteres.'
    return false
  }
  if (loginForm.value.password.length < 4 || loginForm.value.password.length > 60) {
    errors.value.password = 'A senha deve ter entre 4 e 60 caracteres.'
    return false
  }
  errors.value.password = ''
  return true
}

const validateLogin = () => {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  return emailValid && passwordValid
}

// Login
const handleLogin = async () => {
  if (!validateLogin()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    // Salvar email se "Lembre-se de mim" estiver marcado
    if (rememberMe.value) {
      localStorage.setItem('metflix_saved_email', loginForm.value.email)
    } else {
      localStorage.removeItem('metflix_saved_email')
    }

    // Emitir evento de sucesso para metflix-app
    emit('login-success')

  } catch (error) {
    console.error('Erro no login:', error)
    errorMessage.value = 'Email ou senha incorretos. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

// Carregar email salvo ao montar
onMounted(() => {
  const savedEmail = localStorage.getItem('metflix_saved_email')
  if (savedEmail) {
    loginForm.value.email = savedEmail
    rememberMe.value = true
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)),
    url('https://images.unsplash.com/photo-1574267432644-f610dfb4e1f4?w=1920&q=80');
  background-size: cover;
  background-position: center;
  z-index: -1;
}


.login-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  z-index: 10;
}

.logo {
  color: #e50914;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.login-card {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: 60px 68px 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.login-title {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 28px;
}

.error-message {
  background-color: #e87c03;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: background-color 0.2s;
}

.form-input:focus {
  background-color: #454545;
}

.form-input.input-error {
  border-bottom: 2px solid #e87c03;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8c8c8c;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
}

.toggle-password:hover {
  color: #fff;
}

.error-text {
  color: #e87c03;
  font-size: 13px;
  margin-top: 6px;
  display: block;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background-color: #e50914;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 24px;
}

.btn-login:hover:not(:disabled) {
  background-color: #f40612;
}

.btn-login:disabled {
  background-color: #8c8c8c;
  cursor: not-allowed;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b3b3b3;
  font-size: 13px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.link-help {
  color: #b3b3b3;
  font-size: 13px;
  text-decoration: none;
}

.link-help:hover {
  text-decoration: underline;
}

.signup-section {
  margin-top: 16px;
  color: #737373;
  font-size: 16px;
}

.signup-text {
  margin-right: 5px;
}

.signup-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

.recaptcha-info {
  margin-top: 16px;
  color: #8c8c8c;
  font-size: 13px;
  line-height: 1.5;
}

.link-info {
  color: #0071eb;
  text-decoration: none;
}

.link-info:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-card {
    padding: 40px 30px;
    max-width: 100%;
    margin: 20px;
  }

  .login-title {
    font-size: 28px;
  }
}
</style>
