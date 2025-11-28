<template>
  <div class="signup-container">
    <!-- Background com imagem -->
    <div class="signup-background"></div>

    <!-- Logo no topo -->
    <header class="signup-header">
      <h1 class="logo">METFLIX</h1>
      <button @click="handleBackToLogin" class="btn-back">
        Entrar
      </button>
    </header>

    <!-- Card de Cadastro -->
    <div class="signup-card">
      <h2 class="signup-title">Criar Conta</h2>
      <p class="signup-subtitle">
        Preencha os dados abaixo para começar a assistir
      </p>

      <!-- Mensagem de Erro -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Mensagem de Sucesso -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleSignup" class="signup-form">
        <!-- Nome (opcional) -->
        <div class="form-group">
          <input
            type="text"
            v-model="signupForm.name"
            placeholder="Nome (opcional)"
            class="form-input"
          />
          <span class="input-hint">Será exibido no seu perfil</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <input
            type="email"
            v-model="signupForm.email"
            placeholder="Email"
            class="form-input"
            :class="{ 'input-error': errors.email }"
            @blur="validateEmail"
            required
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <!-- Senha -->
        <div class="form-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="signupForm.password"
            placeholder="Senha"
            class="form-input"
            :class="{ 'input-error': errors.password }"
            @blur="validatePassword"
            required
          />
          <button
            type="button"
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'OCULTAR' : 'MOSTRAR' }}
          </button>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          <span v-else class="input-hint">Mínimo de 4 caracteres</span>
        </div>

        <!-- Confirmar Senha -->
        <div class="form-group">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="signupForm.confirmPassword"
            placeholder="Confirmar Senha"
            class="form-input"
            :class="{ 'input-error': errors.confirmPassword }"
            @blur="validateConfirmPassword"
            required
          />
          <button
            type="button"
            class="toggle-password"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? 'OCULTAR' : 'MOSTRAR' }}
          </button>
          <span v-if="errors.confirmPassword" class="error-text">
            {{ errors.confirmPassword }}
          </span>
        </div>

        <!-- Termos de Uso -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="agreedToTerms"
              required
            />
            <span>
              Concordo com os 
              <a href="#" class="link-terms" @click.prevent>Termos de Uso</a> 
              e 
              <a href="#" class="link-terms" @click.prevent>Política de Privacidade</a>
            </span>
          </label>
        </div>

        <!-- Botão Cadastrar -->
        <button type="submit" class="btn-signup" :disabled="isLoading || !agreedToTerms">
          {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
        </button>
      </form>

      <!-- Login -->
      <div class="login-section">
        <span class="login-text">Já tem uma conta?</span>
        <a href="#" class="login-link" @click.prevent="handleBackToLogin">
          Faça login
        </a>
      </div>

      <!-- Benefícios -->
      <div class="benefits-section">
        <h3>Por que se cadastrar?</h3>
        <ul class="benefits-list">
          <li>✨ Acesso ilimitado a milhares de filmes e séries</li>
          <li>📱 Assista em qualquer dispositivo</li>
          <li>❤️ Crie sua lista personalizada de favoritos</li>
          <li>🔔 Receba recomendações personalizadas</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/services/api'

const signupForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Emit para informar eventos
const emit = defineEmits(['signup-success', 'back-to-login'])

// Validações
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!signupForm.value.email) {
    errors.value.email = 'Email é obrigatório.'
    return false
  }
  
  if (!emailRegex.test(signupForm.value.email)) {
    errors.value.email = 'Email inválido.'
    return false
  }
  
  errors.value.email = ''
  return true
}

const validatePassword = () => {
  if (!signupForm.value.password) {
    errors.value.password = 'Senha é obrigatória.'
    return false
  }
  
  if (signupForm.value.password.length < 4) {
    errors.value.password = 'Senha deve ter no mínimo 4 caracteres.'
    return false
  }
  
  if (signupForm.value.password.length > 60) {
    errors.value.password = 'Senha deve ter no máximo 60 caracteres.'
    return false
  }
  
  errors.value.password = ''
  
  // Revalidar confirmação se já foi preenchida
  if (signupForm.value.confirmPassword) {
    validateConfirmPassword()
  }
  
  return true
}

const validateConfirmPassword = () => {
  if (!signupForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirme sua senha.'
    return false
  }
  
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    errors.value.confirmPassword = 'As senhas não coincidem.'
    return false
  }
  
  errors.value.confirmPassword = ''
  return true
}

const validateSignup = () => {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  const confirmPasswordValid = validateConfirmPassword()
  
  return emailValid && passwordValid && confirmPasswordValid && agreedToTerms.value
}

// Cadastro
const handleSignup = async () => {
  if (!validateSignup()) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

try {
  console.log('📝 Criando conta...', signupForm.value.email)
  
  // ✅ CHAMADA PARA API DE REGISTRO - ROTA CORRETA
  const response = await api.post('/register/', {
    email: signupForm.value.email,
    password: signupForm.value.password,
    name: signupForm.value.name || null
  })

  console.log('✅ Conta criada com sucesso!', response.data)
  
  successMessage.value = 'Conta criada com sucesso! Redirecionando...'

    
    // Limpar formulário
    signupForm.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
    
    // Aguardar 2 segundos e redirecionar para login
    setTimeout(() => {
      emit('signup-success', response.data)
    }, 2000)

  } catch (error) {
    console.error('❌ Erro ao criar conta:', error)
    
    if (error.response?.status === 400) {
      if (error.response.data?.email) {
        errorMessage.value = 'Este email já está cadastrado.'
      } else {
        errorMessage.value = error.response.data?.message || 'Dados inválidos. Verifique os campos.'
      }
    } else {
      errorMessage.value = 'Erro ao criar conta. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}

// Voltar para login
const handleBackToLogin = () => {
  console.log('🔙 Voltando para login')
  emit('back-to-login')
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.signup-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)),
    url('https://images.unsplash.com/photo-1574267432644-f610dfb4e1f4?w=1920&q=80');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.signup-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.logo {
  color: #e50914;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.btn-back {
  padding: 8px 20px;
  background-color: #e50914;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-back:hover {
  background-color: #f40612;
}

.signup-card {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: 60px 68px 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  z-index: 1;
  margin-top: 80px;
}

.signup-title {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 8px;
}

.signup-subtitle {
  color: #b3b3b3;
  font-size: 16px;
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

.success-message {
  background-color: #46d369;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.signup-form {
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

.input-hint {
  color: #8c8c8c;
  font-size: 13px;
  margin-top: 6px;
  display: block;
}

.checkbox-group {
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #b3b3b3;
  font-size: 14px;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 3px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.link-terms {
  color: #fff;
  text-decoration: underline;
}

.link-terms:hover {
  color: #e50914;
}

.btn-signup {
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
  margin-top: 16px;
}

.btn-signup:hover:not(:disabled) {
  background-color: #f40612;
}

.btn-signup:disabled {
  background-color: #8c8c8c;
  cursor: not-allowed;
}

.login-section {
  margin-top: 16px;
  color: #737373;
  font-size: 16px;
  text-align: center;
}

.login-text {
  margin-right: 5px;
}

.login-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.login-link:hover {
  text-decoration: underline;
}

.benefits-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #333;
}

.benefits-section h3 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 500;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  color: #b3b3b3;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .signup-card {
    padding: 40px 30px;
    max-width: 100%;
    margin: 100px 20px 20px;
  }

  .signup-title {
    font-size: 28px;
  }

  .signup-header {
    padding: 15px 20px;
  }

  .logo {
    font-size: 2rem;
  }
}
</style>
