<script>
	export let label = '';
	export let required = false;
	export let description = '';
</script>


<label class="block">
	<span class="text-gray-700 font-medium">
		{label}
		{#if (required)}
			*
		{/if}
	</span>
	<div class="pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out bg-slate-900/10 ring-slate-900/5"><div class="h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out"></div></div>
</label>

<style lang="scss">
	
</style>