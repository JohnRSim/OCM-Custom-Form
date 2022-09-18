<script>
	//svelte
	import { createEventDispatcher } from 'svelte';
	
	export let fieldName = 'unknown';
	export let type=""
	export let placeholder = 'Enter Text';
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
		dispatchEvent({
			action: 'updateField',
			name: fieldName,
			value: activeValue,
		});
	}

</script>


<textarea
	on:blur="{sendUpdate}"
	bind:value="{activeValue}"
	class="
		mt-1
		block
		w-full
		rounded-md
		border-gray-300
		shadow-sm
		focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
	"
	rows="3"
	placeholder="{placeholder}"
></textarea>

<style lang="scss">
	
</style>