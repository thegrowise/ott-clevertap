<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import { useUserStore } from '../stores/user'

const catalog = useCatalogStore()
const user = useUserStore()
const router = useRouter()

function logout() {
  user.logout()
  router.replace('/')
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Profile</h1>
    <div class="panel">
      <p style="margin-top: 0">
        Signed in as <strong>{{ user.user?.name }}</strong><br />
        <span style="color: var(--text-muted)">{{ user.user?.email }}</span>
      </p>
      <div class="field">
        <label>Preferred language</label>
        <select :value="user.language" @change="user.setLanguage(($event.target as HTMLSelectElement).value)">
          <option v-for="lang in catalog.languages" :key="lang" :value="lang">{{ lang }}</option>
        </select>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem">
        Plan: {{ user.planId || 'None' }} · Watchlist: {{ user.watchlist.length }} titles
      </p>
      <button class="btn btn-danger" @click="logout">Logout</button>
    </div>
  </div>
</template>
