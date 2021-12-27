<script setup lang="ts">
import PulseVisualization from "./visualizations/PulseVisualization.vue";

const props = defineProps<{
	started: boolean;
	onBeat: CallableFunction;
	onTick: CallableFunction;
	onTock: CallableFunction;
}>();
</script>

<template>
	<div class="controls">
		<slot />
		<PulseVisualization
			style="opacity: 0.3"
			:started="props.started"
			:on-beat="props.onBeat"
			:on-tick="props.onTick"
			:on-tock="props.onTock"
		/>
	</div>
</template>

<style lang="scss" scoped>
.controls {
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
</style>
