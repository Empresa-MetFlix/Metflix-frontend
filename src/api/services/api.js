    import axios from 'axios';

    // A URL base da API é lida da variável de ambiente VITE_API_BASE_URL
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    if (!API_BASE_URL) {
        console.error("VITE_API_BASE_URL não está definida. Verifique seu arquivo .env.");
    }

    const api = axios.create({
        baseURL:   "https://metflix-backend.onrender.com/api",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Interceptor para adicionar o token de autenticação (Bearer Token)
    // O token é obtido do localStorage, onde o Pinia Store irá armazená-lo.
    api.interceptors.request.use(config => {
        const token = localStorage.getItem('metflix_auth_token'); 
        if (token) {
            // O backend Django REST Framework espera o formato "Bearer <token>"
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    export default api;