import { onBeforeUnmount, Ref, ref, watch, computed, ComputedRef } from "vue";
import parseDuration from "parse-duration";

export function useAutoStopTimer(): {
	startAutoStopTimer: CallableFunction;
	resetAutoStopTimer: CallableFunction;
	timeLeft: Ref<number>;
	expired: ComputedRef<boolean>;
	expiringSoon: Ref<boolean>;
	autoStopDurationInvalid: Ref<boolean>;
} {
	let expireTimestampMilliseconds: number | null = null;
	const autoStopDurationInvalid = ref<boolean>(false);
	let autoStopInterval: number;
	const timeLeftSeconds = ref<number>(0);
	const expiringSoonSeconds = ref<number>(0);
	const alwaysExpiringSoon = ref<boolean>(false);
	const timerStarted = ref<boolean>(false);

	const expired = computed<boolean>(() => timeLeftSeconds.value <= 0);
	const expiringSoon = computed<boolean>(
		() =>
			timerStarted.value &&
			(alwaysExpiringSoon.value ||
				(timeLeftSeconds.value &&
					timeLeftSeconds.value < expiringSoonSeconds.value))
	);

	const getTimeLeftSeconds = (): number | null =>
		expireTimestampMilliseconds
			? (expireTimestampMilliseconds - Date.now()) / 1000
			: null;

	const runAutoStopTimerIteration = () => {
		timeLeftSeconds.value = getTimeLeftSeconds();

		if (timeLeftSeconds.value <= 0) {
			timeLeftSeconds.value = 0;
		}

		if (!expired.value) {
			// Schedule next iteration

			const offsetMillisecondsToStartTimeoutOnSecondBoundary =
				(timeLeftSeconds.value % 1) * 1000;

			autoStopInterval = window.setTimeout(
				runAutoStopTimerIteration,
				(expiringSoon.value ? 200 : 1000) +
					offsetMillisecondsToStartTimeoutOnSecondBoundary
			);
		}
	};

	const startAutoStopTimer = (
		duration: string,
		expiringSoonDuration: string
	): void => {
		resetAutoStopTimer();

		timerStarted.value = true;
		const durationMilliseconds = parseDuration(duration);
		expiringSoonSeconds.value =
			(parseDuration(expiringSoonDuration) || 10 * 1000) / 1000;
		alwaysExpiringSoon.value =
			(expiringSoonDuration || "").toUpperCase() ===
			"always".toUpperCase();

		if (durationMilliseconds === null) {
			// We were given a duration string but
			// we failed to parse it. It's invalid.
			autoStopDurationInvalid.value = true;
			return;
		}

		// We successfully got a duration
		expireTimestampMilliseconds = Date.now() + durationMilliseconds;
		runAutoStopTimerIteration();
	};

	const stopTimer = () => {
		timerStarted.value = false;
		window.clearTimeout(autoStopInterval);
	};

	const resetAutoStopTimer = (): void => {
		stopTimer();
		timeLeftSeconds.value = expireTimestampMilliseconds;
	};

	watch(expired, () => {
		if (expired.value) {
			stopTimer();
		}
	});
	onBeforeUnmount(stopTimer);

	return {
		startAutoStopTimer,
		resetAutoStopTimer,
		timeLeft: timeLeftSeconds,
		expired,
		expiringSoon,
		autoStopDurationInvalid,
	};
}
