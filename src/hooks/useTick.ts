import { computed, Ref, ref, watch } from "vue";
import { Meter } from "../models/Meter";

export function useTick(meter: Ref<Meter>) {
	const beatCount = ref(-1);
	const doBeat = () => beatCount.value++;
	const resetAfterNextBeat = ref(false);

	const resetTick = () => (resetAfterNextBeat.value = true);

	const currentBeat = computed(() =>
		meter.value?.isValid()
			? beatCount.value % meter.value.upper
			: beatCount.value % 2
	);

	const currentBeatIsTick = computed(
		() =>
			// Every beat is a tick if we don't have a valid meter
			!meter.value || !meter.value.isValid() || currentBeat.value === 0
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
	const onBeatCallbacks: CallableFunction[] = [];
	const onNextBeatOnlyCallbacks: CallableFunction[] = [];

	const onTick = (callback: CallableFunction) => {
		onTickCallbacks.push(callback);
	};

	const onTickAlternate = (callback: CallableFunction) =>
		onTickAlternateCallbacks.push(callback);

	const onTock = (callback: CallableFunction) =>
		onTockCallbacks.push(callback);

	const onBeat = (callback: CallableFunction) =>
		onBeatCallbacks.push(callback);

	const onNextBeatOnly = (callback: CallableFunction) =>
		onNextBeatOnlyCallbacks.push(callback);

	const runCallbacks = (callbacks: CallableFunction[]) =>
		callbacks.forEach((callback) => callback());

	watch(beatCount, () => {
		runCallbacks(onBeatCallbacks);

		if (resetAfterNextBeat.value) {
			beatCount.value = 0;
			resetAfterNextBeat.value = false;
		}

		if (onNextBeatOnlyCallbacks.length) {
			runCallbacks(onNextBeatOnlyCallbacks);

			// We are only running these once, so clear the array
			onNextBeatOnlyCallbacks.length = 0;
		}
	});

	watch([currentBeatIsTick, beatCount], ([currentBeatIsTick]) => {
		if (resetAfterNextBeat.value) {
			return;
		}

		if (currentBeatIsTick) {
			runCallbacks(onTickCallbacks);
		}
	});

	watch(
		[currentBeatIsTickAlternate, beatCount],
		([currentBeatIsTickAlternate]) => {
			if (resetAfterNextBeat.value) {
				return;
			}

			if (currentBeatIsTickAlternate) {
				runCallbacks(onTickAlternateCallbacks);
			}
		}
	);

	watch([currentBeatIsTock, beatCount], ([currentBeatIsTock]) => {
		if (resetAfterNextBeat.value) {
			return;
		}

		if (currentBeatIsTock) {
			runCallbacks(onTockCallbacks);
		}
	});

	return {
		doBeat,
		onBeat,
		onNextBeatOnly,
		onTick,
		onTickAlternate,
		onTock,
		resetTick,
		currentBeat,
	};
}
