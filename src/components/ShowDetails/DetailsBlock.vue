<template>
  <section class="c-details-block">
    <div class="c-details-block__meta">
      <div
        v-for="item in meta"
        :key="item.title"
        class="c-details-block__meta-item"
      >
        <span class="c-details-block__meta-label">{{ item.title }}</span>

        <span class="c-details-block__meta-value">{{ item.description }}</span>
      </div>
    </div>

    <div class="c-details-block__summary">
      <h2 class="c-details-block__section-title">
        Summary
      </h2>

      <p class="c-details-block__summary-text">
        {{ cleanSummary }}
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Show } from '@/types'
import { useLocale } from '@/locales'
import { useShowsStore } from '@/stores'

interface Props {
  show: Show
  seasons: number[]
}

type MetaItem = {
  title: string
  description: string | number
}

defineOptions({ name: 'DetailsBlock' })

const props = defineProps<Props>()

const { t } = useLocale()

const network = computed((): string => {
  return props.show?.network?.name ||
    props.show?.webChannel?.name ||
    t('basic.unknown')
})

const yearsOnAir = computed((): string => {
  if (!props.show) {
    return t('basic.unknown')
  }
  const premiereYear = props.show.premiered?.split('-')[0]
  const endYear = props.show.ended?.split('-')[0]

  if (premiereYear && endYear) {
    return `${premiereYear} - ${endYear}`
  } else if (premiereYear) {
    return `${premiereYear} - ${t('basic.present')}`
  }
  return t('basic.unknown')
})

const rating = computed((): string | number => {
  return props.show?.rating.average ?
    props.show.rating?.average.toFixed(1) : t('not.applicable')
})

const runtime = computed((): string => {
  const value = props.show?.runtime ?? props.show?.averageRuntime
  return value ? `${value} min` : t('not.applicable')
})

const cleanSummary = computed((): string => {
  if (!props.show?.summary) {
    return t('not.summary')
  }
  return props.show?.summary.replace(/<[^>]*>/g, '')
})

const meta = computed((): MetaItem[] => {
  const { status, language, genres } = props.show

  return [
    { title: t('show.network'), description: network.value },
    { title: t('show.year', 2), description: yearsOnAir.value },
    { title: t('show.season', 2), description: props.seasons.length },
    { title: t('show.rating'), description: rating.value },
    { title: t('show.runtime'), description: runtime.value },
    { title: t('show.status'), description: status },
    { title: t('show.language'), description: language },
    { title: t('show.genre', 2), description: genres.join(', ') ?? t('not.applicable') }
  ]
})
</script>

<style lang="scss" scoped>
.c-details-block {
  &__meta {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
  }

  &__meta-item {
    display: flex;
    gap: 4px;
    flex-direction: column;
  }

  &__meta-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  &__meta-value {
    font-size: 16px;
    color: #e0e0e0;
  }

  &__summary {
    display: flex;
    margin-top: 24px;
    gap: 12px;
    flex-direction: column;
  }

  &__summary-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: #bbb;
  }
}
</style>
