<script lang="ts">
	import './layout.css';
	import { PUBLIC_APP_URL } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="打ち上げ金額計算ツール" />
	<meta name="theme-color" content="#3a7ef6" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="金額計算" />
	<meta property="og:title" content="金額計算" />
	<meta property="og:description" content="打ち上げ金額計算ツール" />
	<meta property="og:locale" content="ja_JP" />
	{#if PUBLIC_APP_URL}
		<meta property="og:url" content={PUBLIC_APP_URL} />
		<meta property="og:image" content="{PUBLIC_APP_URL}/og-image.png" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="金額計算" />
		<meta name="twitter:description" content="打ち上げ金額計算ツール" />
		<meta name="twitter:image" content="{PUBLIC_APP_URL}/og-image.png" />
	{/if}
</svelte:head>
{@render children()}
