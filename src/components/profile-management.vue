<template>
  <div class="profile-management">
    <div class="profile-management-background">
      <div class="profile-management-overlay"></div>
    </div>

    <div class="profile-management-container">
      <main class="profile-management-content">
        <div v-if="managingProfiles" class="profile-management-mode">
          <h2 class="profile-title">Gerenciar perfis:</h2>

          <div class="profiles-grid">
            <div
              v-for="profile in profiles"
              :key="profile.id"
              class="profile-card profile-manage"
              role="button"
              tabindex="0"
              @click="editProfile(profile)"
              @keyup.enter="editProfile(profile)"
            >
              <div class="profile-avatar">
                <img :src="profile.avatar" :alt="profile.name" />

                <div class="profile-manage-overlay">
                  <Edit class="profile-manage-icon" />
                </div>
              </div>

              <span class="profile-name">{{ profile.name }}</span>
            </div>

            <div
              class="profile-card profile-add"
              role="button"
              tabindex="0"
              @click="createProfile"
              @keyup.enter="createProfile"
            >
              <div class="profile-avatar profile-avatar-add">
                <Plus class="profile-add-icon" />
              </div>
              <span class="profile-name">Adicionar perfil</span>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="exitManageMode" class="profile-done-btn">
              Concluído
            </button>
          </div>
        </div>

        <!-- EDITAR / CRIAR PERFIL -->
        <div v-else-if="editingProfile || creatingProfile" class="profile-edit">
          <h2 class="profile-title">
            {{ editingProfile ? "Editar perfil" : "Adicionar perfil" }}
          </h2>

          <div class="profile-edit-form">
            <div class="profile-edit-avatar-section">
              <div class="profile-edit-avatar">
                <img :src="profileForm.avatar" :alt="profileForm.name" />
                <button
                  @click="showAvatarSelector = true"
                  class="profile-change-avatar"
                >
                  <Camera class="profile-camera-icon" />
                </button>
              </div>
            </div>

            <div class="profile-edit-fields">
              <div class="profile-field">
                <label for="profileName">Nome do perfil:</label>
                <input
                  id="profileName"
                  type="text"
                  v-model="profileForm.name"
                  class="profile-input"
                  maxlength="20"
                  placeholder="Digite o nome do perfil"
                />
              </div>

              <div class="profile-field">
                <label>Configurações</label>
                <div class="profile-settings">
                  <label class="profile-checkbox">
                    <input type="checkbox" v-model="profileForm.isKids" />
                    <span class="profile-checkbox-text">Perfil infantil</span>
                  </label>

                  <label class="profile-checkbox">
                    <input type="checkbox" v-model="profileForm.autoplay" />
                    <span class="profile-checkbox-text"
                      >Reprodução automática</span
                    >
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button
              @click="saveProfile"
              class="profile-save-btn"
              :disabled="!profileForm.name.trim()"
            >
              Salvar
            </button>

            <button @click="cancelEdit" class="profile-cancel-btn">
              Cancelar
            </button>

            <button
              v-if="editingProfile"
              @click="deleteProfile(editingProfile.id)"
              class="profile-delete-btn"
            >
              Excluir perfil
            </button>
          </div>
        </div>

        <!-- SELEÇÃO DE PERFIL (Netflix Style) -->
        <div v-else class="profile-selection">
          <h2 class="profile-title">Quem está assistindo?</h2>

          <div class="profiles-grid">
            <!-- Perfis Existentes -->
            <div
              v-for="profile in profiles"
              :key="profile.id"
              class="profile-card"
              role="button"
              tabindex="0"
              @click="selectAndConfirm(profile)"
              @keyup.enter="selectAndConfirm(profile)"
            >
              <div class="profile-avatar">
                <img :src="profile.avatar" :alt="profile.name" />
              </div>

              <span class="profile-name">{{ profile.name }}</span>
            </div>

            <!-- + Adicionar Perfil -->
            <div
              class="profile-card profile-add"
              role="button"
              tabindex="0"
              @click="createProfile"
              @keyup.enter="createProfile"
            >
              <div class="profile-avatar profile-avatar-add">
                <Plus class="profile-add-icon" />
              </div>
              <span class="profile-name">Adicionar perfil</span>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="manageProfiles" class="profile-manage-btn">
              Gerenciar perfis
            </button>
          </div>
        </div>

        <!-- SELETOR DE AVATAR -->
        <div
          v-if="showAvatarSelector"
          class="avatar-selector-overlay"
          @click="showAvatarSelector = false"
        >
          <div class="avatar-selector" @click.stop>
            <h3>Escolha um avatar:</h3>

            <div class="avatar-grid">
              <div
                v-for="avatar in availableAvatars"
                :key="avatar.id"
                class="avatar-option"
                @click="selectAvatar(avatar.url)"
                tabindex="0"
                role="button"
                @keyup.enter="selectAvatar(avatar.url)"
              >
                <img :src="avatar.url" :alt="avatar.name" />
              </div>
            </div>

            <button
              class="avatar-close-btn"
              @click="showAvatarSelector = false"
            >
              Fechar
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Edit, Plus, Trash2, Camera } from "lucide-vue-next";

const emit = defineEmits(["profile-confirmed"]);

const editingProfile = ref(null);
const creatingProfile = ref(false);
const managingProfiles = ref(false);
const showAvatarSelector = ref(false);
const selectedProfile = ref(null);

const profiles = ref([]);

const profileForm = reactive({
  name: "",
  avatar: "",
  isKids: false,
  autoplay: true,
});

// ✅ BUSCAR PERFIS DO BACKEND
const loadProfilesFromBackend = async () => {
  try {
    const token = localStorage.getItem('metflix_auth_token')
    if (!token) {
      console.error('❌ Token não encontrado')
      profiles.value = []
      return
    }
    
    const response = await fetch('http://localhost:8000/api/profiles/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Erro ao buscar perfis')
    }
    
    const backendProfiles = await response.json()
    console.log('📋 Perfis carregados do backend:', backendProfiles)
    
    profiles.value = backendProfiles
    
    // Se não tem perfis, forçar criação do primeiro
    if (profiles.value.length === 0) {
      console.log('⚠️ Nenhum perfil encontrado, mostrando criação')
      creatingProfile.value = true
      profileForm.name = ""
      profileForm.avatar = availableAvatars.value[0].url
      profileForm.isKids = false
      profileForm.autoplay = true
    }
  } catch (error) {
    console.error('❌ Erro ao carregar perfis do backend:', error)
    profiles.value = []
  }
}

// ✅ CLICAR NO PERFIL JÁ SELECIONA E ENTRA (Netflix Style)
const selectAndConfirm = (profile) => {
  console.log('🎭 Perfil selecionado:', profile.name)
  selectedProfile.value = profile
  localStorage.setItem('metflix_active_profile', JSON.stringify(profile))
  emit("profile-confirmed", profile)
}

const editProfile = (profile) => {
  console.log('🎬 EDITANDO PERFIL:', profile.name)
  
  managingProfiles.value = false
  editingProfile.value = profile
  profileForm.name = profile.name
  profileForm.avatar = profile.avatar
  profileForm.isKids = profile.is_kids || false
  profileForm.autoplay = profile.autoplay !== undefined ? profile.autoplay : true
}

const createProfile = () => {
  creatingProfile.value = true
  managingProfiles.value = false // ✅ Sair do modo gerenciamento
  profileForm.name = ""
  profileForm.avatar = availableAvatars.value[0].url
  profileForm.isKids = false
  profileForm.autoplay = true
}

// ✅ SALVAR PERFIL NO BACKEND
const saveProfile = async () => {
  if (!profileForm.name.trim()) return

  try {
    const token = localStorage.getItem('metflix_auth_token')
    
    if (editingProfile.value) {
      // EDITAR PERFIL EXISTENTE
      const response = await fetch(`http://localhost:8000/api/profiles/${editingProfile.value.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileForm.name,
          avatar: profileForm.avatar,
          is_kids: profileForm.isKids,
          autoplay: profileForm.autoplay
        })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil')
      }
      
      const updatedProfile = await response.json()
      console.log('✅ Perfil atualizado:', updatedProfile)
      
      // Atualizar na lista local
      const index = profiles.value.findIndex(p => p.id === editingProfile.value.id)
      profiles.value[index] = updatedProfile
      
      // Se era o perfil ativo, atualizar localStorage
      const activeProfile = JSON.parse(localStorage.getItem('metflix_active_profile') || '{}')
      if (activeProfile.id === updatedProfile.id) {
        localStorage.setItem('metflix_active_profile', JSON.stringify(updatedProfile))
      }
      
      cancelEdit()
      managingProfiles.value = true
      
    } else {
      // CRIAR NOVO PERFIL
      const response = await fetch('http://localhost:8000/api/profiles/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileForm.name,
          avatar: profileForm.avatar,
          is_kids: profileForm.isKids,
          autoplay: profileForm.autoplay
        })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar perfil')
      }
      
      const newProfile = await response.json()
      console.log('✅ Perfil criado:', newProfile)
      
      profiles.value.push(newProfile)
      
      // Se é o primeiro perfil, seleciona e vai pra home
      if (profiles.value.length === 1) {
        selectedProfile.value = newProfile
        localStorage.setItem('metflix_active_profile', JSON.stringify(newProfile))
        cancelEdit()
        emit("profile-confirmed", selectedProfile.value)
        return
      }
      
      // Se não é o primeiro, volta para gerenciamento
      cancelEdit()
      managingProfiles.value = true
    }
  } catch (error) {
    console.error('❌ Erro ao salvar perfil:', error)
    alert('Erro ao salvar perfil. Tente novamente.')
  }
}

// ✅ DELETAR PERFIL DO BACKEND
const deleteProfile = async (id) => {
  if (profiles.value.length === 1) {
    return alert("Você precisa ter pelo menos um perfil.")
  }

  const target = profiles.value.find((p) => p.id === id)
  if (!confirm(`Tem certeza que deseja excluir o perfil "${target.name}"?`)) {
    return
  }

  try {
    const token = localStorage.getItem('metflix_auth_token')
    const response = await fetch(`http://localhost:8000/api/profiles/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Erro ao deletar perfil')
    }
    
    console.log('✅ Perfil deletado')
    
    profiles.value = profiles.value.filter((p) => p.id !== id)
    
    // Se deletou o perfil ativo, selecionar outro
    const activeProfile = JSON.parse(localStorage.getItem('metflix_active_profile') || '{}')
    if (activeProfile.id === id) {
      if (profiles.value.length > 0) {
        selectedProfile.value = profiles.value[0]
        localStorage.setItem('metflix_active_profile', JSON.stringify(selectedProfile.value))
      } else {
        localStorage.removeItem('metflix_active_profile')
      }
    }
    
    cancelEdit()
    managingProfiles.value = true
    
  } catch (error) {
    console.error('❌ Erro ao deletar perfil:', error)
    alert('Erro ao excluir perfil. Tente novamente.')
  }
}

const cancelEdit = () => {
  editingProfile.value = null
  creatingProfile.value = false
  
  // ✅ Não volta automaticamente pro gerenciamento se não estava lá
}

const manageProfiles = () => {
  managingProfiles.value = true
  editingProfile.value = null
  creatingProfile.value = false
}

// ✅ ATIVAR MODO GERENCIAMENTO (CHAMADO PELA NAVBAR)
const activateManageMode = () => {
  console.log('🔄 Ativando modo gerenciamento')
  managingProfiles.value = true
  editingProfile.value = null
  creatingProfile.value = false
}

// ✅ SAIR DO MODO GERENCIAR - Volta para home com perfil ativo
const exitManageMode = () => {
  managingProfiles.value = false
  editingProfile.value = null
  creatingProfile.value = false
  
  // ✅ Pegar perfil ativo e confirmar
  const activeProfile = localStorage.getItem('metflix_active_profile')
  if (activeProfile) {
    const profile = JSON.parse(activeProfile)
    console.log('📤 Saindo do gerenciamento, voltando para home com perfil:', profile.name)
    emit("profile-confirmed", profile)
  }
}

const availableAvatars = ref([
  { id: 1, name: 'Avatar 1', url: 'https://robohash.org/avatar1?set=set5&size=200x200' },
  { id: 2, name: 'Avatar 2', url: 'https://robohash.org/avatar2?set=set5&size=200x200' },
  { id: 3, name: 'Avatar 3', url: 'https://robohash.org/avatar3?set=set5&size=200x200' },
  { id: 4, name: 'Avatar 4', url: 'https://robohash.org/avatar4?set=set5&size=200x200' },
  { id: 5, name: 'Avatar 5', url: 'https://robohash.org/avatar5?set=set5&size=200x200' },
  { id: 6, name: 'Avatar 6', url: 'https://robohash.org/avatar6?set=set5&size=200x200' },
  { id: 7, name: 'Avatar 7', url: 'https://robohash.org/avatar7?set=set5&size=200x200' },
  { id: 8, name: 'Avatar 8', url: 'https://robohash.org/avatar8?set=set5&size=200x200' },
  { id: 9, name: 'Avatar 9', url: 'https://robohash.org/avatar9?set=set5&size=200x200' },
  { id: 10, name: 'Avatar 10', url: 'https://robohash.org/avatar10?set=set5&size=200x200' },
  { id: 11, name: 'Avatar 11', url: 'https://robohash.org/avatar11?set=set5&size=200x200' },
  { id: 12, name: 'Avatar 12', url: 'https://robohash.org/avatar12?set=set5&size=200x200' },
  { id: 13, name: 'Avatar 13', url: 'https://robohash.org/avatar13?set=set5&size=200x200' },
  { id: 14, name: 'Avatar 14', url: 'https://robohash.org/avatar14?set=set5&size=200x200' },
  { id: 15, name: 'Avatar 15', url: 'https://robohash.org/avatar15?set=set5&size=200x200' },
  { id: 16, name: 'Avatar 16', url: 'https://robohash.org/avatar16?set=set5&size=200x200' },
  { id: 17, name: 'Avatar 17', url: 'https://robohash.org/avatar17?set=set5&size=200x200' },
  { id: 18, name: 'Avatar 18', url: 'https://robohash.org/avatar18?set=set5&size=200x200' },
  { id: 19, name: 'Avatar 19', url: 'https://robohash.org/avatar19?set=set5&size=200x200' },
  { id: 20, name: 'Avatar 20', url: 'https://robohash.org/avatar20?set=set5&size=200x200' }
])

const selectAvatar = (url) => {
  profileForm.avatar = url
  showAvatarSelector.value = false
}

onMounted(async () => {
  console.log('🎭 ProfileManagement montado')
  await loadProfilesFromBackend()
})

// ✅ EXPOR FUNÇÃO PARA O PAI CHAMAR
defineExpose({
  activateManageMode
})
</script>
<style scoped>
.profile-management {
  min-height: 100vh;
  position: relative;
  color: #fff;
  font-family: "Roboto", sans-serif;
}

.profile-management-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #141414 0%, #000 100%);
  z-index: -1;
}

.profile-management-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.profile-management-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.profile-management-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 4%;
}

.profile-selection,
.profile-management-mode,
.profile-edit {
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

.profile-title {
  font-size: 3.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: #fff;
}

.profiles-grid {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  max-width: 100%;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
  flex-shrink: 0;
}

.profile-card:hover {
  transform: scale(1.05);
}

.profile-card.profile-selected {
  transform: scale(1.1);
}

.profile-manage {
  cursor: pointer !important;
}

.profile-manage .profile-avatar {
  cursor: pointer !important;
}

.profile-avatar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.8rem;
  background-color: #333;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.profile-card:hover .profile-avatar {
  border-color: #fff;
}

.profile-card.profile-selected .profile-avatar {
  border: 3px solid #e50914;
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-add {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  border: 2px dashed #666;
}

.profile-add-icon {
  width: 3rem;
  height: 3rem;
  color: #666;
}

.profile-edit-overlay,
.profile-manage-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-card:hover .profile-edit-overlay,
.profile-card:hover .profile-manage-overlay {
  opacity: 1;
}

.profile-selected-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e50914;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.profile-check-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

.profile-edit-icon,
.profile-manage-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
}

.profile-name {
  font-size: 1.4rem;
  color: #808080;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.profile-card:hover .profile-name {
  color: #fff;
}

.profile-card.profile-selected .profile-name {
  color: #e50914;
  font-weight: 600;
}

.profile-main-badge {
  font-size: 0.8rem;
  color: #e50914;
  background: rgba(229, 9, 20, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.profile-card-delete-btn {
  margin-top: 0.5rem;
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #e50914;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.profile-card-delete-btn:hover {
  background: #e50914;
  color: #fff;
}

.profile-card-delete-icon {
  width: 1rem;
  height: 1rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.profile-manage-btn,
.profile-done-btn,
.profile-save-btn,
.profile-cancel-btn,
.profile-delete-btn {
  padding: 0.75rem 2rem;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.profile-done-btn,
.profile-save-btn {
  background: #e50914;
  border-color: #e50914;
}

.profile-done-btn:disabled,
.profile-save-btn:disabled {
  background: #666;
  border-color: #666;
  cursor: not-allowed;
  opacity: 0.5;
}

.profile-delete-btn {
  border-color: #e50914;
  color: #e50914;
}

.profile-manage-btn:hover,
.profile-cancel-btn:hover {
  background: #fff;
  color: #000;
}

.profile-done-btn:hover:not(:disabled),
.profile-save-btn:hover:not(:disabled) {
  background: #f40612;
}

.profile-delete-btn:hover {
  background: #e50914;
  color: #fff;
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.profile-edit-avatar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto 1.5rem;
  border: 3px solid #e50914;
  box-shadow: 0 8px 25px rgba(229, 9, 20, 0.3);
  transition: all 0.3s ease;
  background-color: transparent;
}

.profile-edit-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile-edit-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(229, 9, 20, 0.5);
}

.profile-change-avatar {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #e50914;
  border: 3px solid #141414;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.profile-change-avatar:hover {
  background: #f40612;
  transform: scale(1.1);
}

.profile-camera-icon {
  width: 1rem;
  height: 1rem;
  color: #fff;
}

.profile-edit-fields {
  width: 100%;
  max-width: 400px;
}

.profile-field {
  margin-bottom: 1.5rem;
  text-align: left;
}

.profile-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.profile-input {
  width: 100%;
  padding: 0.75rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
}

.profile-input:focus {
  outline: none;
  border-color: #e50914;
}

.profile-settings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.profile-checkbox input {
  width: 1rem;
  height: 1rem;
}

.avatar-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.avatar-selector {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 750px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(229, 9, 20, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);
}

.avatar-selector h3 {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.5px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
}

.avatar-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  position: relative;
}

.avatar-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(229, 9, 20, 0);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.avatar-option:hover {
  transform: scale(1.15);
  border-color: #e50914;
  box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4);
  z-index: 10;
}

.avatar-option:hover::before {
  background: rgba(229, 9, 20, 0.2);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-close-btn {
  width: 100%;
  padding: 1rem;
  background: #e50914;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.avatar-close-btn:hover {
  background: #f40612;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.avatar-selector::-webkit-scrollbar {
  width: 10px;
}

.avatar-selector::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.avatar-selector::-webkit-scrollbar-thumb {
  background: #e50914;
  border-radius: 10px;
}

.avatar-selector::-webkit-scrollbar-thumb:hover {
  background: #f40612;
}

.profile-badges {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  min-height: 40px;
  align-items: center;
}

.profile-main-badge,
.profile-kids-badge {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.profile-main-badge {
  color: #e50914;
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
}

.profile-kids-badge {
  color: #46d369;
  background: rgba(70, 211, 105, 0.2);
  border: 1px solid #46d369;
}

.profile-manage .profile-card {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.profile-spacer {
  height: 44px;
}

.profile-delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(229, 9, 20, 0.1);
  border: 2px solid #e50914;
  color: #e50914;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 120px;
  margin-top: 0.5rem;
}

.profile-delete-button:hover {
  background: #e50914;
  color: #fff;
  transform: translateY(-1px);
}

.profile-delete-icon {
  width: 0.9rem;
  height: 0.9rem;
}
</style>
