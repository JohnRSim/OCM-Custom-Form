<script>
	export let fieldName = 'unknown';
	export let placeholder = 'Enter number';

	let numberValue;
	
	/**
	 * checkVal
	 * Converting a Number in Scientific Notation to a String
	 */
	function checkVal() {
		if (numberValue) {
			numberValue = (numberValue).toLocaleString('fullwide', {useGrouping:false})
		}
	}
</script>


<input
	on:blur="{checkVal}"
	bind:value="{numberValue}"
	type="number"
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