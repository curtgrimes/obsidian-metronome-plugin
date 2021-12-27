<script setup lang="ts">
import { MetronomeCodeBlockParameters } from "../main";
import OverlayToggle from "./OverlayToggle.vue";
import Controls from "./Controls.vue";
import Status from "./Status.vue";
import MuteToggle from "./MuteToggle.vue";
import Visualization from "./visualizations/Visualization.vue";
import {
	ref,
	watch,
	toRefs,
	onBeforeUnmount,
	CSSProperties,
	computed,
	Ref,
	StyleValue,
} from "vue";
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
const { meter } = toRefs(props);
const {
	doBeat,
	onBeat,
	onTick,
	onTickAlternate,
	onTock,
	resetTick,
	currentBeat,
} = useTick(meter);
const parentWrapperIsVisible =
	useParentMarkdownWrapperVisibilityWatcher(metronome);

const { haltAnimationStyle } = useCSSAnimationSynchronizer({
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
</script>

<template>
	<div
		ref="metronome"
		class="metronome"
		:style="{
			'--metronome-duration': `${props.bpm.getBeatDurationSeconds(
				meter
			)}s`,
			...haltAnimationStyle,
		}"
		:data-size="props.size"
		:data-started="started"
	>
		<OverlayToggle :started="started" @click="started = !started" />
		<Visualization
			:visualization="props.style"
			:started="started"
			:on-beat="onBeat"
			:meter="props.meter"
			:current-beat="currentBeat"
			:size="props.size"
			:on-tick="onTick"
			:on-tock="onTock"
		/>
		<Controls
			:started="started"
			:on-beat="onBeat"
			:on-tick="onTick"
			:on-tock="onTock"
		>
			<MuteToggle
				v-model="muted"
				:size="props.size"
				@unmuted="resetTick"
			/>
			<Status
				:started="started"
				:onBeat="onBeat"
				:bpm="bpm"
				:meter="meter"
				:size="props.size"
			/>
		</Controls>
	</div>
</template>

<style lang="scss" scoped>
$metronome-resting-background-color: var(--background-primary-alt);
.metronome {
	z-index: 0;
	border-radius: 0.25rem;
	overflow: hidden;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	font-size: 0.68rem;
	background-color: $metronome-resting-background-color;
	color: var(--text-normal);

	/* Sizes: ["small" (default), "medium", "large"] */
	&[data-size="medium"] {
		height: 6rem;
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
}
</style>
