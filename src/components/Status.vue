<script setup lang="ts">
import { Meter } from "../models/Meter";
import { MetronomeBPM } from "../models/MetronomeBPM";
import { MetronomeSize } from "../models/MetronomeSize";
import MetronomeVisualization from "./visualizations/MetronomeVisualization.vue";

const props = defineProps<{
	started?: Boolean;
	onBeat: CallableFunction;
	bpm: MetronomeBPM;
	meter: Meter;
	size: MetronomeSize;
}>();
</script>

<template>
	<div class="status" :data-size="size">
		<MetronomeVisualization
			:started="started"
			:onBeat="onBeat"
			class="microphone-icon"
		/>
		<span v-if="bpm.isSuperFast()">🔥</span> {{ bpm }}
		{{ meter && "&middot;" }} {{ meter }}
	</div>
</template>

<style lang="scss" scoped>
.status {
	font-weight: bold;
	padding: 0 0.25rem 0 0;
	line-height: 1;
	color: var(--text-normal);
	opacity: 0.8;
	display: flex;
	align-items: center;

	&[data-size="small"] {
		.microphone-icon {
			width: 1rem;
			height: 1rem;
			margin-right: 0.25rem;
		}
	}

	&[data-size="medium"] {
		.microphone-icon {
			width: 1.25rem;
			height: 1.25rem;
		}
	}

	&[data-size="large"] {
		.microphone-icon {
			width: 1.5rem;
			height: 1.5rem;
		}
	}

	&[data-size="xlarge"] {
		.microphone-icon {
			width: 1.75rem;
			height: 1.75rem;
		}
	}
}
</style>
