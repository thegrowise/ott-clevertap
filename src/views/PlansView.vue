<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { OttEvents, trackOtt } from '../analytics/growise'
import { useCatalogStore } from '../stores/catalog'
import { useUserStore } from '../stores/user'

const catalog = useCatalogStore()
const user = useUserStore()
const justSubscribed = ref('')

onMounted(() => {
  trackOtt(OttEvents.PLAN_VIEWED, { plans_count: catalog.plans.length })
})

function subscribe(plan: { id: string; name: string; price: number }) {
  user.subscribe(plan)
  justSubscribed.value = plan.name
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Choose your plan</h1>
    <p style="color: var(--text-muted); max-width: 560px">
      Hotstar-style tiers for this Growise demo. Checkout is mocked — we only fire subscription analytics events.
    </p>
    <p v-if="justSubscribed || user.planId" style="color: var(--accent); font-weight: 700">
      Active plan: {{ justSubscribed || user.planId }}
    </p>
    <div class="plans">
      <article
        v-for="plan in catalog.plans"
        :key="plan.id"
        class="plan-card"
        :class="{ popular: plan.popular }"
      >
        <span v-if="plan.popular" class="tag">MOST POPULAR</span>
        <h3>{{ plan.name }}</h3>
        <div class="plan-price">
          ₹{{ plan.price }} <span>/ {{ plan.period }}</span>
        </div>
        <ul>
          <li v-for="f in plan.features" :key="f">{{ f }}</li>
        </ul>
        <button class="btn btn-primary" style="width: 100%" @click="subscribe(plan)">
          {{ user.planId === plan.id ? 'Current plan' : 'Subscribe' }}
        </button>
      </article>
    </div>
  </div>
</template>
