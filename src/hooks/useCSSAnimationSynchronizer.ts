import { computed, ComputedRef, onBeforeUnmount, Ref, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

/**
 * Restart a CSS animation after an element becomes visible again according to when the onBeat
 * function fires.
 *
 *
 * @param synchronizeElement The element to synchronize. It must honor the
 * --sync-delay CSS variable in their animation like this:
 * ```
 * .myElementToSync { animation: metronome-pulse var(--metronome-duration) var(--sync-delay, "0s") infinite; }
 * ```
 * If there is already a `animation-delay` on this element, use `calc()` to
 * add the `--sync-delay` to it.
 * @param onBeat The onBeat function that runs on the beat
 * @param observeVisibilityElement If synchronizeElement cannot be observed
 * in an IntersectionObserver (for example, if it's a child inside an SVG structure),
 * then use this element instead for observation.
 *
 * @returns Ref<object> This returns an object that should be applied to the
 * element as a style. Example:
 *
 * ```ts
 * const haltAnimationStyle = useCSSAnimationSynchronizer(...);
 * <div class="metronome" :style={...haltAnimationStyle}></div>
 * ```
 */
export function useCSSAnimationSynchronizer({
	synchronizeElement,
	onBeat,
	observeVisibilityElement,
}: {
	synchronizeElement: Ref<HTMLElement>;
	onBeat: CallableFunction;
	observeVisibilityElement?: Ref<HTMLElement>;
}): { haltAnimationStyle: ComputedRef<object> } {
	// If we weren't given an element to observe visibility on, default to the given
	// elementWithAnimationToSynchronize. This will be different elements in the case
	// that we want to synchronize something inside an SVG (IntersectionObserver doesn't
	// work on things inside SVGs).

	const observeElement = observeVisibilityElement || synchronizeElement;

	const needsSync = ref(false);
	const haltAnimation = ref(false);

	// When we're halting an animation, return this style which
	// should be applied to the element to disable animation.
	const haltAnimationStyle = computed(() =>
		haltAnimation.value ? { animation: "none !important" } : {}
	);

	onBeat(() => {
		if (!needsSync.value) {
			// This runs on every onBeat, but we only want to do stuff
			// if we know we have to synchronize.
			return;
		}

		// Use a short timeout to get the animation back on track. It seems that if
		// I use a timeout of 0 the animation doesn't properly reset. Combined with a
		// negative delay, we offset the animation to account for the time we spent
		// waiting during the timeout so it's back on track.
		const animationDelayMs = 20;
		haltAnimation.value = true;
		setTimeout(() => {
			haltAnimation.value = false;

			synchronizeElement.value.style.setProperty(
				"--sync-delay",
				`-${animationDelayMs}ms`
			);

			// We are done syncing
			needsSync.value = false;
		}, animationDelayMs);
	});

	const { stop } = useIntersectionObserver(observeElement, ([entry]) => {
		if (entry.isIntersecting) {
			needsSync.value = true;
			haltAnimation.value = true;
		}
	});

	onBeforeUnmount(stop);

	return { haltAnimationStyle };
}
