<template>
  <div class="p-show-detail">
    <top-bar />

    <div class="p-show-detail__content">
      <button
        class="p-show-detail__back-button"
        @click="closePage"
      >
        <icon
          icon="tv-arrow-back"
          width="24"
        />

        <span v-text="t('action.back')" />
      </button>

      <loading-spinner v-if="isLoading" />

      <div
        v-else-if="show"
        class="p-show-detail__content"
      >
        <div class="p-show-detail__hero">
          <div class="p-show-detail__image-container">
            <img
              :src="imageUrl"
              :alt="show.name"
              class="p-show-detail__image"
            >
          </div>

          <div class="p-show-detail__info">
            <h1 class="p-show-detail__title">
              {{ show.name }}
            </h1>

            <details-block
              :show
              :seasons
            />
          </div>
        </div>

        <episodes-block :seasons />
      </div>
    </div>

    <page-footer />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { Show } from '@/types'
import { useLocale } from '@/locales'
import { useShowsStore } from '@/stores/'
import TopBar from '@/components/TopBar.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageFooter from '@/components/PageFooter.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import DetailsBlock from '@/components/ShowDetails/DetailsBlock.vue'
import EpisodesBlock from '@/components/ShowDetails/EpisodesBlock.vue'

const { t } = useLocale()
const router = useRouter()
const route = useRoute()
const store = useShowsStore()

const isLoading = ref<boolean>(true)

const showId = computed(() => route.params.id as string)
const show = computed((): Show => store.show)
const seasons = computed((): number[] => store.getSeasons)

const imageUrl = computed((): string => {
  return show.value?.image?.original
    || show.value?.image?.medium
    || './placeholder.webp'
})

const closePage = (): void => {
  router.push('/')
}

const fetchShow = async (): Promise<void> => {
  await store.fetchShow(showId.value)
}

const fetchEpisodes = async (): Promise<void> => {
  await store.fetchEpisodes(showId.value)
}

onMounted(async (): Promise<void> => {
  isLoading.value = true

  try {
    await Promise.all([fetchShow(), fetchEpisodes()])
  } catch (error) {
    console.error('Failed to fetch show details:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.p-show-detail {
  margin: 24px auto;
  padding: 24px;
  max-width: 1200px;

  &__content {
    margin: 32px 0;
    position: relative;
  }

  &__back-button {
    display: flex;
    position: absolute;
    left: -120px;
    padding: 10px 16px;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    color: #e0e0e0;
    transition: all 0.2s ease;
    cursor: pointer;
    z-index: 1;

    &:hover {
      background-color: #3a3a3a;
      border-color: #4a4a4a;
    }
  }

  &__hero {
    display: grid;
    margin-bottom: 48px;
    grid-template-columns: 300px 1fr;
    gap: 32px;
  }

  &__image-container {
    width: 100%;
    background-color: #2a2a2a;
    border-radius: 8px;
    aspect-ratio: 2/3;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
    display: flex;
    gap: 24px;
    flex-direction: column;
  }

  &__title {
    margin: 0;
    font-size: 42px;
    font-weight: 700;
    color: #e0e0e0;
    line-height: 1.2;
  }

  &__section-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #e0e0e0;
  }
}

@media (min-width: 320px) and (max-width: 767px) {
  .p-show-detail {
    padding: 16px;

    &__back-button {
      left: 0;

      span {
        display: none;
      }
    }

    &__hero {
      gap: 24px;
      grid-template-columns: 1fr;
    }

    &__image-container {
      margin: 0 auto;
      max-width: 300px;
    }

    &__title {
      font-size: 32px;
    }

    &__meta {
      gap: 12px;
      grid-template-columns: 1fr;
    }

    &__section-title {
      font-size: 20px;
    }

    &__episode {
      padding: 12px;
    }

    &__episode-number {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    &__episode-title {
      font-size: 14px;
    }

    &__episode-date {
      font-size: 13px;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .p-show-detail {
      &__hero {
        gap: 24px;
        grid-template-columns: 250px 1fr;
      }

      &__title {
        font-size: 36px;
      }
    }
  }
}
</style>
