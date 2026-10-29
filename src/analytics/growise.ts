import growise from '@growise/web-sdk'
import { OttEvents, type ContentProps, type OttEventName } from './events'

import type { GrowiseEnv } from '@growise/web-sdk'

const API_KEY = import.meta.env.VITE_GROWISE_API_KEY || 'gk_demo_ott_web'
const ENV = (import.meta.env.VITE_GROWISE_ENV || 'dev') as GrowiseEnv

let ready = false
const queued: { name: string; props: Record<string, unknown> }[] = []

export async function initOttAnalytics(beforeReady?: () => void) {
  if (ready) return
  try {
    await growise.init(API_KEY, { env: ENV, appVersion: '1.0.0-ott-web' })
    beforeReady?.()
    ready = true
    const pending = queued.splice(0, queued.length)
    for (const item of pending) growise.track(item.name, item.props)
  } catch (e) {
    console.warn('[OTT] Growise init failed', e)
  }
}

export function trackOtt(name: OttEventName | string, props?: Record<string, unknown>) {
  try {
    const payload = props || {}
    if (!ready && !growise.isInitialized()) {
      if (queued.length < 50) queued.push({ name: String(name), props: payload })
      return
    }
    growise.track(name, payload)
  } catch (e) {
    console.warn('[OTT] track failed', name, e)
  }
}

export function trackContent(event: OttEventName, content: ContentProps, extra?: Record<string, unknown>) {
  trackOtt(event, { ...content, ...extra })
}

export function loginOtt(userId: string, traits: { Name?: string; Email?: string }) {
  try {
    void growise.login(userId, traits)
  } catch (e) {
    console.warn('[OTT] login failed', e)
  }
}

export function logoutOtt() {
  try {
    growise.logout()
  } catch (e) {
    console.warn('[OTT] logout failed', e)
  }
}

export { OttEvents }
