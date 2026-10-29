<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentRail from '../components/ContentRail.vue'
import { OttEvents, trackContent } from '../analytics/growise'
import { useCatalogStore } from '../stores/catalog'
import { useUserStore } from '../stores/user'
import { toContentProps } from '../utils/content'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const user = useUserStore()

const title = computed(() => catalog.getTitle(String(route.params.id)))
const similar = computed(() => (title.value ? catalog.similarTo(title.value.id) : []))

watch(
  () => title.value?.id,
  (id) => {
    if (id && title.value) {
      trackContent(OttEvents.CONTENT_VIEWED, toContentProps(title.value))
    }
  },
  { immediate: true },
)

function play() {
  if (!title.value) return
  trackContent(OttEvents.PLAY_CLICKED, toContentProps(title.value), { source: 'title' })
  router.push(`/watch/${title.value.id}`)
}

function toggleList() {
  if (!title.value) return
  user.toggleWatchlist(toContentProps(title.value), { source: 'title' })
}
</script>

<template>
  <div class="page" v-if="title">
    <div class="detail">
      <div class="detail-poster">
        <img :src="title.poster" :alt="title.title" />
      </div>
      <div>
        <h1>{{ title.title }}</h1>
        <div class="meta">
          <span class="pill">★ {{ title.rating }}</span>
          <span>{{ title.year }}</span>
          <span>{{ title.duration }}</span>
          <span class="pill">{{ title.quality }}</span>
          <span class="pill">{{ title.maturity }}</span>
          <span class="pill">{{ title.language }}</span>
          <span v-if="title.live" class="pill" style="background:#ff2e63;color:#fff">LIVE</span>
        </div>
        <p class="desc">{{ title.desc }}</p>
        <p class="desc"><strong>Cast:</strong> {{ title.cast.join(', ') }}</p>
        <div class="actions">
          <button class="btn btn-primary" @click="play">▶ Play</button>
          <button class="btn btn-ghost" @click="toggleList">
            {{ user.isInWatchlist(title.id) ? '✓ In My List' : '+ My List' }}
          </button>
        </div>
      </div>
    </div>
    <ContentRail heading="More like this" :items="similar" />
  </div>
  <div v-else class="page empty">Title not found.</div>
</template>
