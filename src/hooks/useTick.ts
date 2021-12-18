import { computed, Ref, ref, watch } from "vue";
import { Meter } from "../models/Meter";

export function useTick(meter: Ref<Meter>) {
	const beatCount = ref(-1);
	const doBeat = () => beatCount.value++;
	const resetAfterNextBeat = ref(false);

	const resetTick = () => (resetAfterNextBeat.value = true);

	const currentBeatIsTick = computed(
		() =>
			// Every beat is a tick if we don't have a valid meter
			!meter.value ||
			!meter.value.isValid() ||
			beatCount.value % meter.value.upper === 0
	);

	const currentBeatIsTickAlternate = computed(
		() =>
			meter.value &&
			meter.value.isValid() &&
			meter.value.upper >= 6 &&
			beatCount.value % (meter.value.upper / 2) === 0
	);

	const currentBeatIsTock = computed(
		() => !currentBeatIsTick.value && !currentBeatIsTickAlternate.value
	);

	const onTickCallbacks: CallableFunction[] = [];
	const onTickAlternateCallbacks: CallableFunction[] = [];
	const onTockCallbacks: CallableFunction[] = [];

	const onTick = (callback: CallableFunction) => {
		onTickCallbacks.push(callback);
	};

	const onTickAlternate = (callback: CallableFunction) =>
		onTickAlternateCallbacks.push(callback);

	const onTock = (callback: CallableFunction) =>
		onTockCallbacks.push(callback);

	watch(beatCount, () => {
		if (resetAfterNextBeat.value) {
			beatCount.value = 0;
			resetAfterNextBeat.value = false;
		}
	});

	watch([currentBeatIsTick, beatCount], ([currentBeatIsTick]) => {
		if (resetAfterNextBeat.value) {
			return;
		}

		if (currentBeatIsTick) {
			onTickCallbacks.forEach((callback) => callback());
		}
	});

	watch(
		[currentBeatIsTickAlternate, beatCount],
		([currentBeatIsTickAlternate]) => {
			if (resetAfterNextBeat.value) {
				return;
			}

			if (currentBeatIsTickAlternate) {
				onTickAlternateCallbacks.forEach((callback) => callback());
			}
		}
	);

	watch([currentBeatIsTock, beatCount], ([currentBeatIsTock]) => {
		if (resetAfterNextBeat.value) {
			return;
		}

		if (currentBeatIsTock) {
			onTockCallbacks.forEach((callback) => callback());
		}
	});

	return { doBeat, onTick, onTickAlternate, onTock, resetTick };
}
