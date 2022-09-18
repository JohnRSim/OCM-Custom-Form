<script>
	import { onDestroy, onMount } from 'svelte';

	export let isCard = false;
	export let title = false;
	export let showContent = true;

	onMount(() => {

	});

	/**
	 * toggle
	 * show hide content region
	 */
	function toggle() {
		showContent = !showContent;
	}
</script>

<dl class:show="{showContent}" class="{(isCard)?'shadow-md rounded-xl mt-4 mb-10 bg-white ring-1 ring-slate-700/10':''}">
	{#if (title)}
		<dt on:click="{toggle}" name="title" class="cursor-pointer relative py-4 pl-4 pr-10 font-semibold border-b border-grey">
			{title}
			<i class="absolute top-4 right-4">		
				{#if (showContent)}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
					</svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
					</svg>
				{/if}
			</i>

		</dt>
	{/if}
	<dd class:p-4="{isCard}" class:mt-8="{!isCard}" class:p-1="{!isCard}">
		<slot name="content"></slot>
	</dd>
</dl>

<style lang="scss">
	dt {

	}
	dd {
		opacity:0;
		height:0px;
		overflow: hidden;
		transition: opacity 0.3s, height 0.3s;
	}
	.show dd {
		opacity:1;
		height:inherit;
	}
</style>