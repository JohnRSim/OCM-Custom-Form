<script>
	export let fieldName = 'unknown';
	export let description = '';
</script>



<p class="text-sm">{description}</p>
<div class="flex ring-1 ring-slate-700/10 rounded-md p-2 mt-2">
	<div class="flex-1 flex items-center ">
		<span class="ring-1 ring-slate-700/10 rounded-md p-1 text-xs">NFT-3D</span> 
		<span class="pl-3"><input value="Player Card 1" readonly/></span>
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
<div class="flex ring-1 ring-slate-700/10 rounded-md p-2 mt-4">
	<div class="pr-2 flex items-center">
		<button class="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">Add</button>
	</div>
	<div class="pr-2 flex items-center">
		<button class="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">Select Many</button>
	</div>
</div>

<style lang="scss">
	
</style>