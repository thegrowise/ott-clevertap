<script setup lang="ts">
import ContentCard from './ContentCard.vue'
import type { OttTitle } from '../types/ott'

defineProps<{ heading: string; items: OttTitle[] }>()
</script>

<template>
  <section v-if="items.length" class="rail">
    <div class="rail-header">
      <h2>{{ heading }}</h2>
    </div>
    <div class="rail-track">
      <ContentCard
        v-for="(item, index) in items"
        :key="item.id"
        :title="item"
        :source="heading"
        :position="index + 1"
      />
    </div>
  </section>
</template>
