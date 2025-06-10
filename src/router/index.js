"use client"

import { createRouter, createWebHistory } from "vue-router"
import { useAuth } from "../composables/use-auth.js"

// Importar páginas
import MetflixApp from "../metflix-app.vue"
import Login from "../components/login-page.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: MetflixApp,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Proteção de rotas
router.beforeEach((to, from, next) => {
  const { checkAuth } = useAuth()
  const isAuthenticated = checkAuth()

  // Redirecionar para login se a rota requer autenticação e o usuário não está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" })
  }
  // Redirecionar para home se o usuário já está autenticado e tenta acessar páginas de guest
  else if (to.meta.guest && isAuthenticated) {
    next({ name: "Home" })
  }
  // Caso contrário, continuar normalmente
  else {
    next()
  }
})

export default router
