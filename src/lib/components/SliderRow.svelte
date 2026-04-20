<script lang="ts">
	import { animateNumber } from '$lib/actions/animateNumber';
	import { SLIDER_MAX, SNAP_STEP } from '$lib/types';

	interface Props {
		gradeNum: number;
		payment: number;
		color: string;
		isTop: boolean;
		isAuto: boolean;
		onchange: (val: number) => void;
		onreset?: () => void;
	}

	let { gradeNum, payment, color, isTop, isAuto, onchange, onreset }: Props = $props();

	let trackEl = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);

	const fillPct = $derived((payment / SLIDER_MAX) * 100);

	function getValueFromPointer(e: PointerEvent): number {
		if (!trackEl) return payment;
		const rect = trackEl.getBoundingClientRect();
		const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const raw = pct * SLIDER_MAX;
		return Math.round(raw / SNAP_STEP) * SNAP_STEP;
	}

	function onPointerDown(e: PointerEvent) {
		if (isTop && isAuto) return;
		isDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		onchange(getValueFromPointer(e));
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging) return;
		onchange(getValueFromPointer(e));
	}

	function onPointerUp() {
		isDragging = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (isTop && isAuto) return;
		const step = e.shiftKey ? SNAP_STEP * 10 : SNAP_STEP;
		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			onchange(Math.min(payment + step, SLIDER_MAX));
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			onchange(Math.max(payment - step, 0));
		}
	}
</script>

<div class="slider-row" style="--color: {color};">
	<div class="row-header">
		<div class="grade-label">
			<span class="grade-dot" style="background: {color};"></span>
			<span class="grade-name">{gradeNum}期</span>
		</div>

		<div class="row-actions">
			{#if isTop}
				{#if isAuto}
					<span class="auto-label">自動</span>
				{:else if onreset}
					<button class="reset-btn" onclick={onreset} aria-label="自動計算に戻す">↺ リセット</button>
				{/if}
			{/if}
			<span class="payment-display">
				<span class="yen">¥</span>
				<span class="payment-num" use:animateNumber={payment}></span>
				<span class="per-person">/ 人</span>
			</span>
		</div>
	</div>

	<div
		bind:this={trackEl}
		class="track-wrap"
		class:dragging={isDragging}
		class:disabled={isTop && isAuto}
		role="slider"
		aria-valuemin={0}
		aria-valuemax={SLIDER_MAX}
		aria-valuenow={payment}
		aria-label="{gradeNum}期の支払額"
		tabindex={isTop && isAuto ? -1 : 0}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onkeydown={onKeydown}
	>
		<div class="track">
			<div class="track-fill" style="width: {fillPct}%; background: linear-gradient(90deg, {color}99, {color});"></div>
		</div>
		<div
			class="thumb"
			class:dragging={isDragging}
			style="left: {fillPct}%; --color: {color};"
		></div>
	</div>

	<div class="scale-labels">
		<span>¥0</span>
		<span>¥{(SLIDER_MAX / 2).toLocaleString('ja-JP')}</span>
		<span>¥{SLIDER_MAX.toLocaleString('ja-JP')}</span>
	</div>
</div>

<style>
	.slider-row {
		padding: 8px 0 4px;
	}

	.row-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.grade-label {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.grade-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color) 20%, transparent);
		flex-shrink: 0;
	}

	.grade-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--text);
	}

	.row-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.auto-label {
		font-size: 11px;
		font-weight: 600;
		color: var(--text3);
		letter-spacing: 0.04em;
	}

	.reset-btn {
		background: none;
		border: 1px solid var(--border2);
		border-radius: 6px;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text2);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.reset-btn:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.payment-display {
		display: flex;
		align-items: baseline;
		gap: 2px;
	}

	.yen {
		font-size: 16px;
		font-weight: 700;
		color: var(--text);
	}

	.payment-num {
		font-size: 24px;
		font-weight: 800;
		color: var(--text);
		min-width: 60px;
		text-align: right;
		display: inline-block;
	}

	.per-person {
		font-size: 12px;
		color: var(--text2);
	}

	.track-wrap {
		position: relative;
		height: 28px;
		display: flex;
		align-items: center;
		cursor: pointer;
		touch-action: none;
	}

	.track-wrap.disabled {
		cursor: default;
		pointer-events: none;
		opacity: 0.5;
	}

	.track-wrap:focus {
		outline: none;
	}

	.track-wrap:focus-visible .thumb {
		box-shadow:
			0 0 0 6px color-mix(in srgb, var(--color) 25%, transparent),
			var(--shadow);
	}

	.track {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: var(--border2);
		overflow: hidden;
		position: relative;
	}

	.track-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0s;
	}

	.thumb {
		position: absolute;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--surface);
		border: 3px solid var(--color);
		box-shadow: var(--shadow);
		transform: translateX(-50%);
		transition:
			transform 0.12s,
			box-shadow 0.12s;
		pointer-events: none;
	}

	.thumb.dragging {
		transform: translateX(-50%) scale(1.18);
		box-shadow:
			0 0 0 6px color-mix(in srgb, var(--color) 12%, transparent),
			var(--shadow);
	}

	.scale-labels {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		color: var(--text3);
		margin-top: 2px;
	}
</style>
