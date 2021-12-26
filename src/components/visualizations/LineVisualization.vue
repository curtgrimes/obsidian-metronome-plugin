<script setup lang="ts">
import { ref } from "vue";
import { useCSSAnimationSynchronizer } from "../../hooks/useCSSAnimationSynchronizer";

const props = defineProps<{
	started?: Boolean;
	onBeat: CallableFunction;
}>();

const line = ref(null);

const { haltAnimationStyle } = useCSSAnimationSynchronizer({
	synchronizeElement: line,
	onBeat: props.onBeat,
});
</script>

<template>
	<div style="position: relative; width: 100%; height: 100%">
		<div
			class="line"
			:class="{ started }"
			ref="line"
			:style="{ ...haltAnimationStyle }"
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
	background: var(--text-normal);
	border-radius: 10rem;

	&.started {
		animation: pendulum-swing calc(var(--metronome-duration) * 2)
			var(--sync-delay, "0s") infinite linear;
	}
}

@keyframes pendulum-swing {
	0%,
	100% {
		left: calc(100% - #{$width});
	}

	2%,
	48%,
	52%,
	98% {
		/* If I want to have an effect right before it hits an edge */
	}

	50% {
		left: 0%;
	}
}
</style>
