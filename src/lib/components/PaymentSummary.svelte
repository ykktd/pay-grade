<script lang="ts">
	import { calculator } from '$lib/stores/calculator.svelte';
	import { animateNumber } from '$lib/actions/animateNumber';
	import { GRADE_COLORS } from '$lib/types';
</script>

<div class="summary-section">
	<div class="section-inner">
		<span class="section-label">支払いサマリー</span>

		<div class="balance-card" class:balanced={calculator.balanced} class:unbalanced={!calculator.balanced}>
			{#if calculator.balanced}
				<span class="balance-icon">✓</span>
				<span class="balance-text">合計一致</span>
			{:else}
				<span class="balance-icon">⚠</span>
				<span class="balance-text">差額あり</span>
			{/if}
			<span class="total-actual">
				¥<span use:animateNumber={calculator.actualTotal}></span>
			</span>
		</div>

		<div class="divider"></div>

		<div class="grade-list">
			{#if calculator.topGrade}
				{@const isAuto = !calculator.topOverridden}
				<div class="grade-row">
					<span class="grade-dot" style="background: {GRADE_COLORS.top.main};"></span>
					<span class="grade-name">{calculator.topGrade.num}期</span>
					<span class="grade-count">×{calculator.topGrade.count}人</span>
					{#if isAuto}
						<span class="grade-badge auto">自動</span>
					{/if}
					<span class="grade-subtotal">
						計 ¥{(calculator.topPayment * calculator.topGrade.count).toLocaleString('ja-JP')}
					</span>
					<span class="grade-per">
						¥<span use:animateNumber={calculator.topPayment}></span>/人
					</span>
				</div>
			{/if}

			{#each calculator.lower as grade (grade.id)}
				<div class="grade-row">
					<span class="grade-dot" style="background: {GRADE_COLORS.lower.main};"></span>
					<span class="grade-name">{grade.num}期</span>
					<span class="grade-count">×{grade.count}人</span>
					<span class="grade-subtotal">
						計 ¥{(grade.payment * grade.count).toLocaleString('ja-JP')}
					</span>
					<span class="grade-per">
						¥<span use:animateNumber={grade.payment}></span>/人
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.summary-section {
		padding: 0 16px 16px;
		max-width: 480px;
		margin: 0 auto;
	}

	.section-inner {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.section-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text2);
	}

	.balance-card {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-radius: 12px;
		border: 1.5px solid;
	}

	.balance-card.balanced {
		background: var(--greenL);
		border-color: color-mix(in srgb, var(--green) 30%, transparent);
		color: var(--green);
	}

	.balance-card.unbalanced {
		background: var(--redL);
		border-color: color-mix(in srgb, var(--red) 30%, transparent);
		color: var(--red);
	}

	.balance-icon {
		font-size: 14px;
	}

	.balance-text {
		font-size: 13px;
		font-weight: 700;
		flex: 1;
	}

	.total-actual {
		font-size: 18px;
		font-weight: 800;
	}

	.divider {
		height: 1px;
		background: var(--border);
	}

	.grade-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.grade-row {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.grade-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.grade-name {
		font-size: 16px;
		font-weight: 700;
		color: var(--text);
		min-width: 40px;
	}

	.grade-count {
		font-size: 12px;
		color: var(--text2);
	}

	.grade-badge {
		font-size: 10px;
		font-weight: 700;
		padding: 1px 5px;
		border-radius: 4px;
	}

	.grade-badge.auto {
		background: color-mix(in srgb, var(--text2) 15%, transparent);
		color: var(--text2);
	}

	.grade-subtotal {
		font-size: 12px;
		color: var(--text2);
		flex: 1;
		text-align: right;
	}

	.grade-per {
		font-size: 20px;
		font-weight: 800;
		color: var(--text);
		min-width: 90px;
		text-align: right;
	}
</style>
