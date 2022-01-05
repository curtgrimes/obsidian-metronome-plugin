<script setup lang="ts">
const props = defineProps<{
	size?: "small" | "medium" | "large";
	disabled?: boolean;
	bordered?: boolean;
}>();
</script>

<template>
	<button
		:class="['button', $props.class]"
		:disabled="disabled"
		:data-size="props.size || 'small'"
		:data-bordered="bordered"
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
	min-width: 2.5rem;
	width: min-content;
	height: 1.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	color: var(--text-normal);
	font-size: inherit;
	white-space: nowrap;

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

	&[data-bordered="true"] {
		position: relative;
		padding: 0 0.5rem !important;
		margin: 0 0.5rem !important;

		&::before {
			content: "";
			z-index: -1;
			background: var(
				--background-secondary-alt,
				rgba(0, 0, 0, 0)
			) !important;
			opacity: 0.5;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}
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
