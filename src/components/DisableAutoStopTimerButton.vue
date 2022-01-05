<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Button from "./Button.vue";
import t from "../i18n/locale";
import formatDuration from "format-duration";

const props = defineProps<{
	expiringSoon?: boolean;
	timeLeft?: number;
}>();

const maxTimeLeftWhenExpiring = ref<Number>(0);

const timeLeftFormatted = computed(() =>
	Math.ceil(props.timeLeft) <= 60
		? Math.ceil(props.timeLeft)
		: formatDuration(Math.ceil(props.timeLeft) * 1000)
);

watch(
	() => props.expiringSoon,
	() => {
		if (
			props.expiringSoon &&
			props.timeLeft > maxTimeLeftWhenExpiring.value
		) {
			maxTimeLeftWhenExpiring.value = props.timeLeft;
		}
	}
);
</script>

<template>
	<Button
		v-if="expiringSoon"
		:aria-label="t(`Cancel`)"
		v-bind="{ size: props.size }"
		bordered
		class="disable-auto-stop-timer-button"
		:style="{
			'--total-time': `${maxTimeLeftWhenExpiring}s`,
			'--time-left': `${timeLeft}s`,
		}"
	>
		<div class="auto-stop-timer-progress-bar"></div>
		{{ expiringSoon ? t(`Stopping in %1...`, timeLeftFormatted) : null }}
	</Button>
</template>

<style lang="scss" scoped>
.disable-auto-stop-timer-button {
	position: relative;
	font-variant-numeric: tabular-nums;

	.auto-stop-timer-progress-bar {
		position: absolute;
		height: 10%;
		top: 0;
		left: 0;
		background: var(--text-accent-hover);
		animation: fillBar var(--total-time) forwards linear;

		@keyframes fillBar {
			0% {
				width: 0%;
			}

			100% {
				width: 100%;
			}
		}
	}
}
</style>
