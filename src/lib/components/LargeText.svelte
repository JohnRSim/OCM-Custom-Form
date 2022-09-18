<script>
	export let type=""
	export let placeholder = 'Enter Text';
	
	placeholder = ((placeholder) && (placeholder.length > 0))?placeholder:'Enter Text';
</script>


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

<style lang="scss">
	
</style>