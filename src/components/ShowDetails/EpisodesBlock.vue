<template>
  <section class="c-episode-block">
    <div class="c-episodes-block__episodes">
      <h2 class="c-episodes-block__section-title">
        Episodes
      </h2>

      <div class="c-episodes-block__season-selector">
        <button
          v-for="season in seasons"
          :key="season"
          :class="{ 'show-detail__season-button--active': selectedSeason === season }"
          class="c-episodes-block__season-button"
          @click="selectSeason(season)"
        >
          {{ t('show.season') }} {{ season }}
        </button>
      </div>

      <div class="c-episodes-block__episode-list">
        <div
          v-for="episode in seasonEpisodes"
          :key="episode.id"
          class="c-episodes-block__episode"
        >
          <div class="c-episodes-block__episode-main">
            <div class="c-episodes-block__episode-number">
              {{ episode.number }}
            </div>

            <div class="c-episodes-block__episode-info">
              <h3 class="c-episodes-block__episode-title">
                {{ episode.name }}
              </h3>

              <p class="c-episodes-block__episode-date">
                {{ formatAirDate(episode.airdate) }}
              </p>
            </div>

            <div class="c-episodes-block__episode-picture">
              <img
                :src="getEpisodePicture(episode?.image)"
                :alt="episode.name"
              >
            </div>
          </div>

          <div class="c-episodes-block__episode-summary">
            {{ getEpisodeSummary(episode?.summary) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useLocale } from '@/locales'
import { useShowsStore } from '@/stores'
import { ref, watch, computed } from 'vue'
import type { Episode, ItemImage } from '@/types'

interface Props {
  seasons: number[]
}

defineOptions({ name: 'EpisodesBlock' })
const props = defineProps<Props>()

const { t } = useLocale()
const store = useShowsStore()

const selectedSeason = ref<number | undefined>(1)

const episodes = computed((): Episode[] => store.episodes)

const seasonEpisodes = computed((): Episode[] => {
  return episodes.value.filter((episode: Episode) => episode.season === selectedSeason.value)
})

const getEpisodeSummary = (summary: string | null): string => {
  if (!summary) {
    return t('not.summary')
  }
  return summary.replace(/(<([^>]+)>)/ig, '')
}

const selectSeason = (season: number): void => {
  selectedSeason.value = season
}

const formatAirDate = (date: string): string => {
  if (!date) {
    return 'TBA'
  }
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getEpisodePicture = (image: ItemImage | null): string => {
  if (!image) {
    return './placeholder.webp'
  }

  return image?.original || image?.medium
}

watch(() => props.seasons, (val) => {
  selectedSeason.value = val?.[0]
})
</script>

<style lang="scss" scoped>
.c-episodes-block {
  &__episodes {
    display: flex;
    gap: 24px;
    flex-direction: column;
  }

  &__season-selector {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__season-button {
    padding: 10px 20px;
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: #3a3a3a;
      border-color: #4a4a4a;
    }

    &--active {
      background-color: #4a4a4a;
      border-color: #6a6a6a;
      color: #fff;
    }
  }

  &__episode-list {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }

  &__episode {
    background-color: #1a1a1a;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #2a2a2a;
    }
  }

  &__episode-main {
    display: flex;
    padding: 16px;
    gap: 16px;
    align-items: center;
  }

  &__episode-number {
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-color: #2a2a2a;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 18px;
    font-weight: 600;
  }

  &__episode-info {
    display: flex;
    flex: 1;
    gap: 4px;
    flex-direction: column;
  }

  &__episode-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #e0e0e0;
  }

  &__episode-date {
    margin: 0;
    font-size: 14px;
    color: #888;
  }

  &__episode-summary {
    padding: 16px;
  }

  &__episode-picture {
    margin-left: auto;

    img {
      width: 128px;
    }
  }
}
</style>
