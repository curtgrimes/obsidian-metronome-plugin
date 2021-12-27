<script setup lang="ts">
import PulseVisualization from "./PulseVisualization.vue";
import MetronomeVisualization from "./MetronomeVisualization.vue";
import LineVisualization from "./LineVisualization.vue";
import DotsVisualization from "./DotsVisualization.vue";
import { MetronomeCodeBlockParameters } from "../../main";
import { Meter } from "../../models/Meter";
import { MetronomeSize } from "../../models/MetronomeSize";

const props = defineProps<{
	visualization: MetronomeCodeBlockParameters["style"];
	started?: boolean;
	onBeat: CallableFunction;
	meter: Meter;
	currentBeat: number;
	size: MetronomeSize;
	onTick: CallableFunction;
	onTock: CallableFunction;
}>();

// We want to use the pulse background behind some of the other
// visualizations, but at different opacities.
const getPulseOpacityForOtherVisualization = (
	visualization: MetronomeCodeBlockParameters["style"]
) => {
	switch (visualization) {
		case "pendulum":
		case "line":
			return 0.6;
		case "dots":
			return 0.4;
		default:
			return 1;
	}
};
</script>

<template>
	<div class="visualization">
		<MetronomeVisualization
			v-if="props.visualization === 'pendulum'"
			style="
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				color: var(--text-normal);
			"
			:started="props.started"
			:on-beat="props.onBeat"
		/>
		<LineVisualization
			v-else-if="props.visualization === 'line'"
			:started="props.started"
			:on-beat="props.onBeat"
		/>
		<DotsVisualization
			v-else-if="props.visualization === 'dots'"
			:started="props.started"
			:on-beat="props.onBeat"
			:meter="props.meter"
			:current-beat="props.currentBeat"
			:size="size"
		/>

		<PulseVisualization
			:style="{
				opacity: getPulseOpacityForOtherVisualization(
					props.visualization
				),
			}"
			:started="props.started"
			:on-beat="props.onBeat"
			:on-tick="props.onTick"
			:on-tock="props.onTock"
		/>
	</div>
</template>

<style lang="scss" scoped>
.visualization {
	height: 100%;
	width: 100%;
	position: relative;
}
</style>
