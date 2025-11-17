"use client"

import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/use-auth.js"


// Layout principal (Navbar + estrutura)
import MetflixApp from "../metflix-app.vue"

// Páginas
import Login from "../components/login-page.vue"
import ProfileManagement from "../components/profile-management.vue"
import MinhaLista from "../components/MinhaLista.vue"

// Placeholder (temporário)
const Placeholder = { 
  template: `
    <div class="text-white p-10 pt-24 min-h-screen bg-black text-center">
      <h1>Página em Construção</h1>
      <p class="mt-4 text-gray-400">
        Volte para 
        <router-link to="/" class="text-red-600 hover:text-red-700 font-semibold">Início</router-link>.
      </p>
    </div>
  `
}

const routes = [
  // Login (rota pública)
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guest: true }
  },

  // Gerenciar Perfis
  {
    path: "/profiles",
    name: "Profiles",
    component: ProfileManagement,
    meta: { requiresAuth: true },
  },

  // LAYOUT PRINCIPAL (Navbar + Router-view interno)
  {
    path: "/",
    component: MetflixApp,
    meta: { requiresAuth: true },

    // ROTAS FILHAS — ÁREA LOGADA
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("../components/main.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "minha-lista",
        name: "MinhaLista",
        component: MinhaLista,
        meta: { requiresAuth: true }
      },
      {
        path: "series",
        name: "Series",
        component: Placeholder,
        meta: { requiresAuth: true }
      },
      {
        path: "filmes",
        name: "Filmes",
        component: Placeholder,
        meta: { requiresAuth: true }
      },
      {
        path: "bombando",
        name: "Bombando",
        component: Placeholder,
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'navbar-link-active',
})


router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isLogged = auth.checkAuth()

  if (to.meta.requiresAuth && !isLogged) {
    return next({ name: "Login" })
  }

  if (to.meta.guest && isLogged) {
    return next({ name: "Home" })
  }

  next()
})
export default router
