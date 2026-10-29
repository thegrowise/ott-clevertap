<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OttEvents, trackContent, trackOtt } from '../analytics/growise'
import { useCatalogStore } from '../stores/catalog'
import { toContentProps } from '../utils/content'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const videoEl = ref<HTMLVideoElement | null>(null)

const title = computed(() => catalog.getTitle(String(route.params.id)))
const fired = ref<Record<number, boolean>>({ 25: false, 50: false, 75: false })
const leaveReason = ref('route_leave')

function propsBase() {
  return title.value ? toContentProps(title.value) : null
}

function onPlay() {
  const p = propsBase()
  if (p) trackContent(OttEvents.VIDEO_STARTED, p)
}

function onPause() {
  const p = propsBase()
  if (!p || !videoEl.value) return
  if (videoEl.value.ended) return
  trackContent(OttEvents.VIDEO_PAUSED, p, {
    position_sec: Math.floor(videoEl.value.currentTime),
  })
}

function onTimeUpdate() {
  const el = videoEl.value
  const p = propsBase()
  if (!el || !p || !el.duration) return
  const percent = Math.floor((el.currentTime / el.duration) * 100)
  for (const m of [25, 50, 75] as const) {
    if (percent >= m && !fired.value[m]) {
      fired.value[m] = true
      trackOtt(OttEvents.VIDEO_PROGRESS, { ...p, percent: m })
    }
  }
}

function onEnded() {
  const p = propsBase()
  if (p) trackContent(OttEvents.VIDEO_COMPLETED, p, { percent: 100 })
}

function onSeeked() {
  const el = videoEl.value
  const p = propsBase()
  if (!el || !p || el.currentTime < 1) return
  const percent = el.duration ? Math.floor((el.currentTime / el.duration) * 100) : 0
  trackOtt(OttEvents.VIDEO_SEEKED, {
    ...p,
    position_sec: Math.floor(el.currentTime),
    percent,
  })
}

function goBack() {
  leaveReason.value = 'back_button'
  router.back()
}

onMounted(() => {
  fired.value = { 25: false, 50: false, 75: false }
})

onBeforeUnmount(() => {
  const el = videoEl.value
  const p = propsBase()
  if (p && el) {
    const percent = el.duration ? Math.floor((el.currentTime / el.duration) * 100) : 0
    trackOtt(OttEvents.VIDEO_EXITED, {
      ...p,
      position_sec: Math.floor(el.currentTime),
      percent,
      reason: leaveReason.value,
    })
  }
  el?.pause()
})
</script>

<template>
  <div class="page" v-if="title">
    <button class="btn btn-ghost" style="margin: 1rem 0" @click="goBack">← Back</button>
    <div class="player-wrap">
      <video
        ref="videoEl"
        :src="title.videoUrl"
        controls
        autoplay
        playsinline
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeUpdate"
        @seeked="onSeeked"
        @ended="onEnded"
      />
    </div>
    <div class="player-info">
      <h1 class="page-title" style="margin-bottom: 0.35rem">{{ title.title }}</h1>
      <p style="color: var(--text-muted)">
        {{ title.genre }} · {{ title.language }} · {{ title.quality }}
      </p>
    </div>
  </div>
  <div v-else class="page empty">Title not found.</div>
</template>
