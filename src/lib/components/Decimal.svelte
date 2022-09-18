<script>
	export let fieldName = 'unknown';
	export let placeholder = 'Enter number';
	
	let decimalValue;
	
	/**
	 * checkVal
	 * check if decimal if not add 2dp
	 */
	function checkVal() {
		if (decimalValue) {
			if (Number.isSafeInteger(decimalValue)) {
				decimalValue = decimalValue.toFixed(2);
			}
		}
	}
</script>


<input
	on:blur="{checkVal}"
	bind:value="{decimalValue}"
	type="number"
	step="any"
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

<style lang="scss">
	
</style>