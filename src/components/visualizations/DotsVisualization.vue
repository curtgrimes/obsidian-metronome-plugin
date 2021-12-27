<script setup lang="ts">
import { computed, ref } from "vue";
import { useCSSAnimationSynchronizer } from "../../hooks/useCSSAnimationSynchronizer";
import { Meter } from "../../models/Meter";
import { MetronomeSize } from "../../models/MetronomeSize";

const props = defineProps<{
	started?: Boolean;
	onBeat: CallableFunction;
	meter?: Meter;
	currentBeat: number;
	size: MetronomeSize;
}>();

const line = ref(null);

const { haltAnimationStyle } = useCSSAnimationSynchronizer({
	synchronizeElement: line,
	onBeat: props.onBeat,
});

// We don't want to show a lot of dots
const MAX_DOTS = 12;

const dotsCount = computed(() =>
	props.meter?.isValid() && props.meter.upper <= MAX_DOTS
		? props.meter.upper
		: 2
);

const activeIndex = computed(() => props.currentBeat % dotsCount.value);
</script>

<template>
	<div
		v-if="props.size !== 'small'"
		class="dots"
		:style="{ '--dots-count': dotsCount }"
	>
		<div
			v-for="x in dotsCount"
			:key="x"
			class="dot-wrap"
			:data-size="props.size"
		>
			<div class="dot-wrap-width-constraint">
				<div
					:class="[
						'dot',
						{
							active: started && x === activeIndex + 1,
							downbeat: x === 1,
						},
					]"
				></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dots {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	max-width: 100%;

	margin: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0 5%;

	.dot-wrap {
		max-height: 100%;
		display: flex;
		align-items: center;
		flex-grow: 0;

		&[data-size="medium"] {
			--active-scale: 0.6;
			--inactive-scale: 0.35;
			width: calc(20% / var(--dots-count, 1));
		}

		&[data-size="large"],
		&[data-size="xlarge"] {
			--active-scale: 1;
			--inactive-scale: 0.85;
			width: calc(80% / var(--dots-count, 1));
		}

		.dot-wrap-width-constraint {
			width: calc(100% - calc(80% / var(--dots-count, 1)));
			margin: 0 auto;
			aspect-ratio: 1;
			display: flex;
			align-items: center;

			.dot {
				width: 100%;
				max-height: 100%;
				background: var(--text-faint);
				aspect-ratio: 1;
				border-radius: 100%;
				transform: scale(var(--inactive-scale, 0.5));

				&.active {
					background: var(--text-accent);
					box-shadow: 0 0 0 0.5rem var(--background-primary-alt);
					transform: scale(var(--active-scale, 1));

					&.downbeat {
						box-shadow: 0 0 0 0.5rem var(--background-primary-alt),
							0 0 0 0.75rem var(--text-accent),
							0 0 0 0.75rem var(--text-faint);
						position: relative;

						&::after {
							content: "";
							position: absolute;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							transform: scale(0.5);
							border-radius: 100%;
							background-color: var(--background-primary-alt);
						}
					}
				}
			}
		}
	}
}
</style>
