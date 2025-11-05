<template>
  <section :class="['c-top-bar', scrolledClass]">
    <div class="c-top-bar__logo">
      <img
        src="/logo.png"
        alt="logo"
      >

      <span
        class="c-top-bar__title"
        v-text="t('app.name')"
      />
    </div>

    <a
      href="https://github.com/todpale/teevee"
      target="_blank"
      class="c-top-bar__link"
    >
      <icon icon="tv-github" />
    </a>
  </section>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useLocale } from '@/locales'
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'TopBar' })

const { t } = useLocale()

const isScrolled = ref<boolean>(false)

const scrolledClass = computed((): string => {
  return isScrolled.value
    ? 'c-top-bar--scrolled'
    : 'c-top-bar--top'
})

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.c-top-bar {
  display: flex;
  position: fixed;
  top: 0;
  left: 50%;
  padding: 12px 24px;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  background-color: transparent;
  transform: translate(-50%);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  z-index: 2;

  @media (min-width: 320px) {
    width: 100%;
  }

  @media (min-width: 1024px) {
    border-color: #E5E7EB;
  }

  @media (min-width: 1600px) {
    width: 1400px;
  }

  &--top {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  &--scrolled {
    top: 8px;
    background-color: rgba(0, 0, 0, 90%);
    box-shadow: inset 0 -2px 15px 0 rgba(255, 255, 255, 0.35);
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      width: 40px;
      height: 40px;
      filter: invert(100%);
    }
  }

  &__title {
    font-family: 'ZenDots', sans-serif;
    font-size: 32px;
    color: #fff;
  }

  &__link {
    font-size: 24px;
  }
}
</style>
