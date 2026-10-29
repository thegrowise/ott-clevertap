<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ContentCard from '../components/ContentCard.vue'
import { OttEvents, trackOtt } from '../analytics/growise'
import { useCatalogStore } from '../stores/catalog'

const route = useRoute()
const catalog = useCatalogStore()

const types = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'show', label: 'Shows' },
  { id: 'sports', label: 'Sports' },
  { id: 'kids', label: 'Kids' },
]

const type = ref(String(route.params.type || 'all'))
const language = ref('all')

watch(
  () => route.params.type,
  (v) => {
    type.value = String(v || 'all')
  }
)

const items = computed(() =>
  catalog.filterTitles({ type: type.value, language: language.value })
)

const heading = computed(() => types.find((t) => t.id === type.value)?.label || 'Browse')

function selectType(id: string, label: string) {
  type.value = id
  trackOtt(OttEvents.FILTER_APPLIED, {
    filter: 'content_type',
    value: id,
    label,
    language: language.value,
    results: items.value.length,
  })
}

function selectLanguage(lang: string) {
  language.value = lang
  trackOtt(OttEvents.FILTER_APPLIED, {
    filter: 'language',
    value: lang,
    content_type: type.value,
    results: items.value.length,
  })
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">{{ heading }}</h1>
    <div class="filters">
      <button
        v-for="t in types"
        :key="t.id"
        class="chip"
        :class="{ active: type === t.id }"
        @click="selectType(t.id, t.label)"
      >
        {{ t.label }}
      </button>
    </div>
    <div class="filters">
      <button class="chip" :class="{ active: language === 'all' }" @click="selectLanguage('all')">
        All languages
      </button>
      <button
        v-for="lang in catalog.languages"
        :key="lang"
        class="chip"
        :class="{ active: language === lang }"
        @click="selectLanguage(lang)"
      >
        {{ lang }}
      </button>
    </div>
    <div v-if="items.length" class="grid">
      <ContentCard
        v-for="(item, index) in items"
        :key="item.id"
        :title="item"
        source="browse"
        :position="index + 1"
        :context="{ browse_type: type, language }"
      />
    </div>
    <div v-else class="empty">No titles match these filters.</div>
  </div>
</template>
