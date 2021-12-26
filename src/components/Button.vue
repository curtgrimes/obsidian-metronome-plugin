<script setup lang="ts">
const props = defineProps<{
	size?: "small" | "medium" | "large";
	disabled?: boolean;
}>();
</script>

<template>
	<button
		class="button"
		:disabled="disabled"
		:data-size="props.size || 'small'"
		v-bind="{ size }"
	>
		<slot />
	</button>
</template>

<style lang="scss" scoped>
.button {
	/* using !important because some themes may try to override these */
	background: none !important;
	border: none !important;
	padding: 0.25rem !important;
	margin: 0;
	cursor: pointer;
	outline: 0 !important;
	box-shadow: none !important;
	border-radius: 0.2rem;
	width: 2.5rem;
	height: 1.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	color: var(--text-normal);

	&[disabled] {
		pointer-events: none;
	}

	&[data-size="medium"] {
		width: 2rem;
		height: 2rem;
		padding: 0.25rem;
	}

	&[data-size="large"] {
		width: 2.5rem;
		height: 2.3rem;
		padding: 0.25rem;
	}

	&[data-size="xlarge"] {
		width: 4rem;
		height: 3.5rem;
		padding: 0.35rem;
	}

	& > * {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&:hover,
	&:active {
		background-color: var(--background-modifier-border);
		color: var(--text-accent-hover);
	}

	&:hover,
	&:active,
	&.enabled {
		opacity: 1;
	}
}
</style>
