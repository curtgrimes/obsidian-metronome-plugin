<script setup lang="ts">
const props = defineProps<{
	started?: Boolean;
}>();
</script>

<template>
	<button
		class="overlay-toggle"
		:aria-label="started ? 'Stop metronome' : 'Start metronome'"
		aria-label-position="top"
	></button>
</template>

<style lang="scss" scoped>
.overlay-toggle {
	/* using !important because some themes may try to override these */
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	background: none !important;
	border: none !important;
	box-shadow: none !important;
	cursor: pointer;
	z-index: 1;
	transition: background-color 100ms;

	&:hover {
		background-color: rgba(150, 150, 150, 0.1);
	}
}
</style>
