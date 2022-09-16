<script>
	import '$lib/styles/normalise.css';
	import '$lib/styles/index.scss';
</script>

<div class="container">
	<slot />
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: space-between;
		padding: $spacing-4 $spacing-0 $spacing-0;
		margin: $spacing-0 auto;
		min-height: 100vh;
	}
</style>
