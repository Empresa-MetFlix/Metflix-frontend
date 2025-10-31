import { defineStore } from 'pinia';
import api from '../api/services/api'; // Importa a instância do Axios configurada


    export const useAuthStore = defineStore('auth', {
        // Estado inicial do Store
        state: () => ({
            token: localStorage.getItem('metflix_auth_token') || null,
            user: null, // Informações do usuário logado
            isAuthenticated: !!localStorage.getItem('metflix_auth_token'),
            loading: false,
            error: null,
        }),
        
        // Getters para fácil acesso ao estado
        getters: {
            isLoggedIn: (state) => state.isAuthenticated,
            authToken: (state) => state.token,
        },
        
        // Ações para modificar o estado e interagir com a API
        actions: {
            /**
             * Realiza o login enviando credenciais para o endpoint JWT.
             * @param {Object} credentials - Objeto com { email, password }
             */
            async login(credentials) {
                this.loading = true;
                this.error = null;
                try {
                    // O endpoint de login do Django Simple JWT é 'api/token/'
                    const response = await api.post('token/', credentials); 
                    
                    // Assumindo que o Simple JWT retorna 'access' (token)
                    const { access } = response.data; 
                    
                    // Armazena o token no estado e no localStorage
                    this.token = access;
                    this.isAuthenticated = true;
                    localStorage.setItem('metflix_auth_token', access);

                    // Opcional: Buscar dados do usuário após o login
                    // await this.fetchUser(); 
                    
                    return true;
                } catch (error) {
                    this.error = error.response?.data?.detail || 'Falha na autenticação. Verifique suas credenciais.';
                    this.token = null;
                    this.isAuthenticated = false;
                    localStorage.removeItem('metflix_auth_token');
                    return false;
                } finally {
                    this.loading = false;
                }
            },

            /**
             * Realiza o logout, limpando o estado e o localStorage.
             */
            logout() {
                this.token = null;
                this.user = null;
                this.isAuthenticated = false;
                localStorage.removeItem('metflix_auth_token');
            },

            /**
             * Busca as informações do usuário logado (requer um endpoint /me no backend).
             */
            async fetchUser() {
                if (!this.isAuthenticated) return;
                try {
                    // Endpoint de exemplo para obter dados do usuário logado
                    // Se o backend Metflix não tiver um endpoint 'usuarios/me/', você precisará criá-lo.
                    const response = await api.get('usuarios/me/'); 
                    this.user = response.data;
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    // Se o token for inválido (401), desloga o usuário
                    if (error.response.status === 401) {
                        this.logout();
                    }
                }
            },
        },
    });