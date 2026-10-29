<script setup lang="ts">
import { computed } from 'vue'
import ContentCard from '../components/ContentCard.vue'
import { useCatalogStore } from '../stores/catalog'
import { useUserStore } from '../stores/user'

const catalog = useCatalogStore()
const user = useUserStore()

const items = computed(() =>
  user.watchlist.map((id) => catalog.getTitle(id)).filter(Boolean)
)
</script>

<template>
  <div class="page">
    <h1 class="page-title">My List</h1>
    <div v-if="items.length" class="grid">
      <ContentCard
        v-for="(item, index) in items"
        :key="item!.id"
        :title="item!"
        source="my_list"
        :position="index + 1"
      />
    </div>
    <div v-else class="empty">
      Your watchlist is empty. Add titles from Home or title details.
    </div>
  </div>
</template>
