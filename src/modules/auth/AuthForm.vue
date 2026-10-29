<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { OttEvents, trackOtt } from '../../analytics/growise'
import { useUserStore } from '../../stores/user'

const props = defineProps<{ mode: 'login' | 'signup' }>()

const user = useUserStore()
const router = useRouter()
const route = useRoute()

const name = ref('')
const email = ref(props.mode === 'login' ? user.demoEmail : '')
const password = ref(props.mode === 'login' ? user.demoPassword : '')
const error = ref('')
const submitting = ref(false)

const redirectTo = computed(() => {
  const q = route.query.redirect
  return typeof q === 'string' && q.startsWith('/') ? q : '/'
})

const title = computed(() => (props.mode === 'login' ? 'Sign in' : 'Create account'))
const subtitle = computed(() =>
  props.mode === 'login'
    ? 'Continue watching on GrowStream'
    : 'Start streaming with a free demo account',
)

function go(path: string) {
  trackOtt(OttEvents.AUTH_SWITCHED, {
    from: props.mode,
    to: path === '/signup' ? 'signup' : 'login',
  })
  router.replace({ path, query: route.query.redirect ? { redirect: route.query.redirect } : {} })
}

function submit() {
  error.value = ''
  submitting.value = true
  const result =
    props.mode === 'login'
      ? user.login(email.value, password.value)
      : user.signup(name.value, email.value, password.value)
  submitting.value = false
  if (!result.ok) {
    error.value = result.error
    trackOtt(OttEvents.AUTH_FAILED, { mode: props.mode, error: result.error })
    return
  }
  router.push(redirectTo.value)
}
</script>

<template>
  <div class="auth-screen">
    <div class="auth-bg" />
    <div class="auth-overlay" />
    <header class="auth-top">
      <RouterLink to="/" class="brand" @click="trackOtt(OttEvents.NAV_CLICKED, { label: 'GrowStream', path: '/', source: 'auth' })">
        <span class="brand-mark">G</span>
        <span>GrowStream</span>
      </RouterLink>
    </header>
    <main class="auth-card">
      <h1>{{ title }}</h1>
      <p class="auth-sub">{{ subtitle }}</p>

      <form @submit.prevent="submit">
        <div v-if="mode === 'signup'" class="field">
          <label>Name</label>
          <input v-model="name" type="text" autocomplete="name" placeholder="Your name" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" autocomplete="email" placeholder="you@email.com" />
        </div>
        <div class="field">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
            placeholder="••••••••"
          />
        </div>
        <p v-if="error" class="auth-error">{{ error }}</p>
        <button class="btn btn-primary auth-submit" type="submit" :disabled="submitting">
          {{ mode === 'login' ? 'Sign in' : 'Sign up' }}
        </button>
      </form>

      <p v-if="mode === 'login'" class="auth-demo">
        Demo: <code>{{ user.demoEmail }}</code> / <code>{{ user.demoPassword }}</code>
      </p>

      <p class="auth-switch">
        <template v-if="mode === 'login'">
          New to GrowStream?
          <button type="button" class="linkish" @click="go('/signup')">Create an account</button>
        </template>
        <template v-else>
          Already have an account?
          <button type="button" class="linkish" @click="go('/login')">Sign in</button>
        </template>
      </p>
    </main>
  </div>
</template>
