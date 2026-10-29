<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ContentRail from '../components/ContentRail.vue'
import { useCatalogStore } from '../stores/catalog'
import { useUserStore } from '../stores/user'
import { OttEvents, trackContent } from '../analytics/growise'
import { toContentProps } from '../utils/content'

const catalog = useCatalogStore()
const user = useUserStore()
const router = useRouter()

const hero = computed(() => catalog.getTitle('m1') || catalog.titles[0])
const rails = computed(() =>
  catalog.rails.map((r) => ({
    id: r.id,
    title: r.title,
    items: catalog.titlesForRail(r.id),
  }))
)

function playHero() {
  if (!hero.value) return
  const content = toContentProps(hero.value)
  trackContent(OttEvents.PLAY_CLICKED, content, { source: 'hero' })
  trackContent(OttEvents.CONTENT_CLICKED, content, { source: 'hero_play' })
  router.push(`/watch/${hero.value.id}`)
}

function openHero() {
  if (!hero.value) return
  trackContent(OttEvents.CONTENT_CLICKED, toContentProps(hero.value), { source: 'hero' })
  router.push(`/title/${hero.value.id}`)
}

function toggleList() {
  if (!hero.value) return
  user.toggleWatchlist(toContentProps(hero.value), { source: 'hero' })
}
</script>

<template>
  <div class="page" v-if="hero">
    <section class="hero">
      <div class="hero-bg" :style="{ backgroundImage: `url(${hero.banner})` }" />
      <div class="hero-overlay" />
      <div class="hero-content">
        <span class="hero-badge">{{ hero.live ? 'Live Now' : 'Trending #1' }}</span>
        <h1>{{ hero.title }}</h1>
        <div class="hero-meta">
          <span class="pill">★ {{ hero.rating }}</span>
          <span>{{ hero.year }}</span>
          <span>{{ hero.duration }}</span>
          <span class="pill">{{ hero.quality }}</span>
          <span class="pill">{{ hero.genre }}</span>
        </div>
        <p>{{ hero.desc }}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" @click="playHero">▶ Play Now</button>
          <button class="btn btn-ghost" @click="toggleList">
            {{ user.isInWatchlist(hero.id) ? '✓ In My List' : '+ My List' }}
          </button>
          <button class="btn btn-ghost" @click="openHero">Details</button>
        </div>
      </div>
    </section>

    <ContentRail
      v-for="rail in rails"
      :key="rail.id"
      :heading="rail.title"
      :items="rail.items"
    />
  </div>
</template>
