<script setup lang="ts">
const props = defineProps<{
  size?: "small" | "medium" | "large";
}>();
</script>

<template>
  <button
    class="button"
    :data-size="props.size || 'small'"
    v-bind="{size}"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  background: none;
  border: none;
  padding: 0.25rem;
  margin: 0;
  cursor: pointer;
  outline: 0 !important;
  box-shadow: none !important;
  border-radius: 0.2rem;
  opacity: 0.5;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &[data-size="medium"] {
    width: 2rem;
    height: 2rem;
    padding: 0.25rem;
  }

  &[data-size="large"] {
    width: 2.3rem;
    height: 2.3rem;
    padding: 0.25rem;
  }

  &[data-size="xlarge"] {
    width: 3.5rem;
    height: 3.5rem;
    padding: 0.35rem;
  }

  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover,
  &:active {
    background: rgb(100 100 100 / 30%);
  }

  &:hover,
  &:active,
  &.enabled {
    opacity: 1;
  }
}
</style>