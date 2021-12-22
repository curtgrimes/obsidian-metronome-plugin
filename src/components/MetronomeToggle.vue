<script setup lang="ts">
import { watch } from "vue";
import MetronomeIcon from "./MetronomeIcon.vue";
import Button from "./Button.vue";
import type { MetronomeSize } from "../models/MetronomeSize";

const props = defineProps<{
  modelValue: Boolean;
  size?: MetronomeSize;
  onBeat: CallableFunction;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <Button
    :class="{'enabled': props.modelValue}"
    @click="emit('update:modelValue', !props.modelValue)"
    :aria-label="props.modelValue ? 'Stop metronome' : 'Start metronome'"
    v-bind="{size: props.size}"
  >
    <MetronomeIcon
      :swinging="props.modelValue"
      :on-beat="props.onBeat"
    />
  </Button>
</template>