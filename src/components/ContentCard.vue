<script setup lang="ts">
import { useRouter } from 'vue-router'
import { OttEvents, trackContent } from '../analytics/growise'
import type { OttTitle } from '../types/ott'
import { toContentProps } from '../utils/content'

const props = defineProps<{
  title: OttTitle
  source?: string
  position?: number
  context?: Record<string, unknown>
}>()
const router = useRouter()

function open() {
  trackContent(OttEvents.CONTENT_CLICKED, toContentProps(props.title), {
    source: props.source || 'card',
    position: props.position,
    ...props.context,
  })
  router.push(`/title/${props.title.id}`)
}
</script>

<template>
  <article class="card" @click="open">
    <div class="card-poster">
      <img :src="title.poster" :alt="title.title" loading="lazy" />
      <span v-if="title.live" class="card-live">LIVE</span>
    </div>
    <div class="card-title">{{ title.title }}</div>
    <div class="card-sub">{{ title.genre }} · {{ title.language }}</div>
  </article>
</template>
