<template>
  <router-link
    :to="`/show/${show.id}`"
    class="c-show-card"
  >
    <div class="c-show-card__image-container">
      <img
        :src="imageUrl"
        :alt="show.name"
        class="c-show-card__image"
      >
    </div>

    <div class="c-show-card__content">
      <h3 class="c-show-card__title">
        {{ show.name }}
      </h3>

      <div class="c-show-card__meta">
        <span class="c-show-card__rating">★ {{ rating }}</span>

        <span class="c-show-card__genre">{{ primaryGenre }}</span>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale } from '@/locales'
import { RouterLink } from 'vue-router'
import type { Show } from '@/types/shows.ts'

interface Props {
  show: Show
}

const props = defineProps<Props>()

const { t } = useLocale()

const imageUrl = computed((): string => {
  return props.show.image?.medium || './placeholder.webp'
})

const rating = computed((): string => {
  const average = props.show?.rating?.average
  return average ? average.toFixed(1) : t('not.applicable')
})

const primaryGenre = computed((): string => {
  return props.show?.genres?.[0] || t('basic.unknown')
})
</script>

<style lang="scss" scoped>
.c-show-card {
  display: block;
  height: 100%;
  background-color: #1a1a1a;
  color: inherit;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &__image-container {
    width: 100%;
    background-color: #2a2a2a;
    aspect-ratio: 2/3;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__title {
    margin: 0 0 8px 0;
    font-weight: 600;
    color: #e0e0e0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999;
  }

  &__rating {
    color: #f5c518;
    font-weight: 500;
  }

  &__genre {
    color: #888;
  }
}

@media (min-width: 320px) {
  .c-show-card {
    &__content {
      padding: 12px;
    }

    &__title {
      font-size: 14px;
    }

    &__meta {
      font-size: 12px;
    }
  }
}

@media (min-width: 768px) {
  .c-show-card {
    &__content {
      padding: 16px;
    }

    &__title {
      font-size: 16px;
    }

    &__meta {
      font-size: 14px;
    }
  }
}
</style>
