<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <h2>⚠️ Excluir Conta</h2>
        <button @click="closeModal" class="btn-close">
          <span>×</span>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <div class="warning-box">
          <p class="warning-title">Esta ação é permanente e não pode ser desfeita!</p>
          <p class="warning-text">
            Ao excluir sua conta, você perderá:
          </p>
          <ul class="warning-list">
            <li>🗑️ Todos os seus dados pessoais</li>
            <li>👤 Todos os perfis criados</li>
            <li>❤️ Sua lista completa de favoritos</li>
            <li>📊 Histórico de atividades</li>
            <li>⚙️ Configurações e preferências</li>
          </ul>
        </div>

        <!-- Mensagem de Erro -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Confirmação -->
        <form @submit.prevent="handleDelete" class="delete-form">
          <p class="confirm-text">
            Digite sua senha para confirmar a exclusão:
          </p>
          
          <div class="form-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Sua senha"
              class="form-input"
              :class="{ 'input-error': hasError }"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'OCULTAR' : 'MOSTRAR' }}
            </button>
          </div>

          <!-- Botões -->
          <div class="modal-actions">
            <button
              type="button"
              @click="closeModal"
              class="btn-cancel"
              :disabled="isLoading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-delete"
              :disabled="isLoading || !password"
            >
              {{ isLoading ? 'Excluindo...' : 'Excluir Conta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/services/api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'account-deleted'])

const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const hasError = ref(false)

const closeModal = () => {
  if (!isLoading.value) {
    password.value = ''
    errorMessage.value = ''
    hasError.value = false
    emit('close')
  }
}

const handleDelete = async () => {
  if (!password.value) {
    errorMessage.value = 'Digite sua senha para confirmar'
    hasError.value = true
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  hasError.value = false

  try {
    console.log('🗑️ Excluindo conta...')
    
    await api.delete('/users/delete-account/', {
      data: {
        password: password.value
      }
    })

    console.log('✅ Conta excluída com sucesso')
    
    // Limpar dados locais
    localStorage.removeItem('metflix_auth_token')
    localStorage.removeItem('metflix_refresh_token')
    localStorage.removeItem('metflix_active_profile')
    localStorage.removeItem('metflix_saved_email')
    
    emit('account-deleted')
    closeModal()

  } catch (error) {
    console.error('❌ Erro ao excluir conta:', error)
    
    if (error.response?.status === 401) {
      errorMessage.value = 'Senha incorreta. Tente novamente.'
    } else {
      errorMessage.value = 'Erro ao excluir conta. Tente novamente.'
    }
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.modal-container {
  background-color: #181818;
  border-radius: 8px;
  max-width: 550px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid #333;
}

.modal-header h2 {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 36px;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background-color: #333;
}

.modal-content {
  padding: 30px;
}

.warning-box {
  background: linear-gradient(135deg, #3a1515 0%, #2a1010 100%);
  border-left: 4px solid #e50914;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.warning-title {
  color: #ff4444;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.warning-text {
  color: #e5e5e5;
  font-size: 16px;
  margin: 0 0 12px 0;
}

.warning-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.warning-list li {
  color: #e5e5e5;
  font-size: 15px;
  margin: 10px 0;
  padding-left: 8px;
}

.error-message {
  background-color: #e87c03;
  color: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.delete-form {
  margin-top: 24px;
}

.confirm-text {
  color: #e5e5e5;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 500;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.form-input {
  width: 100%;
  padding: 14px 60px 14px 16px;
  background-color: #333;
  border: 2px solid #333;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #555;
}

.form-input.input-error {
  border-color: #e87c03;
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

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-delete {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #333;
  color: #fff;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #444;
}

.btn-delete {
  background-color: #e50914;
  color: #fff;
}

.btn-delete:hover:not(:disabled) {
  background-color: #f40612;
}

.btn-cancel:disabled,
.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
