<script setup lang="ts">
import { MetronomeCodeBlockParameters } from "../main";
import Button from "./Button.vue";
import MuteToggle from "./MuteToggle.vue";
import MetronomeToggle from "./MetronomeToggle.vue";
import { ref, watch, toRefs, onBeforeUnmount } from "vue";
import MetronomeIcon from "../components/MetronomeIcon.vue";
import StyleLine from "../components/StyleLine.vue";
import { playTick, playTickUpbeat, playTock, playSynth } from "../sounds";
import { useTick } from "../hooks/useTick";
import { useParentMarkdownWrapperVisibilityWatcher } from "../hooks/useParentMarkdownWrapperVisibilityWatcher";
import { useCSSAnimationSynchronizer } from "../hooks/useCSSAnimationSynchronizer";

const props = defineProps<{
  bpm: MetronomeCodeBlockParameters["bpm"];
  muted: MetronomeCodeBlockParameters["muted"];
  meter: MetronomeCodeBlockParameters["meter"];
  size: MetronomeCodeBlockParameters["size"];
  style: MetronomeCodeBlockParameters["style"];
  autoStart: MetronomeCodeBlockParameters["autoStart"];
  instrument: MetronomeCodeBlockParameters["instrument"];
  tickNotes: MetronomeCodeBlockParameters["tickNotes"];
  tockNotes: MetronomeCodeBlockParameters["tockNotes"];
}>();

const metronome = ref<HTMLElement>(null);
const muted = ref(props.muted);
const started = ref(props.autoStart ?? true);
const tickColor = ref("");
const { meter } = toRefs(props);
const { doBeat, onBeat, onTick, onTickAlternate, onTock, resetTick } =
  useTick(meter);
const parentWrapperIsVisible =
  useParentMarkdownWrapperVisibilityWatcher(metronome);

const haltAnimationStyle = useCSSAnimationSynchronizer({
  synchronizeElement: metronome,
  onBeat,
});

// Do sounds
onTick(
  () =>
    !muted.value &&
    (props.instrument === "click"
      ? playTick()
      : playSynth(props.tickNotes, props.instrument))
);
onTickAlternate(
  () =>
    !muted.value &&
    (props.instrument === "click"
      ? playTickUpbeat()
      : playSynth(props.tockNotes, props.instrument))
);
onTock(
  () =>
    !muted.value &&
    (props.instrument === "click"
      ? playTock()
      : playSynth(props.tockNotes, props.instrument))
);

const emit = defineEmits(["didCreateInterval"]);
const interval = ref(null);

const startInterval = () =>
  (interval.value = window.setInterval(
    doBeat,
    props.bpm.getBeatDurationSeconds(meter) * 1000
  ));

const stopInterval = () => clearInterval(interval.value);

watch(
  [started, parentWrapperIsVisible],
  () => {
    if (started.value && parentWrapperIsVisible.value) {
      startInterval();
    } else {
      stopInterval();
    }
  },
  { immediate: true }
);

onBeforeUnmount(stopInterval);

// Do visuals
onTick(() => (tickColor.value = "var(--text-accent)"));
onTock(() => (tickColor.value = "var(--text-faint)"));
</script>

<template>
  <div
    ref="metronome"
    class="metronome"
    :style="{
      '--tick-color': tickColor,
      '--metronome-duration': `${bpm.getBeatDurationSeconds(meter)}s`,
      ...haltAnimationStyle,
    }"
    :data-size="props.size"
    :data-started="started"
  >
    <button
      class="toggle-on-off-button"
      :aria-label="started ? 'Stop metronome' : 'Start metronome'"
      aria-label-position="top"
      @click="started = !started"
    ></button>
    <div class="styleContainer">
      <MetronomeIcon
        v-if="props.style === 'pendulum'"
        style="
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          color: var(--text-normal);
        "
        :swinging="started"
        :on-beat="onBeat"
      />
      <StyleLine
        v-else-if="props.style === 'line'"
        :swinging="started"
        :on-beat="onBeat"
      />
    </div>
    <div class="content">
      <MuteToggle v-model="muted" :size="props.size" @unmuted="resetTick" />
      <div class="description">
        <MetronomeIcon
          :swinging="started"
          :on-beat="onBeat"
          class="microphone-icon"
        />
        <span v-if="bpm.isSuperFast()">🔥</span> {{ bpm }}
        {{ meter && "&middot;" }} {{ meter }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$metronome-resting-background-color: var(--background-primary-alt);
.metronome {
  z-index: 0;
  border-radius: 0.25rem;
  animation: metronome-pulse var(--metronome-duration) var(--sync-delay, "0s")
    infinite;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.68rem;
  background-color: $metronome-resting-background-color;
  color: var(--text-normal);

  .toggle-on-off-button {
    /* using !important because some themes may try to override these */
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    cursor: pointer;
    z-index: 1;
    transition: background-color 100ms;

    &:hover {
      background-color: rgba(150, 150, 150, 0.1);
    }
  }

  &[data-started="false"] {
    background: var(--scrollbar-bg);
    animation: none;
  }

  @keyframes metronome-pulse {
    0% {
      background-color: var(--tick-color);
    }

    100% {
      background-color: $metronome-resting-background-color;
    }
  }

  /* Sizes: ["small" (default), "medium", "large"] */
  &[data-size="small"] {
    .microphone-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.25rem;
    }
  }

  &[data-size="medium"] {
    height: 6rem;
    align-items: flex-end;
    font-size: 0.8rem;

    .microphone-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &[data-size="large"] {
    height: 15rem;
    align-items: flex-end;
    font-size: 0.8rem;

    .microphone-icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &[data-size="xlarge"] {
    height: 18rem;
    align-items: flex-end;
    font-size: 1rem;

    .microphone-icon {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  .content {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;

    /* background color with opacity */
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: var(--background-secondary);
      opacity: 0.1;
      z-index: -1;
    }
  }

  .description {
    font-weight: bold;
    padding: 0 0.25rem 0 0;
    line-height: 1;
    color: var(--text-normal);
    opacity: 0.8;
    display: flex;
    align-items: center;
  }

  .styleContainer {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
</style>