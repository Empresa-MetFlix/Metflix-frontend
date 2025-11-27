import { createRouter, createWebHistory } from 'vue-router'

// Páginas em /views
import FaqPage from '../views/faq-page.vue'
import HelpPage from '../views/help-page.vue'
import TermsPage from '../views/terms-page.vue'
import PrivacyPage from '../views/privacy-page.vue'
import SeriesPage from '../views/series-page.vue'
import FilmesPage from '../views/filmes-page.vue'
import BombandoPage from '../views/bombando-page.vue'
import SearchPage from '../views/search-page.vue'

// Componentes
import Main from '../components/main.vue'
import MinhaLista from '../components/MinhaLista.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Main
  },
  {
    path: '/series',
    name: 'Series',
    component: SeriesPage
  },
  {
    path: '/filmes',
    name: 'Filmes',
    component: FilmesPage
  },
  {
    path: '/bombando',
    name: 'Bombando',
    component: BombandoPage
  },
  {
    path: '/minha-lista',
    name: 'MinhaLista',
    component: MinhaLista
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FaqPage
  },
  {
    path: '/help',
    name: 'Help',
    component: HelpPage
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsPage
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'router-link-active'
})

export default router
