<script setup lang="ts">
import { watch } from "vue";
import VolumeUpIcon from "../assets/icons/volume-up.svg";
import VolumeMuteIcon from "../assets/icons/volume-mute.svg";
import Button from "./Button.vue";
import type { MetronomeSize } from "../models/MetronomeSize";

const props = defineProps<{
  modelValue?: Boolean;
  size: MetronomeSize;
}>();

const emit = defineEmits(["update:modelValue", "muted", "unmuted"]);

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue) {
      emit("muted");
    } else {
      emit("unmuted");
    }
  }
);
</script>

<template>
  <Button
    :class="{ enabled: props.modelValue }"
    @click="emit('update:modelValue', !props.modelValue)"
    :aria-label="props.modelValue ? 'Unmute' : 'Mute'"
    v-bind="{ size: props.size }"
    v-html="props.modelValue ? VolumeMuteIcon : VolumeUpIcon"
  />
</template>