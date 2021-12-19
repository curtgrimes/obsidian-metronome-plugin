<script setup>
import { watch } from "vue";
import VolumeUpIcon from "../assets/icons/volume-up.svg";
import VolumeMuteIcon from "../assets/icons/volume-mute.svg";

const props = defineProps({
  modelValue: Boolean,
});

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
  <button
    :class="{'enabled': props.modelValue}"
    @click="emit('update:modelValue', !props.modelValue)"
    v-tooltip="props.modelValue ? 'Unmute' : 'Mute'"
    v-html="props.modelValue ? VolumeMuteIcon : VolumeUpIcon"
  ></button>
</template>