<script setup lang="ts">
import { MetronomeCodeBlockParameters } from "../main";
import Button from "./Button.vue";
import MuteToggle from "./MuteToggle.vue";
import MetronomeToggle from "./MetronomeToggle.vue";
import { ref, watch, toRefs, onBeforeUnmount } from "vue";
import MetronomeIcon from "../components/MetronomeIcon.vue";
import StyleLine from "../components/StyleLine.vue";
import {
  tick as playTick,
  tickUpbeat as playTickUpbeat,
  tock as playTock,
  beep as playBeep,
} from "../sounds";
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
  sound: MetronomeCodeBlockParameters["sound"];
  beepTick: MetronomeCodeBlockParameters["beepTick"];
  beepTock: MetronomeCodeBlockParameters["beepTock"];
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
onTick(() => (tickColor.value = "rgba(168, 8, 8, 1)"));
onTock(() => (tickColor.value = "rgba(100, 100, 100, .75)"));
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
        style="position: absolute; top: 0; right: 0; bottom: 0; left: 0"
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
      <Button disabled style="width: 1.5rem; padding-left: 0; padding-right: 0">
        <MetronomeIcon :swinging="started" :on-beat="onBeat" />
      </Button>
      <span class="description"
        ><span v-if="bpm.isSuperFast()">🔥</span> {{ bpm }}
        {{ meter && "&middot;" }} {{ meter }}</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

  .toggle-on-off-button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: none;
    border: none;
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
    padding: 0 0.25rem 0 0;
    opacity: 0.5;
  }

  .styleContainer {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
</style>