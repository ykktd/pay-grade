<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import TotalHeader from '$lib/components/TotalHeader.svelte';
	import PeriodChips from '$lib/components/PeriodChips.svelte';
	import SliderSection from '$lib/components/SliderSection.svelte';
	import PaymentSummary from '$lib/components/PaymentSummary.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
</script>

<svelte:head>
	<title>金額計算</title>
</svelte:head>

<NavBar />
<TotalHeader />

<main>
	<PeriodChips />
	<SliderSection />

	<div class="summary-gap"></div>

	<PaymentSummary />
	<CopyButton />
</main>

<style>
	main {
		padding-top: calc(46px + 62px);
		max-width: 480px;
		margin: 0 auto;
	}

	.summary-gap {
		height: 1px;
		background: var(--border);
		margin: 12px 16px;
	}
</style>
