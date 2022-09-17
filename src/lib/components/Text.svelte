<script>
	export let type = 'Single text box';
	export let label = '';
	export let required = false;
	export let placeholder = '';
</script>


{#if (type==="Single text box")}
	<label class="block">
		<span class="text-gray-700 font-medium">{label} {#if (required)}*{/if}</span>
		<input
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
	</label>
{/if}

{#if (type==="Single-select menu")}
	<label class="block">
		<span class="text-gray-700 font-medium">Language *</span>
		<select
			class="
			block
			w-full
			mt-1
			rounded-md
			border-gray-300
			shadow-sm
			focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
		"
		>
		{#each items as item}
			<option value="{item.value}">{item.label}</option>
		{/each}
		</select>
	</label>
{/if}
<style lang="scss">
	
</style>