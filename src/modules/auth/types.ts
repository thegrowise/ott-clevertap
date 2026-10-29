export type OttUser = {
  id: string
  name: string
  email: string
}

export type OttAccount = OttUser & {
  password: string
}

export const AUTH_STORAGE = {
  session: 'ott_user',
  accounts: 'ott_accounts',
} as const

export const DEMO_ACCOUNT: OttAccount = {
  id: 'ott_viewer_growstream_demo',
  name: 'Demo Viewer',
  email: 'viewer@growstream.demo',
  password: 'growise123',
}

export function userIdFromEmail(email: string) {
  return `ott_${email.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
}
