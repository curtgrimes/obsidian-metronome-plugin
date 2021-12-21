<script setup lang="ts">
import { MetronomeCodeBlockParameters } from "../main";
import MuteToggle from "./MuteToggle.vue";
import MetronomeToggle from "./MetronomeToggle.vue";
import { computed, ref, watch, nextTick, toRefs } from "vue";
import MetronomeIcon from "../components/MetronomeIcon.vue";
import StyleLine from "../components/StyleLine.vue";

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
  style: MetronomeCodeBlockParameters["style"];
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
    class="metronome"
    :style="{
      '--tick-color': tickColor,
      '--metronome-duration': `${bpm.getBeatDurationSeconds(meter)}s`
    }"
    :data-size="props.size"
    :data-started="started"
    @animationiteration="(e) => e.animationName.startsWith('metronome-pulse') && doBeat()"
  >
    <div class="style">
      <MetronomeIcon
        v-if="props.style === 'pendulum'"
        style="position: absolute;top: 0;right: 0;bottom: 0;left: 0;"
        :swinging="started"
      />
      <StyleLine
        v-else-if="props.style === 'line'"
        :swinging="started"
      />
    </div>
    <div class="content">
      <MetronomeToggle
        v-model="started"
        :size="props.size"
      />
      <span class="description"><span v-if="bpm.isSuperFast()">🔥</span> {{bpm}} {{meter && '&middot;'}} {{meter}}</span>
      <MuteToggle
        v-if="started"
        v-model="muted"
        :size="props.size"
        @unmuted="resetTick"
      />
    </div>
  </div>
</template>

<style lang="scss">
// The tooltip CSS cannot be scoped because we use it
// across the app.
@import "../assets/tooltip.scss";
</style>

<style lang="scss">
// Move the mute button slightly out of the way of the edit button that overlays
// the component in live preview mode
.is-live-preview .block-language-metronome .metronome[data-size="small"] {
  transition: margin 0.25s;

  &:hover {
    margin-right: 2rem;
  }
}
</style>

<style lang="scss" scoped>
.metronome {
  border-radius: 0.25rem;
  animation: metronome-pulse var(--metronome-duration) infinite;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.68rem;

  &[data-started="false"] {
    background: var(--scrollbar-bg);
    animation: none;
  }

  @keyframes metronome-pulse {
    0% {
      background: var(--tick-color);
    }

    100% {
      background: var(--scrollbar-bg);
    }
  }

  /* Sizes: ["small" (default), "medium", "large"] */
  &[data-size="medium"] {
    height: 4rem;
    align-items: flex-end;
    font-size: 0.8rem;
  }

  &[data-size="large"] {
    height: 15rem;
    align-items: flex-end;
    font-size: 0.8rem;
  }

  &[data-size="xlarge"] {
    height: 18rem;
    align-items: flex-end;
    font-size: 1rem;
  }

  .content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .description {
    font-weight: bold;
    margin-right: auto;
    padding: 0 0.25rem;
    opacity: 0.5;
  }

  .style {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
</style>