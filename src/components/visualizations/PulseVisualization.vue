<script setup lang="ts">
import { useCSSAnimationSynchronizer } from "../../hooks/useCSSAnimationSynchronizer";
import { ref } from "vue";
const props = defineProps<{
	started: boolean;
	onBeat: CallableFunction;
	onTick: CallableFunction;
	onTock: CallableFunction;
}>();

const rootElement = ref(null);
const tickColor = ref("");

const { haltAnimationStyle } = useCSSAnimationSynchronizer({
	synchronizeElement: rootElement,
	onBeat: props.onBeat,
});

props.onTick(() => (tickColor.value = "var(--text-accent)"));
props.onTock(() => (tickColor.value = "var(--text-faint)"));
</script>

<template>
	<div
		class="pulse"
		ref="rootElement"
		:style="{
			'--tick-color': tickColor,
		}"
		:data-started="props.started"
	></div>
</template>

<style lang="scss" scoped>
$metronome-resting-background-color: var(--background-primary-alt);
.pulse {
	z-index: -1;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: $metronome-resting-background-color;
	animation: metronome-pulse var(--metronome-duration) var(--sync-delay, "0s")
		infinite;

	@keyframes metronome-pulse {
		0% {
			background-color: var(--tick-color);
		}

		65%,
		100% {
			background-color: $metronome-resting-background-color;
		}
	}

	&[data-started="false"] {
		background: var(--scrollbar-bg);
		animation: none;
	}
}
</style>
