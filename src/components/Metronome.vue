<script setup lang="ts">
import { MetronomeCodeBlockParameters } from "../main";
import SoundToggle from "./SoundToggle.vue";
import MetronomeToggle from "./MetronomeToggle.vue";
import { computed, ref, watch, nextTick, toRefs } from "vue";
import { BPM, NoteDuration } from "@vapurrmaid/bpm";
import {
  tick as playTick,
  tickUpbeat as playTickUpbeat,
  tock as playTock,
} from "../sounds";
import { useTick } from "../hooks/useTick";

const props = defineProps<{
  bpm: MetronomeCodeBlockParameters["bpm"];
  sound: MetronomeCodeBlockParameters["sound"];
  meter: MetronomeCodeBlockParameters["meter"];
  size: MetronomeCodeBlockParameters["size"];
  autoStart: MetronomeCodeBlockParameters["autoStart"];
}>();

const soundOn = ref(props.sound);
const started = ref(props.autoStart ?? true);
const tickColor = ref("");
const { meter } = toRefs(props);
const { doBeat, onTick, onTickAlternate, onTock, resetTick } = useTick(meter);
const metronomeDurationSeconds = computed(() =>
  new BPM(props.bpm).durationFor(
    (props.meter && props.meter.noteDuration()) || "quarter"
  )
);

// Do sounds
onTick(() => soundOn.value && playTick());
onTickAlternate(() => soundOn.value && playTickUpbeat());
onTock(() => soundOn.value && playTock());

// Do visuals
onTick(() => (tickColor.value = "rgba(168, 8, 8, 1)"));
onTock(() => (tickColor.value = "rgba(100, 100, 100, .75)"));
</script>

<template>
  <div
    :class="[
      'metronome-metronome',
    ]"
    :style="{
      '--tick-color': tickColor,
      '--metronome-duration': `${metronomeDurationSeconds}s`
    }"
    :data-size="props.size"
    :data-started="started"
    @animationiteration="(e) => e.animationName === 'metronome-pulse' && doBeat()"
  >
    <div class="metronome-content">
      <MetronomeToggle v-model="started" />
      <span class="metronome-description"><span v-if="bpm >= 500">🔥</span> {{bpm}} BPM {{meter && '&middot;'}} {{meter}}</span>
      <SoundToggle
        v-if="started"
        v-model="soundOn"
        @soundOn="resetTick"
      />
    </div>
  </div>
</template>
