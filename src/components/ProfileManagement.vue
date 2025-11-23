<template>
  <div class="profile-management">
    <div class="profile-management-background">
      <div class="profile-management-overlay"></div>
    </div>

    <div class="profile-management-container">
      <header class="profile-management-header">
       
      </header>

      <main class="profile-management-content">
        <!-- Modo de gerenciamento -->
        <div v-if="managingProfiles" class="profile-management-mode">
          <h2 class="profile-title">Gerenciar perfis:</h2>
          <div class="profiles-grid">
            <div 
              v-for="profile in profiles" 
              :key="profile.id"
              class="profile-card profile-manage"
            >
              <div class="profile-avatar">
                <img :src="profile.avatar" :alt="profile.name" />
                <div class="profile-manage-overlay">
                  <Edit class="profile-manage-icon" @click="editProfile(profile)" />
                </div>
              </div>
              <span class="profile-name">{{ profile.name }}</span>
              <div class="profile-badges">
                <span v-if="profile.isMain" class="profile-main-badge">Principal</span>
                <span v-if="profile.isKids" class="profile-kids-badge">Infantil</span>
              </div>
              
              <button 
                v-if="!profile.isMain" 
                @click="deleteProfile(profile.id)" 
                class="profile-delete-button"
              >
                <Trash2 class="profile-delete-icon" />
                Excluir
              </button>
              
              <div v-else class="profile-spacer"></div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="exitManageMode" class="profile-done-btn">Concluído</button>
          </div>
        </div>

        <!-- Editar/Criar perfil -->
        <div v-else-if="editingProfile || creatingProfile" class="profile-edit">
          <h2 class="profile-title">{{ editingProfile ? 'Editar perfil' : 'Adicionar perfil' }}</h2>
          
          <div class="profile-edit-form">
            <div class="profile-edit-avatar-section">
              <div class="profile-edit-avatar">
                <img :src="profileForm.avatar" :alt="profileForm.name" />
                <button @click="showAvatarSelector = true" class="profile-change-avatar">
                  <Camera class="profile-camera-icon" />
                </button>
              </div>
            </div>
            
            <div class="profile-edit-fields">
              <div class="profile-field">
                <label for="profileName">Nome do perfil:</label>
                <input 
                  type="text" 
                  id="profileName"
                  v-model="profileForm.name"
                  class="profile-input"
                  maxlength="20"
                  placeholder="Digite o nome do perfil"
                />
              </div>
              
              <div class="profile-field">
                <label>Configurações:</label>
                <div class="profile-settings">
                  <label class="profile-checkbox">
                    <input type="checkbox" v-model="profileForm.isKids" />
                    <span class="profile-checkbox-text">Perfil infantil</span>
                  </label>
                  <label class="profile-checkbox">
                    <input type="checkbox" v-model="profileForm.autoplay" />
                    <span class="profile-checkbox-text">Reprodução automática</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="saveProfile" class="profile-save-btn" :disabled="!profileForm.name.trim()">Salvar</button>
            <button @click="cancelEdit" class="profile-cancel-btn">Cancelar</button>
            <button 
              v-if="editingProfile && !editingProfile.isMain" 
              @click="deleteProfile(editingProfile.id)" 
              class="profile-delete-btn"
            >
              Excluir perfil
            </button>
          </div>
        </div>

        <!-- Seleção de perfil -->
        <div v-else class="profile-selection">
          <h2 class="profile-title">Quem está assistindo?</h2>
          <div class="profiles-grid">
            <div 
              v-for="profile in profiles" 
              :key="profile.id"
              class="profile-card"
              :class="{ 'profile-selected': selectedProfile?.id === profile.id }"
              @click="selectProfile(profile)"
            >
              <div class="profile-avatar">
                <img :src="profile.avatar" :alt="profile.name" />
                <div class="profile-edit-overlay">
                  <Edit class="profile-edit-icon" @click.stop="editProfile(profile)" />
                </div>
                <div v-if="selectedProfile?.id === profile.id" class="profile-selected-indicator">
                  <Check class="profile-check-icon" />
                </div>
              </div>
              <span class="profile-name">{{ profile.name }}</span>
            </div>
            
            <!-- Botão corrigido para adicionar novo perfil -->
            <div class="profile-card profile-add" @click="createProfile">
              <div class="profile-avatar profile-avatar-add">
                <Plus class="profile-add-icon" />
              </div>
              <span class="profile-name">Adicionar perfil</span>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="manageProfiles" class="profile-manage-btn">Gerenciar perfis</button>
            <button 
              @click="confirmProfileSelection" 
              class="profile-done-btn"
              :disabled="!selectedProfile"
            >
              Concluído
            </button>
          </div>
        </div>

        <!-- Seletor de avatar -->
        <div v-if="showAvatarSelector" class="avatar-selector-overlay" @click="showAvatarSelector = false">
          <div class="avatar-selector" @click.stop>
            <h3>Escolha um avatar:</h3>
            <div class="avatar-grid">
              <div 
                v-for="avatar in availableAvatars" 
                :key="avatar.id"
                class="avatar-option"
                @click="selectAvatar(avatar.url)"
              >
                <img :src="avatar.url" :alt="avatar.name" />
              </div>
            </div>
            <button @click="showAvatarSelector = false" class="avatar-close-btn">Fechar</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Edit, Plus, Trash2, Camera, Check } from 'lucide-vue-next'

const emit = defineEmits(['back', 'profile-selected'])

const editingProfile = ref(null)
const creatingProfile = ref(false)
const managingProfiles = ref(false)
const showAvatarSelector = ref(false)
const selectedProfile = ref(null)
const profiles = ref([])

const loadProfiles = () => {
  if (typeof window !== "undefined") {
    const storedProfiles = localStorage.getItem("metflix_profiles")
    if (storedProfiles) {
      profiles.value = JSON.parse(storedProfiles)
    } else {
      profiles.value = [
        {
          id: 1,
          name: "Usuário Principal",
          avatar: "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png",
          isMain: true,
          isKids: false,
          autoplay: true
        },
        {
          id: 2,
          name: "Infantil",
          avatar: "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png",
          isMain: false,
          isKids: true,
          autoplay: false
        }
      ]
      saveProfiles()
    }
  }
}

const saveProfiles = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("metflix_profiles", JSON.stringify(profiles.value))
  }
}

const loadActiveProfile = () => {
  if (typeof window !== "undefined") {
    const storedActiveProfile = localStorage.getItem("metflix_active_profile")
    if (storedActiveProfile) {
      const activeProfile = JSON.parse(storedActiveProfile)
      const matchingProfile = profiles.value.find(p => p.id === activeProfile.id)
      selectedProfile.value = matchingProfile || profiles.value[0]
    } else {
      selectedProfile.value = profiles.value[0] || null
    }
  }
}

const saveActiveProfile = (profile) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("metflix_active_profile", JSON.stringify(profile))
  }
}

const profileForm = reactive({
  name: '',
  avatar: '',
  isKids: false,
  autoplay: true
})

const availableAvatars = ref([ { id: 1, name: 'Avatar 1', url: 'https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png' }, { id: 2, name: 'Avatar 2', url: 'https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png' }, { id: 3, name: 'Avatar 3', url: 'https://cdn.pixabay.com/photo/2024/01/15/11/36/batman-8510022_1280.png' }, { id: 4, name: 'Avatar 4', url: 'https://wallpaperaccess.com/full/8256467.jpg' }, { id: 5, name: 'Avatar 5', url: 'https://i.pinimg.com/originals/5f/11/c3/5f11c32009dc2b10b91b45a7df0498f4.jpg' }, { id: 6, name: 'Avatar 6', url: 'https://images8.alphacoders.com/511/thumb-1920-511954.jpg' } ])

const selectProfile = (profile) => {
  selectedProfile.value = profile
}

const confirmProfileSelection = () => {
  if (selectedProfile.value) {
    saveActiveProfile(selectedProfile.value)
    emit('profile-selected', selectedProfile.value)
    emit('back')
  }
}

const editProfile = (profile) => {
  editingProfile.value = profile
  profileForm.name = profile.name
  profileForm.avatar = profile.avatar
  profileForm.isKids = profile.isKids
  profileForm.autoplay = profile.autoplay
  managingProfiles.value = false
}

const createProfile = () => {
  creatingProfile.value = true
  profileForm.name = ''
  profileForm.avatar = availableAvatars.value[0].url
  profileForm.isKids = false
  profileForm.autoplay = true
  managingProfiles.value = false
}

const saveProfile = () => {
  if (!profileForm.name.trim()) return
  if (editingProfile.value) {
    const index = profiles.value.findIndex(p => p.id === editingProfile.value.id)
    if (index !== -1) {
      profiles.value[index] = { ...profiles.value[index], ...profileForm }
      if (selectedProfile.value?.id === editingProfile.value.id) saveActiveProfile(profiles.value[index])
    }
  } else {
    profiles.value.push({ id: Date.now(), name: profileForm.name, avatar: profileForm.avatar, isMain: false, ...profileForm })
  }
  saveProfiles()
  cancelEdit()
}

const deleteProfile = (profileId) => {
  if (confirm('Tem certeza que deseja excluir este perfil?')) {
    profiles.value = profiles.value.filter(p => p.id !== profileId)
    saveProfiles()
    if (selectedProfile.value?.id === profileId) selectedProfile.value = profiles.value[0] || null
    if (editingProfile.value?.id === profileId) cancelEdit()
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

const exitManageMode = () => {
  managingProfiles.value = false
  editingProfile.value = null
  creatingProfile.value = false
}

const selectAvatar = (avatarUrl) => {
  profileForm.avatar = avatarUrl
  showAvatarSelector.value = false
}

onMounted(() => {
  loadProfiles()
  loadActiveProfile()
})
</script>

<style scoped>
.profile-management {
  min-height: 100vh;
  position: relative;
  color: #fff;
  font-family: 'Roboto', sans-serif;
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

.profile-management-header {
  padding: 2rem 4%;
}

.profile-management-logo {
  color: #e50914;
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
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
  max-width: 800px;
  width: 100%;
}

.profile-title {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 3rem;
  color: #fff;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  justify-items: center;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
}

.profile-card:hover {
  transform: scale(1.05);
}

.profile-card.profile-selected {
  transform: scale(1.1);
}

.profile-avatar {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background-color: #333;
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
  z-index: 5; /* garante que o botão seja clicável */
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
  font-size: 1.2rem;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
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

.profile-edit-avatar-section {
  text-align: center;
}

.profile-edit-avatar {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto 1rem;
}

.profile-edit-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-change-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #e50914;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.avatar-selector {
  background: #222;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.avatar-selector h3 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-close-btn {
  width: 100%;
  padding: 0.75rem;
  background: #e50914;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
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
