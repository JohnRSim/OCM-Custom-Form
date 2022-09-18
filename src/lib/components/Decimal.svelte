<script>
	//svelte
	import { createEventDispatcher, onMount } from 'svelte';

	export let fieldName = 'unknown';
	export let placeholder = 'Enter number';
	export let defaultValue;
	export let activeValue;

	const dispatch = createEventDispatcher();

	//if no active value use default value if defined.
	activeValue = activeValue || defaultValue || '';
	
	/**
	 * Component Mounted
	*/
	onMount(() => {
		//check value on init
		checkVal();
	});

	/**
	 * checkVal
	 * check if decimal if not add 2dp
	 */
	function checkVal() {
		if (activeValue) {
			if (Number.isSafeInteger(activeValue)) {
				activeValue = activeValue.toFixed(2);
			}
		}
		sendUpdate();
	}

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


<!-- Anchor -->
<span id="{fieldName}"></span>

<!-- Decimal -->
<input
	on:blur="{checkVal}"
	bind:value="{activeValue}"
	type="number"
	step="any"
	class="
		mt-1
		block
		w-full
		rounded-md
		border-gray-300
		shadow-sm
		focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
	"
	placeholder="{placeholder}"
/>
<!-- xDecimal -->

<style lang="scss">
	
</style>