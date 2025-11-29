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
import api from "@/api/services/api.js";

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

const loadProfilesFromBackend = async () => {
  try {
    const response = await api.get('profiles/')
    
    console.log('📋 Perfis carregados do backend:', response.data)
    
    profiles.value = response.data
    
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
  localStorage.setItem('metflix-active-profile', JSON.stringify(profile))
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
  managingProfiles.value = false
  profileForm.name = ""
  profileForm.avatar = availableAvatars.value[0].url
  profileForm.isKids = false
  profileForm.autoplay = true
}

// ✅ SALVAR PERFIL NO BACKEND
const saveProfile = async () => {
  if (!profileForm.name.trim()) return

  try {
    if (editingProfile.value) {
      // EDITAR PERFIL EXISTENTE
      const response = await api.put(`profiles/${editingProfile.value.id}/`, {
        name: profileForm.name,
        avatar: profileForm.avatar,
        is_kids: profileForm.isKids,
        autoplay: profileForm.autoplay
      })
      
      console.log('✅ Perfil atualizado:', response.data)
      
      // Atualizar na lista local
      const index = profiles.value.findIndex(p => p.id === editingProfile.value.id)
      profiles.value[index] = response.data
      
      // Se era o perfil ativo, atualizar localStorage
      const activeProfile = JSON.parse(localStorage.getItem('metflix-active-profile') || '{}')
      if (activeProfile.id === response.data.id) {
        localStorage.setItem('metflix-active-profile', JSON.stringify(response.data))
      }
      
      cancelEdit()
      managingProfiles.value = true
      
    } else {
      // CRIAR NOVO PERFIL
      const response = await api.post('profiles/', {
        name: profileForm.name,
        avatar: profileForm.avatar,
        is_kids: profileForm.isKids,
        autoplay: profileForm.autoplay
      })
      
      console.log('✅ Perfil criado:', response.data)
      
      profiles.value.push(response.data)
      
      // Se é o primeiro perfil, seleciona e vai pra home
      if (profiles.value.length === 1) {
        selectedProfile.value = response.data
        localStorage.setItem('metflix-active-profile', JSON.stringify(response.data))
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
    await api.delete(`profiles/${id}/`)
    
    console.log('✅ Perfil deletado')
    
    profiles.value = profiles.value.filter((p) => p.id !== id)
    
    // Se deletou o perfil ativo, selecionar outro
    const activeProfile = JSON.parse(localStorage.getItem('metflix-active-profile') || '{}')
    if (activeProfile.id === id) {
      if (profiles.value.length > 0) {
        selectedProfile.value = profiles.value[0]
        localStorage.setItem('metflix-active-profile', JSON.stringify(selectedProfile.value))
      } else {
        localStorage.removeItem('metflix-active-profile')
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
  const activeProfile = localStorage.getItem('metflix-active-profile')
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
  font-family: "Netflix Sans", "Helvetica Neue", Arial, sans-serif;
}

.profile-management-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%), 
              radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%);
  z-index: -1;
}

.profile-management-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.profile-management-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px; /* ✅ Espaço para a navbar */
}

.profile-management-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 4% 3rem; /* ✅ Mais padding-top */
}

.profile-selection,
.profile-management-mode,
.profile-edit {
  text-align: center;
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-title {
  font-size: 3.5rem;
  font-weight: 400;
  margin-bottom: 2.5rem; /* ✅ Espaçamento ajustado */
  color: #fff;
  letter-spacing: -0.5px;
}

.profiles-grid {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  max-width: 100%;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

.profile-card:hover {
  transform: scale(1.08);
}

.profile-avatar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background-color: #333;
  border: 4px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.profile-card:hover .profile-avatar {
  border-color: #e5e5e5;
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 3px dashed rgba(255, 255, 255, 0.3);
}

.profile-add-icon {
  width: 4rem;
  height: 4rem;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.profile-card:hover .profile-add-icon {
  color: rgba(255, 255, 255, 0.9);
  transform: rotate(90deg);
}

.profile-manage-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.profile-card:hover .profile-manage-overlay {
  opacity: 1;
}

.profile-manage-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #fff;
  background: rgba(229, 9, 20, 0.9);
  padding: 0.7rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.profile-card:hover .profile-manage-icon {
  transform: scale(1.1);
}

.profile-name {
  font-size: 1.3rem;
  color: #808080;
  transition: color 0.3s ease;
  font-weight: 400;
  letter-spacing: 0.03em;
}

.profile-card:hover .profile-name {
  color: #fff;
}

.profile-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.profile-manage-btn,
.profile-done-btn,
.profile-save-btn,
.profile-cancel-btn,
.profile-delete-btn {
  padding: 1rem 3rem;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 4px;
  min-width: 180px;
}

.profile-manage-btn:hover,
.profile-cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
  transform: translateY(-2px);
}

.profile-done-btn,
.profile-save-btn {
  background: #e50914;
  border-color: #e50914;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
}

.profile-done-btn:hover:not(:disabled),
.profile-save-btn:hover:not(:disabled) {
  background: #f40612;
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.5);
  transform: translateY(-2px);
}

.profile-done-btn:disabled,
.profile-save-btn:disabled {
  background: #555;
  border-color: #555;
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.profile-delete-btn {
  border-color: #e50914;
  color: #e50914;
}

.profile-delete-btn:hover {
  background: #e50914;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
}

/* SEÇÃO DE EDIÇÃO/CRIAÇÃO - MELHORADA */
.profile-edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2.5rem;
  background: rgba(20, 20, 20, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.profile-edit-avatar-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.profile-edit-avatar {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 4px solid #e50914;
  box-shadow: 0 12px 40px rgba(229, 9, 20, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
}

.profile-edit-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.profile-edit-avatar:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 16px 50px rgba(229, 9, 20, 0.6);
}

.profile-edit-avatar:hover img {
  transform: scale(1.1);
}

.profile-change-avatar {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
  border: 4px solid #000;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.profile-change-avatar:hover {
  background: linear-gradient(135deg, #f40612 0%, #e50914 100%);
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 6px 24px rgba(229, 9, 20, 0.6);
}

.profile-camera-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #fff;
}

.profile-edit-fields {
  width: 100%;
  max-width: 550px;
}

.profile-field {
  margin-bottom: 2rem;
  text-align: left;
}

.profile-field label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.05rem;
  color: #e5e5e5;
  letter-spacing: 0.5px;
}

.profile-input {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.profile-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.profile-input:focus {
  outline: none;
  border-color: #e50914;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
  transform: translateY(-1px);
}

/* ✅ CHECKBOXES MODERNOS - ESTILO CARTÃO */
.profile-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

.profile-checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.profile-checkbox::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.1), transparent);
  transition: left 0.5s ease;
}

.profile-checkbox:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
  border-color: rgba(229, 9, 20, 0.4);
  transform: translateX(5px);
  box-shadow: 0 4px 16px rgba(229, 9, 20, 0.2);
}

.profile-checkbox:hover::before {
  left: 100%;
}

.profile-checkbox-text {
  font-size: 1.05rem;
  color: #e5e5e5;
  font-weight: 500;
  letter-spacing: 0.3px;
  flex: 1;
  text-align: left;
}

/* ✅ CHECKBOX CUSTOMIZADO TIPO SWITCH */
.profile-checkbox input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 52px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.profile-checkbox input[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  top: 2px;
  left: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.profile-checkbox input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
  border-color: #e50914;
  box-shadow: 0 0 12px rgba(229, 9, 20, 0.5);
}

.profile-checkbox input[type="checkbox"]:checked::before {
  left: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.profile-checkbox input[type="checkbox"]:hover {
  background: rgba(255, 255, 255, 0.2);
}

.profile-checkbox input[type="checkbox"]:checked:hover {
  background: linear-gradient(135deg, #f40612 0%, #e50914 100%);
}

/* SELETOR DE AVATAR - MELHORADO */
.avatar-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(5px);
}

.avatar-selector {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border-radius: 16px;
  padding: 3rem;
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(229, 9, 20, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-selector h3 {
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 1px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 0.5rem;
}

.avatar-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;
}

.avatar-option::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(229, 9, 20, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.avatar-option:hover {
  transform: scale(1.12) rotate(3deg);
  border-color: #e50914;
  box-shadow: 0 12px 32px rgba(229, 9, 20, 0.5);
  z-index: 10;
}

.avatar-option:hover::after {
  opacity: 1;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.avatar-option:hover img {
  transform: scale(1.1);
}

.avatar-close-btn {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.avatar-close-btn:hover {
  background: linear-gradient(135deg, #f40612 0%, #e50914 100%);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(229, 9, 20, 0.6);
}

.avatar-selector::-webkit-scrollbar {
  width: 12px;
}

.avatar-selector::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin: 10px 0;
}

.avatar-selector::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #e50914 0%, #b20710 100%);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.avatar-selector::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #f40612 0%, #e50914 100%);
  background-clip: padding-box;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .profile-management-content {
    padding: 2rem 4% 2rem;
  }
  
  .profile-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  
  .profile-avatar {
    width: 140px;
    height: 140px;
  }
  
  .profile-edit-avatar {
    width: 160px;
    height: 160px;
  }
  
  .profile-edit-form {
    padding: 1.5rem;
  }
  
  .avatar-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 1rem;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .profile-manage-btn,
  .profile-done-btn,
  .profile-save-btn,
  .profile-cancel-btn,
  .profile-delete-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .profile-checkbox {
    padding: 1rem 1.25rem;
  }
  
  .profile-checkbox-text {
    font-size: 0.95rem;
  }
  
  .profile-checkbox input[type="checkbox"] {
    width: 48px;
    height: 26px;
  }
  
  .profile-checkbox input[type="checkbox"]::before {
    width: 18px;
    height: 18px;
  }
  
  .profile-checkbox input[type="checkbox"]:checked::before {
    left: 22px;
  }
}
</style>
