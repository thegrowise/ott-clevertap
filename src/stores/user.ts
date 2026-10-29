import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loginOtt, logoutOtt, OttEvents, trackContent, trackOtt } from '../analytics/growise'
import type { ContentProps } from '../analytics/events'
import {
  AUTH_STORAGE,
  DEMO_ACCOUNT,
  userIdFromEmail,
  type OttAccount,
  type OttUser,
} from '../modules/auth/types'

const WL_KEY = 'ott_watchlist'
const LANG_KEY = 'ott_language'
const PLAN_KEY = 'ott_plan'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function loadAccounts(): OttAccount[] {
  const saved = loadJson<OttAccount[]>(AUTH_STORAGE.accounts, [])
  const hasDemo = saved.some((a) => a.email.toLowerCase() === DEMO_ACCOUNT.email)
  return hasDemo ? saved : [DEMO_ACCOUNT, ...saved]
}

export const useUserStore = defineStore('user', () => {
  const watchlist = ref<string[]>(loadJson<string[]>(WL_KEY, []))
  const user = ref<OttUser | null>(loadJson(AUTH_STORAGE.session, null))
  const language = ref(localStorage.getItem(LANG_KEY) || 'English')
  const planId = ref(localStorage.getItem(PLAN_KEY) || '')
  const accounts = ref<OttAccount[]>(loadAccounts())

  const isLoggedIn = computed(() => !!user.value)

  function persistAccounts() {
    localStorage.setItem(AUTH_STORAGE.accounts, JSON.stringify(accounts.value))
  }

  function persistSession() {
    if (user.value) localStorage.setItem(AUTH_STORAGE.session, JSON.stringify(user.value))
    else localStorage.removeItem(AUTH_STORAGE.session)
  }

  function persistWatchlist() {
    localStorage.setItem(WL_KEY, JSON.stringify(watchlist.value))
  }

  function isInWatchlist(id: string) {
    return watchlist.value.includes(id)
  }

  function toggleWatchlist(content: ContentProps, extra?: Record<string, unknown>) {
    const idx = watchlist.value.indexOf(content.content_id)
    if (idx >= 0) {
      watchlist.value.splice(idx, 1)
      trackContent(OttEvents.WATCHLIST_REMOVED, content, extra)
    } else {
      watchlist.value.push(content.content_id)
      trackContent(OttEvents.WATCHLIST_ADDED, content, extra)
    }
    persistWatchlist()
  }

  function findAccount(email: string) {
    const key = email.trim().toLowerCase()
    return accounts.value.find((a) => a.email.toLowerCase() === key) || null
  }

  function setSession(account: OttAccount) {
    user.value = { id: account.id, name: account.name, email: account.email }
    persistSession()
    loginOtt(account.id, { Name: account.name, Email: account.email })
  }

  function login(email: string, password: string): { ok: true } | { ok: false; error: string } {
    const account = findAccount(email)
    if (!account) return { ok: false, error: 'No account found for this email. Create one first.' }
    if (account.password !== password) return { ok: false, error: 'Incorrect password.' }
    setSession(account)
    trackOtt(OttEvents.LOGIN_COMPLETED, { method: 'email', email: account.email })
    return { ok: true }
  }

  function signup(
    name: string,
    email: string,
    password: string,
  ): { ok: true } | { ok: false; error: string } {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName) return { ok: false, error: 'Enter your name.' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { ok: false, error: 'Enter a valid email.' }
    }
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }
    if (findAccount(trimmedEmail)) return { ok: false, error: 'This email is already registered. Sign in instead.' }

    const account: OttAccount = {
      id: userIdFromEmail(trimmedEmail),
      name: trimmedName,
      email: trimmedEmail,
      password,
    }
    accounts.value = [...accounts.value, account]
    persistAccounts()
    setSession(account)
    trackOtt(OttEvents.SIGNUP_COMPLETED, { method: 'email', email: account.email })
    return { ok: true }
  }

  function logout() {
    trackOtt(OttEvents.LOGOUT_COMPLETED, {
      plan_id: planId.value || undefined,
      watchlist_count: watchlist.value.length,
    })
    user.value = null
    persistSession()
    logoutOtt()
  }

  function setLanguage(lang: string) {
    language.value = lang
    localStorage.setItem(LANG_KEY, lang)
    trackOtt(OttEvents.LANGUAGE_SELECTED, { language: lang })
  }

  function subscribe(plan: { id: string; name: string; price: number }) {
    const already = planId.value === plan.id
    planId.value = plan.id
    localStorage.setItem(PLAN_KEY, plan.id)
    trackOtt(OttEvents.SUBSCRIPTION_STARTED, {
      plan_id: plan.id,
      plan_name: plan.name,
      price: plan.price,
      currency: 'INR',
      is_current_plan: already,
    })
  }

  return {
    watchlist,
    user,
    language,
    planId,
    isLoggedIn,
    demoEmail: DEMO_ACCOUNT.email,
    demoPassword: DEMO_ACCOUNT.password,
    isInWatchlist,
    toggleWatchlist,
    login,
    signup,
    logout,
    setLanguage,
    subscribe,
  }
})
