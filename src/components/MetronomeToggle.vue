<script setup lang="ts">
import { watch } from "vue";
import MetronomeIcon from "./MetronomeIcon.vue";
import Button from "./Button.vue";
import type { MetronomeSize } from "../models/MetronomeSize";

const props = defineProps<{
  modelValue: Boolean;
  size?: MetronomeSize;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <Button
    :class="{'enabled': props.modelValue}"
    @click="emit('update:modelValue', !props.modelValue)"
    v-tooltip="props.modelValue ? 'Stop metronome' : 'Start metronome'"
    v-bind="{size: props.size}"
  >
    <MetronomeIcon :swinging="props.modelValue" />
  </Button>
</template>