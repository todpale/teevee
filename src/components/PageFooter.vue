<template>
  <section class="c-page-footer">
    <div>@ 2025</div>

    <div class="c-page-footer__created">
      <span v-text="t('app.created')" />

      <a
        href="https://vuejs.org/?uwu"
        target="_blank"
      >
        <img src="/vue-logo.png">
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useLocale } from '@/locales'

defineOptions({ name: 'PageFooter' })

const { t } = useLocale()
</script>

<style lang="scss" scoped>
.c-page-footer {
  display: flex;
  gap: 24px;
  justify-content: center;
  width: 100%;
  padding: 24px 0 0;

  &__created {
    display: flex;
    gap: 12px;
    align-items: center;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
