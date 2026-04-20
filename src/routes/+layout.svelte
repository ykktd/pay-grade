<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#3a7ef6" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
</svelte:head>
{@render children()}
