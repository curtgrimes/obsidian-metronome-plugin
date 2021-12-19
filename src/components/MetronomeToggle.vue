<script setup>
import { watch } from "vue";
import MetronomeIcon from "./MetronomeIcon.vue";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <button
    :class="{'enabled': props.modelValue}"
    @click="emit('update:modelValue', !props.modelValue)"
    v-tooltip="props.modelValue ? 'Stop metronome' : 'Start metronome'"
  >
    <MetronomeIcon />
  </button>
</template>