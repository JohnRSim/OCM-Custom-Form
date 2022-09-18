<script>
	export let fieldName = 'unknown';
	export let type = 'Single text box';
	export let placeholder = 'Enter Text';
	export let items = [];
	
	placeholder = ((placeholder) && (placeholder.length > 0))?placeholder:'Enter Text';
</script>


{#if (type==="Single text box")}
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
{/if}

{#if (type==="Single-select menu")}
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
{/if}
<style lang="scss">
	
</style>