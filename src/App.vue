<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'

const route = useRoute()
const hideNav = computed(() => !!route.meta.hideNav)
</script>

<template>
  <div class="app-shell" :class="{ 'auth-layout': hideNav }">
    <AppNavbar v-if="!hideNav" />
    <RouterView />
  </div>
</template>
