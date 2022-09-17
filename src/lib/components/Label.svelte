<script>
	export let label = '';
	export let required = false;
</script>


<label class="block">
	<span class="text-gray-700 font-medium">
		{label}
		{#if (required)}
			*
		{/if}
	</span>
	<slot></slot>
</label>

<style lang="scss">
	
</style>