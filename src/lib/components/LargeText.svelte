<script>
	export let type=""
	export let label = '';
	export let required = false;
	export let placeholder = '';
	export let items = [];
</script>

	<label class="block">
		<span class="text-gray-700 font-medium">{label} {#if (required)}*{/if}</span>
		<textarea
			class="
			mt-1
			block
			w-full
			rounded-md
			border-gray-300
			shadow-sm
			focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
		"
			rows="3"
			placeholder="{placeholder}"
		/>
	</label>

<style lang="scss">
	
</style>