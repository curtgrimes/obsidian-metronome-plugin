<script setup>
import { watch } from "vue";
import VolumeUpIcon from "../assets/icons/volume-up.svg";
import VolumeMuteIcon from "../assets/icons/volume-mute.svg";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "soundOn", "soundOff"]);

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue) {
      emit("soundOn");
    } else {
      emit("soundOff");
    }
  }
);
</script>

<template>
  <button
    :class="{'enabled': props.modelValue}"
    @click="emit('update:modelValue', !props.modelValue)"
    v-tooltip="props.modelValue ? 'Mute' : 'Unmute'"
    v-html="props.modelValue ? VolumeUpIcon : VolumeMuteIcon"
  ></button>
</template>