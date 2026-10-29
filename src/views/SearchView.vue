<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ContentCard from '../components/ContentCard.vue'
import { OttEvents, trackOtt } from '../analytics/growise'
import { useCatalogStore } from '../stores/catalog'

const catalog = useCatalogStore()
const query = ref('')
const searchStarted = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const items = computed(() =>
  query.value.trim().length < 2
    ? []
    : catalog.filterTitles({ query: query.value.trim() })
)

watch(query, (q) => {
  if (timer) clearTimeout(timer)
  if (q.trim().length < 2) return
  timer = setTimeout(() => {
    const matched = items.value
    trackOtt(OttEvents.SEARCH_PERFORMED, {
      query: q.trim(),
      results: matched.length,
      result_ids: matched.slice(0, 12).map((item) => item.id),
    })
  }, 500)
})

function onSearchFocus() {
  if (searchStarted.value) return
  searchStarted.value = true
  trackOtt(OttEvents.SEARCH_STARTED, {})
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Search</h1>
    <input
      v-model="query"
      class="search-box"
      type="search"
      placeholder="Search movies, shows, sports…"
      autofocus
      @focus="onSearchFocus"
    />
    <div v-if="items.length" class="grid" style="margin-top: 1.5rem">
      <ContentCard
        v-for="(item, index) in items"
        :key="item.id"
        :title="item"
        source="search"
        :position="index + 1"
        :context="{ query: query.trim() }"
      />
    </div>
    <div v-else-if="query.trim().length >= 2" class="empty">No results for “{{ query }}”.</div>
    <div v-else class="empty">Type at least 2 characters to search the catalog.</div>
  </div>
</template>
