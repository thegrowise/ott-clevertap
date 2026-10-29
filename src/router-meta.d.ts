export {}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    hideNav?: boolean
    guestOnly?: boolean
  }
}
