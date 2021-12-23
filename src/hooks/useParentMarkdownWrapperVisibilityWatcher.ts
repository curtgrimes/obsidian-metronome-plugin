import { watch, onBeforeUnmount, Ref, ref } from "vue";
import { MaybeElementRef, useIntersectionObserver } from "@vueuse/core";

export function useParentMarkdownWrapperVisibilityWatcher(
	elementRef: Ref<Element>
) {
	const isVisible = ref(false);
	const stopFunction = ref(null);
	const stopExistingIntersectionObserverIfRunning = () =>
		stopFunction.value && stopFunction.value();

	watch(
		elementRef,
		() => {
			stopExistingIntersectionObserverIfRunning();

			const markdownWrapperParent = elementRef.value
				? elementRef.value.closest(".markdown-source-view") ||
				  elementRef.value.closest(".markdown-reading-view")
				: null;

			// We want to consider it still visible if it's
			// in a sidebar to match the behavior of audio players.
			const isInSidebar = () =>
				markdownWrapperParent.closest(
					".mod-left-split, .mod-right-split"
				) !== null;

			const { stop } = useIntersectionObserver(
				markdownWrapperParent as MaybeElementRef,
				(entries) =>
					(isVisible.value =
						entries.some((entry) => entry.isIntersecting) ||
						isInSidebar())
			);

			stopFunction.value = stop;
		},
		{ immediate: true }
	);

	onBeforeUnmount(stopExistingIntersectionObserverIfRunning);

	return isVisible;
}
