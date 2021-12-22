<script setup lang="ts">
import { ref } from "vue";
import { useCSSAnimationSynchronizer } from "src/hooks/useCSSAnimationSynchronizer";

const props = defineProps<{
  swinging?: Boolean;
  onBeat: CallableFunction;
}>();

const line = ref(null);

const haltAnimationStyle = useCSSAnimationSynchronizer({
  synchronizeElement: line,
  onBeat: props.onBeat,
});
</script>

<template>
  <div style="position:relative;width:100%;height:100%">
    <div
      class="line"
      :class="{swinging}"
      ref="line"
      :style={...haltAnimationStyle}
    ></div>
  </div>
</template>

<style lang="scss" scoped>
$width: 10px;

.line {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: $width;
  background: #fff;
  border-radius: 10rem;

  &.swinging {
    animation: pendulum-swing calc(var(--metronome-duration) * 2)
      var(--sync-delay, "0s") infinite linear;
  }
}

@keyframes pendulum-swing {
  0%,
  100% {
    left: calc(100% - #{$width});
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 30px #fff;
  }

  2%,
  48%,
  52%,
  98% {
    background: rgba(255, 255, 255, 0.4);
    box-shadow: none;
  }

  50% {
    left: 0%;
    background: rgba(255, 255, 255, 1);
  }
}
</style>