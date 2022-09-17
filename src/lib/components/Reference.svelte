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
	<p class="text-sm">{description}</p>
	<div class="flex ring-1 ring-slate-700/10 rounded-md p-2 mt-2">
		<div class="flex-1 flex items-center ">
			<span class="ring-1 ring-slate-700/10 rounded-md p-1 text-xs">Collection</span> 
			<span class="pl-3"><input value="Spacedust" /></span>
		</div>
		<div class="pr-2 flex items-center">
			<button class="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">Create</button>
		</div>
		<div class="pr-2 flex items-center">
			<button class="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">Select</button>
		</div>
		<div class="flex items-center">
			<button class="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">Clear</button>
		</div>
	</div>
</label>	

<style lang="scss">
	
</style>