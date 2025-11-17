import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// Exemplo de URL de API (assumindo que VITE_API_BASE_URL está em .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:19003/api';

const MOCK_CATEGORIES = [
    {
        title: "Em Alta",
        endpoint: "/movies/trending",
        movies: [
            { id: 1, title: 'Round 6', image: 'https://placehold.co/200x300/e50914/ffffff?text=Round+6' },
            { id: 2, title: 'The Witcher', image: 'https://placehold.co/200x300/e50914/ffffff?text=Witcher' },
            { id: 3, title: 'Lupin', image: 'https://placehold.co/200x300/e50914/ffffff?text=Lupin' },
            { id: 4, title: 'Arcane', image: 'https://placehold.co/200x300/e50914/ffffff?text=Arcane' },
            { id: 5, title: 'Ozark', image: 'https://placehold.co/200x300/e50914/ffffff?text=Ozark' },
            { id: 6, title: 'Dark', image: 'https://placehold.co/200x300/e50914/ffffff?text=Dark' },
            { id: 7, title: 'Stranger Things', image: 'https://placehold.co/200x300/e50914/ffffff?text=Stranger+T.' },
            { id: 8, title: 'Peaky Blinders', image: 'https://placehold.co/200x300/e50914/ffffff?text=Peaky+B.' },
        ],
    },
    {
        title: "Ação e Aventura",
        endpoint: "/movies/action",
        movies: [
            { id: 9, title: 'The Last Kingdom', image: 'https://placehold.co/200x300/141414/e50914?text=Last+Kingdom' },
            { id: 10, title: 'Vikings', image: 'https://placehold.co/200x300/141414/e50914?text=Vikings' },
            { id: 11, title: 'Exército de Ladrões', image: 'https://placehold.co/200x300/141414/e50914?text=Ladrões' },
            { id: 12, title: 'Missão Impossível', image: 'https://placehold.co/200x300/141414/e50914?text=Missão+I.' },
        ],
    },
];

const MOCK_FEATURED_MOVIE = {
    title: 'Stranger Things',
    description: 'Quando um garoto desaparece, a cidade mergulha em um mistério envolvendo experimentos secretos, forças sobrenaturais aterrorizantes e uma garota estranha.',
    backgroundImage: 'https://reactflix-sigma-peach.vercel.app/assets/bannerNetflix.ae2c1792.jpg',
    id: 7,
};

export const useMovies = defineStore('movies', () => {
    // Estado
    const categories = ref([]);
    const featuredMovie = ref(null);
    const loading = ref(true);
    const error = ref(null);

    // Ações
    const fetchMovies = async () => {
        loading.value = true;
        error.value = null;

        try {
            // Em um projeto real, você faria chamadas de API aqui:
            // const response = await axios.get(`${API_BASE_URL}/catalog`);
            // categories.value = response.data.categories;
            // featuredMovie.value = response.data.featured;
            
            // Usando dados mockados para desenvolvimento:
            categories.value = MOCK_CATEGORIES;
            featuredMovie.value = MOCK_FEATURED_MOVIE;
            
        } catch (err) {
            error.value = 'Falha ao carregar filmes. Usando dados mockados.';
            console.error(err);
            
            // Fallback para dados mockados em caso de erro da API
            categories.value = MOCK_CATEGORIES;
            featuredMovie.value = MOCK_FEATURED_MOVIE;

        } finally {
            loading.value = false;
        }
    };

    // Retorna estado e ações
    return {
        categories,
        featuredMovie,
        loading,
        error,
        fetchMovies,
    };
});