<script>
	//svelte
	import { createEventDispatcher } from 'svelte';
	
	export let pattern = false;
	export let fieldName = 'unknown';
	export let type = 'Single text box';
	export let placeholder = 'Enter Text';
	export let items = [];
	export let focus=false;
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


{#if (type==="Single text box")}
	<input
		on:blur="{sendUpdate}"
		bind:value="{activeValue}"
		autofocus="{focus}"
		type="text"
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
{/if}

{#if (type==="Single-select menu")}
	<select
		on:change="{sendUpdate}"
		bind:value={activeValue}
		class="
			block
			w-full
			mt-1
			rounded-md
			border-gray-300
			shadow-sm
			focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
		">
		{#each items as item}
			<option value="{item.value}" >{item.label}</option>
		{/each}
	</select>
{/if}
<style lang="scss">
	
</style>