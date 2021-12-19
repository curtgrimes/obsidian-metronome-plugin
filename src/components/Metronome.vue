<script setup lang="ts">
import { MetronomeCodeBlockParameters } from "../main";
import MuteToggle from "./MuteToggle.vue";
import MetronomeToggle from "./MetronomeToggle.vue";
import { computed, ref, watch, nextTick, toRefs } from "vue";

import {
  tick as playTick,
  tickUpbeat as playTickUpbeat,
  tock as playTock,
  beep as playBeep,
} from "../sounds";
import { useTick } from "../hooks/useTick";
import { MetronomeBPM } from "../models/MetronomeBPM";

const props = defineProps<{
  bpm: MetronomeCodeBlockParameters["bpm"];
  muted: MetronomeCodeBlockParameters["muted"];
  meter: MetronomeCodeBlockParameters["meter"];
  size: MetronomeCodeBlockParameters["size"];
  autoStart: MetronomeCodeBlockParameters["autoStart"];
  sound: MetronomeCodeBlockParameters["sound"];
  beepTick: MetronomeCodeBlockParameters["beepTick"];
  beepTock: MetronomeCodeBlockParameters["beepTock"];
}>();

const muted = ref(props.muted);
const started = ref(props.autoStart ?? true);
const tickColor = ref("");
const { meter } = toRefs(props);
const { doBeat, onTick, onTickAlternate, onTock, resetTick } = useTick(meter);

// Do sounds
onTick(
  () =>
    !muted.value &&
    (props.sound === "beep" ? playBeep(props.beepTick) : playTick())
);
onTickAlternate(
  () =>
    !muted.value &&
    (props.sound === "beep" ? playBeep(props.beepTick) : playTickUpbeat())
);
onTock(
  () =>
    !muted.value &&
    (props.sound === "beep" ? playBeep(props.beepTock) : playTock())
);

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
      '--metronome-duration': `${bpm.getBeatDurationSeconds(meter)}s`
    }"
    :data-size="props.size"
    :data-started="started"
    @animationiteration="(e) => e.animationName === 'metronome-pulse' && doBeat()"
  >
    <div class="metronome-content">
      <MetronomeToggle v-model="started" />
      <span class="metronome-description"><span v-if="bpm.isSuperFast()">🔥</span> {{bpm}} {{meter && '&middot;'}} {{meter}}</span>
      <MuteToggle
        v-if="started"
        v-model="muted"
        @unmuted="resetTick"
      />
    </div>
  </div>
</template>
