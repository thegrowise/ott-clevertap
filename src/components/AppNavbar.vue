<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { OttEvents, trackOtt } from '../analytics/growise'
import { useUserStore } from '../stores/user'

const user = useUserStore()
const router = useRouter()

function trackNav(label: string, path: string) {
  trackOtt(OttEvents.NAV_CLICKED, { label, path, source: 'navbar' })
  void router.push(path)
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand" @click.prevent="trackNav('GrowStream', '/')">
      <span class="brand-mark">G</span>
      <span>GrowStream</span>
    </RouterLink>
    <nav class="nav-links">
      <RouterLink to="/" @click.prevent="trackNav('Home', '/')">Home</RouterLink>
      <RouterLink to="/browse/movie" @click.prevent="trackNav('Movies', '/browse/movie')">Movies</RouterLink>
      <RouterLink to="/browse/show" @click.prevent="trackNav('Shows', '/browse/show')">Shows</RouterLink>
      <RouterLink to="/browse/sports" @click.prevent="trackNav('Sports', '/browse/sports')">Sports</RouterLink>
      <RouterLink to="/my-list" @click.prevent="trackNav('My List', '/my-list')">My List</RouterLink>
      <RouterLink to="/search" @click.prevent="trackNav('Search', '/search')">Search</RouterLink>
      <RouterLink to="/plans" @click.prevent="trackNav('Subscribe', '/plans')">Subscribe</RouterLink>
    </nav>
    <div class="nav-right">
      <RouterLink v-if="user.isLoggedIn" to="/profile" class="btn btn-ghost" @click.prevent="trackNav('Profile', '/profile')">
        {{ user.user?.name }}
      </RouterLink>
      <RouterLink v-else to="/login" class="btn btn-primary" @click.prevent="trackNav('Login', '/login')">Login</RouterLink>
    </div>
  </header>
</template>
