import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/login-page.vue";   // login isolado
import MetflixApp from "../metflix-app.vue";            // app principal (com navbar e footer)
import HomeView from "../components/main.vue";         // exemplo de página interna
import ProfileManagement from "../components/ProfileManagement.vue";
import MinhaLista from "../components/MinhaLista.vue";
import SeriesPage from "../components/SeriesPage.vue";
import FilmesPage from "../components/FilmesPage.vue";
import BombandoPage from "../components/BombandoPage.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage, // totalmente isolado
  },
  {
    path: "/",
    name: "Home",
    component: MetflixApp, // só aparece se usuário estiver logado
    children: [
      { path: "", component: HomeView },
      { path: "minha-lista", component: MinhaLista },
      { path: "profile-management", component: ProfileManagement },

      // 🔥 Novas páginas na navbar:
      { path: "series", name: "Series", component: SeriesPage },
      { path: "filmes", name: "Filmes", component: FilmesPage },
      { path: "bombando", name: "Bombando", component: BombandoPage },
    ],
  },

  // rota inválida → login
  {
    path: "/:catchAll(.*)",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
