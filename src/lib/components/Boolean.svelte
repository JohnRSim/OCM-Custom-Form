<script>
	//svelte
	import { createEventDispatcher } from 'svelte';

	export let fieldName = 'unknown';
	export let description = '';
	export let labels = {off:'False',on:'True'}
	export let defaultValue = false;
	export let activeValue;
	
	const dispatch = createEventDispatcher();

	//if no active value use default value if defined.
	if (activeValue === null) {
		activeValue = defaultValue;
	}

	/**
	 * toggle
	 */
	function toggle() {
		activeValue = !activeValue;
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


<div class="flex" on:click="{toggle}">
	<span>{labels['off']}</span>
	<div class="cursor-pointer ml-2 mr-2 pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out {(activeValue)?'bg-indigo-600 ring-black/20':'bg-slate-900/10 ring-slate-900/5'}">
		<div class="h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out {(activeValue)?'translate-x-4':''}"></div>
	</div>
	<span>{labels['on']}</span>
</div>
<p class="text-sm text-slate-500">{description}</p>

<style lang="scss">
	
</style>