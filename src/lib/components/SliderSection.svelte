<script lang="ts">
	import { calculator } from '$lib/stores/calculator.svelte';
	import SliderRow from './SliderRow.svelte';
	import { GRADE_COLORS } from '$lib/types';
</script>

<div class="slider-section">
	<div class="section-inner">
		{#if calculator.topGrade}
			<div class="top-area">
				<SliderRow
					gradeNum={calculator.topGrade.num}
					payment={calculator.topPayment}
					color={GRADE_COLORS.top.main}
					isTop={true}
					isAuto={!calculator.topOverridden}
					onchange={(val) => calculator.setTopManual(val)}
					onreset={() => calculator.setTopAuto()}
				/>
			</div>
		{/if}

		{#if calculator.lower.length > 0}
			<div class="divider"></div>

			<div class="lower-area">
				{#each calculator.lower as grade (grade.id)}
					<SliderRow
						gradeNum={grade.num}
						payment={grade.payment}
						color={GRADE_COLORS.lower.main}
						isTop={false}
						isAuto={false}
						onchange={(val) => calculator.setLowerPayment(grade.id, val)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.slider-section {
		padding: 0 16px;
		max-width: 480px;
		margin: 0 auto;
	}

	.top-area {
		padding-bottom: 4px;
	}

	.divider {
		height: 1px;
		background: var(--border);
		margin: 4px 0;
	}

	.lower-area {
		padding-top: 4px;
	}
</style>
