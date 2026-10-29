export type ContentType = 'movie' | 'show' | 'sports'

export interface OttTitle {
  id: string
  title: string
  type: ContentType
  genre: string
  language: string
  rating: number
  year: number
  duration: string
  quality: string
  maturity: string
  poster: string
  banner: string
  desc: string
  cast: string[]
  videoUrl: string
  seasons?: number
  live?: boolean
}

export interface OttRail {
  id: string
  title: string
  contentIds: string[]
}

export interface OttPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  features: string[]
  popular?: boolean
}

export interface OttCatalog {
  rails: OttRail[]
  plans: OttPlan[]
  languages: string[]
  genres: string[]
  titles: OttTitle[]
}
