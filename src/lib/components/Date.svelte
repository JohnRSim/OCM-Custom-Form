<script>
	//svelte
	import { createEventDispatcher, onMount } from 'svelte';

	export let fieldName = 'unknown';
	export let defaultValue;
	export let activeValue;

	const dispatch = createEventDispatcher();

	//if no active value use default value if defined.
	activeValue = activeValue || defaultValue || '';

	/**
	 * dispatchEvent
	 * Dispatch event passing option data
	 **/
	function dispatchEvent(options) {
		console.log(`[Dispatch Event][${options.action}]`,options);
		dispatch(options.action, options);
	}

	/**
	 * sendUpdate
	 **/
	function sendUpdate() {
		const date = new Date(activeValue);

		dispatchEvent({
			action: 'updateField',
			name: fieldName,
			value: {
				timezone: 'UTC',
				value: date.toISOString(),//"2022-09-20T23:00:00.000Z"
			},
		});
	}
</script>



<input
	on:blur="{sendUpdate}"
	bind:value={activeValue}
	type="date"
	class="
		mt-1
		block
		w-full
		rounded-md
		border-gray-300
		shadow-sm
		focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
	" />

<style lang="scss">
	
</style>