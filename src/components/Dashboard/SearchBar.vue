<template>
  <section class="c-search-bar">
    <input
      v-model="searchQuery"
      :placeholder="t('search.placeholder')"
      type="text"
      class="c-search-bar__input"
      @keydown="handleKeydown"
    >

    <button
      class="c-search-bar__button"
      aria-label="Search"
      @click="handleSearch"
    >
      <icon
        icon="tv-search"
        width="20"
      />
    </button>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocale } from '@/locales'

defineOptions({ name: 'SearchBar' })
const emits = defineEmits<{
  (e: 'on-search', query: string): void
}>()

const { t } = useLocale()

const searchQuery = ref<string>('')

const handleSearch = (): void => {
  if (searchQuery.value.trim()) {
    emits('on-search', searchQuery.value.trim())
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<style lang="scss" scoped>
.c-search-bar {
  display: flex;
  width: 100%;
  max-width: 600px;
  gap: 8px;

  &__input {
    flex: 1;
    background-color: #1a1a1a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    color: #e0e0e0;
    transition: border-color 0.2s ease;

    &::placeholder {
      color: #666;
    }

    &:focus {
      border-color: #4a4a4a;
      outline: none;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    color: #e0e0e0;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: #3a3a3a;
      border-color: #4a4a4a;
    }
  }
}

@media (min-width: 320px) {
  .c-search-bar {
    &__input {
      padding: 10px 14px;
      font-size: 13px;
    }

    &__button {
      padding: 10px 16px;
    }
  }
}

@media (min-width: 768px) {
  .c-search-bar {
    &__input {
      padding: 12px 16px;
      font-size: 14px;
    }
    &__button {
      padding: 12px 20px;
    }
  }
}
</style>
