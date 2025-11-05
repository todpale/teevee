<template>
  <button
    :class="{ 'c-genre-button--active': isActive }"
    class="c-genre-button"
    @click="emits('on-click', genre)"
  >
    {{ genre }}
  </button>
</template>

<script lang="ts" setup>
interface Props {
  genre: string;
  isActive?: boolean;
}

defineOptions({ name: 'GenreButton' })
const emits = defineEmits<{
  (e: 'on-click', genre: string): void
}>()
defineProps<Props>()
</script>

<style lang="scss" scoped>
.c-genre-button {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #3a3a3a;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
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

@media (min-width: 320px) {
  .c-genre-button {
    padding: 8px 16px;
    font-size: 13px;
  }
}

@media (min-width: 768px) {
  .c-genre-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
