<script setup lang="ts">
import MetronomeVisualization from "./MetronomeVisualization.vue";
import LineVisualization from "./LineVisualization.vue";
import { MetronomeCodeBlockParameters } from "../../main";

const props = defineProps<{
	visualization: MetronomeCodeBlockParameters["style"];
	started?: Boolean;
	onBeat: CallableFunction;
}>();
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
	</div>
</template>

<style lang="scss" scoped>
.visualization {
	height: 100%;
	width: 100%;
	position: relative;
}
</style>
