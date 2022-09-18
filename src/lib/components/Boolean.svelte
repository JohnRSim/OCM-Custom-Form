<script>
	export let description = '';
	export let labels = {off:'False',on:'True'}
	export let defaultValue = false;
	
	/**
	 * toggle
	 */
	function toggle() {
		defaultValue = !defaultValue;
	}
</script>


<div class="flex" on:click="{toggle}">
	<span>{labels['off']}</span>
	<div class="cursor-pointer ml-2 mr-2 pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out {(defaultValue)?'bg-indigo-600 ring-black/20':'bg-slate-900/10 ring-slate-900/5'}">
		<div class="h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out {(defaultValue)?'translate-x-4':''}"></div>
	</div>
	<span>{labels['on']}</span>
</div>
<p class="text-sm text-slate-500">{description}</p>

<style lang="scss">
	
</style>