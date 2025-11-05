<template>
  <section class="c-loading-spinner">
    <div class="spinner" />
  </section>
</template>

<script lang="ts" setup>
defineOptions({ name: 'LoadingSpinner' })
</script>

<style lang="scss" scoped>
.c-loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #2a2a2a;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
