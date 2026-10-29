import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import catalogData from '../data/catalog.json'
import type { OttCatalog, OttTitle } from '../types/ott'

const catalog = catalogData as OttCatalog

export const useCatalogStore = defineStore('catalog', () => {
  const titles = ref<OttTitle[]>(catalog.titles)
  const rails = catalog.rails
  const plans = catalog.plans
  const languages = catalog.languages
  const genres = catalog.genres

  const byId = computed(() => {
    const map = new Map<string, OttTitle>()
    for (const t of titles.value) map.set(t.id, t)
    return map
  })

  function getTitle(id: string) {
    return byId.value.get(id) || null
  }

  function titlesForRail(railId: string) {
    const rail = rails.find((r) => r.id === railId)
    if (!rail) return []
    return rail.contentIds.map((id) => byId.value.get(id)).filter(Boolean) as OttTitle[]
  }

  function filterTitles(opts: { type?: string; language?: string; genre?: string; query?: string }) {
    return titles.value.filter((t) => {
      if (opts.type && opts.type !== 'all') {
        if (opts.type === 'kids') {
          if (t.genre !== 'Kids' && t.maturity !== 'U') return false
        } else if (t.type !== opts.type) return false
      }
      if (opts.language && opts.language !== 'all' && t.language !== opts.language) return false
      if (opts.genre && opts.genre !== 'all' && t.genre !== opts.genre) return false
      if (opts.query) {
        const q = opts.query.toLowerCase()
        if (!t.title.toLowerCase().includes(q) && !t.genre.toLowerCase().includes(q)) return false
      }
      return true
    })
  }

  function similarTo(id: string, limit = 8) {
    const base = getTitle(id)
    if (!base) return []
    return titles.value
      .filter((t) => t.id !== id && (t.genre === base.genre || t.type === base.type))
      .slice(0, limit)
  }

  return {
    titles,
    rails,
    plans,
    languages,
    genres,
    getTitle,
    titlesForRail,
    filterTitles,
    similarTo,
  }
})
