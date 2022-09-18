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
	 * Converting a Number in Scientific Notation to a String
	 */
	function checkVal() {
		if (activeValue) {
			activeValue = (activeValue).toLocaleString('fullwide', {useGrouping:false})
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

<!-- Number -->
<input
	on:blur="{checkVal}"
	bind:value="{activeValue}"
	type="number"
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
<!-- Number -->

<style lang="scss">
	
</style>