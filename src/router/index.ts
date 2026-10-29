import { createRouter, createWebHistory } from 'vue-router'
import { OttEvents, trackOtt } from '../analytics/growise'
import { useCatalogStore } from '../stores/catalog'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/browse/:type?', name: 'browse', component: () => import('../views/BrowseView.vue') },
    { path: '/title/:id', name: 'title', component: () => import('../views/TitleView.vue') },
    {
      path: '/watch/:id',
      name: 'watch',
      component: () => import('../views/WatchView.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
    {
      path: '/my-list',
      name: 'my-list',
      component: () => import('../views/MyListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('../views/PlansView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { hideNav: true, guestOnly: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      meta: { hideNav: true, guestOnly: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const user = useUserStore()
  if (to.meta.requiresAuth && !user.isLoggedIn) {
    trackOtt(OttEvents.AUTH_REQUIRED, {
      page: String(to.name || ''),
      path: to.fullPath,
    })
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && user.isLoggedIn) {
    return { path: '/' }
  }
  return true
})

router.afterEach((to, from) => {
  if (from.matched.length > 0 && to.fullPath === from.fullPath) return
  const user = useUserStore()
  const contentId = typeof to.params.id === 'string' ? to.params.id : ''
  const title = contentId ? useCatalogStore().getTitle(contentId) : undefined
  trackOtt(OttEvents.PAGE_VIEWED, {
    page: String(to.name || ''),
    path: to.fullPath,
    from_page: from.matched.length ? String(from.name || '') : '',
    from_path: from.matched.length ? from.fullPath : '',
    content_id: contentId || undefined,
    content_title: title?.title,
    content_type: title?.type,
    browse_type: typeof to.params.type === 'string' ? to.params.type : undefined,
    logged_in: user.isLoggedIn,
    watchlist_count: user.watchlist.length,
    plan_id: user.planId || undefined,
    language: user.language,
  })
})

export default router
