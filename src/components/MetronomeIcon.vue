<script setup lang="ts">
import { useCSSAnimationSynchronizer } from "src/hooks/useCSSAnimationSynchronizer";
import { ref } from "vue";
const props = defineProps<{
  swinging?: Boolean;
  onBeat: CallableFunction;
}>();

const metronomeIconElement = ref(null);
const pendulum = ref(null);

const haltAnimationStyle = useCSSAnimationSynchronizer({
  synchronizeElement: pendulum,
  onBeat: props.onBeat,
  observeVisibilityElement: metronomeIconElement,
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="currentColor"
    viewBox="0 0 16 16"
    ref="metronomeIconElement"
  >
    <path
      d="M9.867,2.646C9.832,2.47 9.695,2.333 9.52,2.295C8.507,2.08 7.494,2.083 6.482,2.295C6.306,2.332 6.168,2.47 6.133,2.646L3.998,13.175C3.971,13.307 4.005,13.445 4.091,13.549C4.176,13.654 4.304,13.715 4.439,13.715L11.561,13.715C11.696,13.715 11.824,13.654 11.909,13.549C11.995,13.445 12.029,13.307 12.002,13.175L9.867,2.646ZM10.492,10.257L11.01,12.815C11.01,12.815 4.99,12.815 4.99,12.815L5.508,10.257L10.492,10.257ZM10.309,9.357L5.691,9.357L6.954,3.122C7.651,3.008 8.348,3.006 9.045,3.121L9.045,3.121L10.309,9.357Z"
    />
    <g transform="matrix(1,0,0,0.972522,4.29531,0.0786472)">
      <path
        d="M4.155,9.891L4.155,3.157C4.155,2.902 3.953,2.694 3.705,2.694C3.456,2.694 3.255,2.902 3.255,3.157L3.255,9.891C3.255,10.147 3.456,10.354 3.705,10.354C3.953,10.354 4.155,10.147 4.155,9.891Z"
        :class="['pendulum', { swinging }]"
        ref="pendulum"
        :style="{ ...haltAnimationStyle }"
      />
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.metronome-metronome[data-started="false"] .pendulum {
  animation: none;
}

.pendulum {
  transform-origin: bottom;
  transform-box: fill-box;

  &.swinging {
    animation: pendulum-swing calc(var(--metronome-duration) * 2)
      calc(calc(var(--metronome-duration) / -2) + var(--sync-delay, "0s"))
      infinite cubic-bezier(0.65, 0, 0.35, 1);
  }
}

@keyframes pendulum-swing {
  0%,
  100% {
    transform: rotate(-30deg);
  }

  50% {
    transform: rotate(30deg);
  }
}
</style>