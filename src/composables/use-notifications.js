import { ref, computed } from 'vue'
import api from '@/api/services/api'

const notifications = ref([])
const loading = ref(false)
const unreadCount = ref(0)

let notificationInterval = null

export function useNotifications() {
  
  // Carregar notificações
  const loadNotifications = async () => {
    try {
      loading.value = true
      const response = await api.get('/notifications/')
      notifications.value = response.data.results || response.data
      updateUnreadCount()
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      loading.value = false
    }
  }

  // Atualizar contagem de não lidas
  const updateUnreadCount = () => {
    unreadCount.value = notifications.value.filter(n => !n.read).length
  }

  // Buscar apenas contagem de não lidas (mais leve)
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread_count/')
      unreadCount.value = response.data.count
    } catch (error) {
      console.error('Erro ao buscar contagem:', error)
    }
  }

  // Marcar como lida
  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/mark_as_read/`)
      
      // Atualizar localmente
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        notification.read_at = new Date().toISOString()
      }
      
      updateUnreadCount()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark_all_as_read/')
      
      // Atualizar localmente
      notifications.value.forEach(n => {
        n.read = true
        n.read_at = new Date().toISOString()
      })
      
      unreadCount.value = 0
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  // Limpar todas
  const clearAll = async () => {
    try {
      await api.delete('/notifications/clear_all/')
      notifications.value = []
      unreadCount.value = 0
    } catch (error) {
      console.error('Erro ao limpar notificações:', error)
    }
  }

  // Criar notificação manual (teste)
  const createNotification = async (data) => {
    try {
      const response = await api.post('/notifications/', data)
      notifications.value.unshift(response.data)
      updateUnreadCount()
      return response.data
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
      throw error
    }
  }

  // Iniciar polling de notificações
  const startPolling = (intervalMs = 30000) => {
    // Carregar imediatamente
    fetchUnreadCount()
    
    // Depois a cada X segundos
    notificationInterval = setInterval(() => {
      fetchUnreadCount()
    }, intervalMs)
  }

  // Parar polling
  const stopPolling = () => {
    if (notificationInterval) {
      clearInterval(notificationInterval)
      notificationInterval = null
    }
  }

  // Formatar tempo relativo
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'agora mesmo'
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `há ${weeks} semana${weeks > 1 ? 's' : ''}`
    }
    const months = Math.floor(diffDays / 30)
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`
  }

  return {
    notifications,
    loading,
    unreadCount,
    loadNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    createNotification,
    startPolling,
    stopPolling,
    formatTimeAgo,
  }
}
