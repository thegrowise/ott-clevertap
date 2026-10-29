/** Shared OTT Growise event names — keep in sync with Flutter OttAnalytics. */
export const OttEvents = {
  CONTENT_VIEWED: 'Content Viewed',
  CONTENT_CLICKED: 'Content Clicked',
  VIDEO_STARTED: 'Video Started',
  VIDEO_PAUSED: 'Video Paused',
  VIDEO_COMPLETED: 'Video Completed',
  VIDEO_PROGRESS: 'Video Progress',
  WATCHLIST_ADDED: 'Watchlist Added',
  WATCHLIST_REMOVED: 'Watchlist Removed',
  SEARCH_PERFORMED: 'Search Performed',
  PLAN_VIEWED: 'Plan Viewed',
  SUBSCRIPTION_STARTED: 'Subscription Started',
  LANGUAGE_SELECTED: 'Language Selected',
  LOGIN_COMPLETED: 'Login Completed',
  SIGNUP_COMPLETED: 'Signup Completed',
  LOGOUT_COMPLETED: 'Logout Completed',
  AUTH_FAILED: 'Auth Failed',
  AUTH_REQUIRED: 'Auth Required',
  AUTH_SWITCHED: 'Auth Switched',
  NAV_CLICKED: 'Nav Clicked',
  PAGE_VIEWED: 'Page Viewed',
  FILTER_APPLIED: 'Filter Applied',
  PLAY_CLICKED: 'Play Clicked',
  VIDEO_SEEKED: 'Video Seeked',
  VIDEO_EXITED: 'Video Exited',
  SEARCH_STARTED: 'Search Started',
} as const

export type OttEventName = (typeof OttEvents)[keyof typeof OttEvents]

export type ContentProps = {
  content_id: string
  content_title: string
  content_type: string
  genre?: string
  language?: string
}
