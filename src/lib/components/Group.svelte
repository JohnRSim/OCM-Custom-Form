<script>
	export let isCard = false;
</script>

<dl class="{(isCard)?'shadow-md rounded-xl mt-4 mb-10 bg-white ring-1 ring-slate-700/10':''}">
	<slot name="title"></slot>
	<slot name="content"></slot>
</dl>

<style lang="scss">
	
</style>