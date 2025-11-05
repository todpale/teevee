<template>
  <div class="p-dashboard">
    <top-bar />

    <header class="p-dashboard__header">
      <h1 v-text="t('app.title')" />
    </header>

    <div class="p-dashboard__search-section">
      <search-bar @on-search="handleSearch" />

      <button
        :class="{ 'dashboard__sort-button--active': isSorted }"
        class="p-dashboard__sort-button"
        @click="isSorted = !isSorted"
      >
        <icon :icon="sortIcon" />

        <span v-text="t('action.sort')" />
      </button>
    </div>

    <div class="p-dashboard__genres-section">
      <button
        class="p-dashboard__genre-scroll-button p-dashboard__genre-scroll-button--left"
        aria-label="Scroll left"
        @click="scrollGenres('left')"
      >
        <icon icon="tv-chevron-left" />
      </button>

      <div
        ref="container"
        class="p-dashboard__genres"
      >
        <genre-button
          v-for="genre in genres"
          :key="genre"
          :genre
          :is-active="selectedGenre === genre"
          @on-click="selectGenre"
        />
      </div>

      <button
        class="p-dashboard__genre-scroll-button p-dashboard__genre-scroll-button--right"
        aria-label="Scroll right"
        @click="scrollGenres('right')"
      >
        <icon icon="tv-chevron-right" />
      </button>
    </div>

    <div
      v-if="isLoading"
      class="p-dashboard__loading"
    >
      <loading-spinner />
    </div>

    <div
      v-else-if="displayedShows.length > 0"
      class="p-dashboard__shows"
    >
      <show-card
        v-for="show in displayedShows"
        :key="show.id"
        :show="show"
      />
    </div>

    <div
      v-else
      class="p-dashboard__empty"
    >
      <p v-text="t('not.found')" />
    </div>

    <page-footer />
  </div>
</template>

<script lang="ts" setup>
import type { Show } from '@/types'
import { Icon } from '@iconify/vue'
import { useLocale } from '@/locales'
import { useShowsStore } from '@/stores'
import TopBar from '@/components/TopBar.vue'
import PageFooter from '@/components/PageFooter.vue'
import ShowCard from '@/components/Dashboard/ShowCard.vue'
import SearchBar from '@/components/Dashboard/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { ref, computed, onMounted, useTemplateRef } from 'vue'
import GenreButton from '@/components/Dashboard/GenreButton.vue'

const { t } = useLocale()
const store = useShowsStore()

const container = useTemplateRef<HTMLElement | null>('container')

const isLoading = ref<boolean>(true)
const isSorted = ref<boolean | null>(null)
const searchQuery = ref<string | null>(null)
const selectedGenre = ref<string | null>(null)
const filteredShows = ref<Show[]>([])

const shows = computed((): Show[] => store.shows)
const genres = computed((): string[] => store.getGenres)

const sortIcon = computed((): string => {
  return `tv-${isSorted.value ? 'sort-desc' : 'sort'}`
})

const displayedShows = computed((): Show[] => {
  let displayed = filteredShows.value.length > 0 ? filteredShows.value : shows.value

  if (isSorted.value) {
    displayed = [...displayed].sort((a, b) => {
      const ratingA = a.rating.average || 0
      const ratingB = b.rating.average || 0
      return ratingB - ratingA
    })
  }

  return displayed
})

const filterByGenre = (genre: string): void => {
  selectedGenre.value = genre
  searchQuery.value = ''
  filteredShows.value = shows.value.filter((show) => show.genres.includes(genre))
}

const clearFilters = (): void => {
  selectedGenre.value = null
  searchQuery.value = ''
  filteredShows.value = []
}

const selectGenre = (genre: string): void => {
  if (selectedGenre.value === genre) {
    clearFilters()
  } else {
    filterByGenre(genre)
  }
}

const handleSearch = (query: string): void => {
  isLoading.value = true
  store.searchShows(query).finally(() => (isLoading.value = false))
}

const scrollGenres = (direction: 'left' | 'right'): void => {
  if (container.value) {
    const scrollAmount = direction === 'right' ? 200 : -200
    const scrollPosition = container.value.scrollLeft + scrollAmount

    container.value.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
  }
}

onMounted((): void => {
  store.fetchShows().finally(() => (isLoading.value = false))
})
</script>

<style lang="scss" scoped>
.p-dashboard {
  margin: 24px auto 0;
  padding: 24px;
  max-width: 1400px;

  &__header {
    margin: 32px 0;
    text-align: center;

    h1 {
      margin: 0 0 8px 0;
      font-size: 48px;
      font-weight: 700;
      color: #e0e0e0;
    }
  }

  &__subtitle {
    margin: 0;
    font-size: 18px;
    color: #888;
  }

  &__search-section {
    display: flex;
    margin-bottom: 32px;
    gap: 16px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__sort-button {
    display: flex;
    padding: 12px 20px;
    align-items: center;
    gap: 8px;
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

  &__genres-section {
    margin-bottom: 32px;
    position: relative;
  }

  &__genres {
    display: flex;
    padding: 8px 0;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #3a3a3a #1a1a1a;

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #1a1a1a;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #3a3a3a;
      border-radius: 4px;

      &:hover {
        background: #4a4a4a;
      }
    }
  }

  &__genre-scroll-button {
    display: flex;
    position: absolute;
    top: 50%;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    background-color: rgba(42, 42, 42, 0.9);
    border: 1px solid #3a3a3a;
    border-radius: 50%;
    transition: all 0.2s ease;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 1;

    &:hover {
      background-color: rgba(58, 58, 58, 0.9);
    }

    &--left {
      left: -40px;
    }

    &--right {
      right: -40px;
    }
  }

  &__shows {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
  }

  &__loading {
    display: flex;
    padding: 64px 0;
    justify-content: center;
  }

  &__empty {
    padding: 64px 0;
    text-align: center;
    color: #666;
    font-size: 18px;
  }
}

@media (min-width: 320px) and (max-width: 479px) {
  .p-dashboard {
    &__header {
      h1 {
        font-size: 24px;
      }
    }

    &__genre-scroll-button {
      display: none;
    }

    &__shows {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (min-width: 480px)  and (max-width: 767px) {
  .p-dashboard {
    padding: 16px;

    &__header {
      margin-bottom: 24px;

      h1 {
        font-size: 36px;
      }
    }

    &__subtitle {
      font-size: 16px;
    }

    &__search-section {
      margin-bottom: 24px;
    }

    &__sort-button {
      padding: 10px 16px;
      font-size: 13px;
    }

    &__genres-section {
      margin-bottom: 24px;
    }

    &__genre-scroll-button {
      display: none;
    }

    &__shows {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .p-dashboard {
      &__shows {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px;
      }
    }
  }
}
</style>
