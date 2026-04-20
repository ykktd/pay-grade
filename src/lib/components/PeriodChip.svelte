<script lang="ts">
	import type { Grade } from '$lib/types';
	import { calculator } from '$lib/stores/calculator.svelte';

	interface Props {
		grade: Grade;
		index: number;
		isTop: boolean;
		dragging: boolean;
		dragOver: boolean;
		ondragstart: (e: DragEvent) => void;
		ondragover: (e: DragEvent) => void;
		ondrop: (e: DragEvent) => void;
		ondragend: () => void;
	}

	let { grade, index, isTop, dragging, dragOver, ondragstart, ondragover, ondrop, ondragend }: Props = $props();

	let editingNum = $state(false);
	let numInput = $state('');
	let numInputEl = $state<HTMLInputElement | null>(null);

	const color = $derived(isTop ? 'var(--green)' : 'var(--accent)');
	const colorLight = $derived(isTop ? 'var(--greenL)' : 'var(--accentL)');

	function startEditNum() {
		numInput = String(grade.num);
		editingNum = true;
		setTimeout(() => numInputEl?.select(), 0);
	}

	function commitNum() {
		const n = parseInt(numInput, 10);
		if (!isNaN(n)) calculator.updateGradeNum(grade.id, n);
		editingNum = false;
	}

	function onNumKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitNum();
		if (e.key === 'Escape') editingNum = false;
	}
</script>

<div
	class="chip"
	class:dragging
	class:dragover={dragOver}
	draggable="true"
	{ondragstart}
	{ondragover}
	{ondrop}
	{ondragend}
	style="--color: {color}; --color-light: {colorLight};"
	role="listitem"
>
	<span class="drag-handle" aria-hidden="true">⠿</span>

	<div class="chip-label">
		{#if editingNum}
			<input
				bind:this={numInputEl}
				bind:value={numInput}
				type="number"
				class="num-input"
				onblur={commitNum}
				onkeydown={onNumKeydown}
				min="1"
			/>
		{:else}
			<button class="num-btn" onclick={startEditNum} aria-label="{grade.num}期 — タップで編集">
				{grade.num}期
			</button>
		{/if}
		{#if isTop}
			<span class="top-badge">TOP</span>
		{/if}
	</div>

	<div class="stepper">
		<button
			class="step-btn"
			onclick={() => calculator.updateGradeCount(grade.id, -1)}
			aria-label="人数を減らす"
		>−</button>
		<span class="count">{grade.count}</span>
		<button
			class="step-btn"
			onclick={() => calculator.updateGradeCount(grade.id, 1)}
			aria-label="人数を増やす"
		>＋</button>
	</div>

	<span class="people-label">人</span>

	<button
		class="delete-btn"
		onclick={() => calculator.removeGrade(grade.id)}
		aria-label="{grade.num}期を削除"
		disabled={calculator.grades.length <= 1}
	>×</button>
</div>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: var(--color-light);
		border: 1.5px solid color-mix(in srgb, var(--color) 40%, transparent);
		border-radius: 12px;
		padding: 5px 10px;
		cursor: grab;
		transition:
			opacity 0.15s,
			transform 0.15s,
			outline 0.15s;
		user-select: none;
		touch-action: none;
	}

	.chip.dragging {
		opacity: 0.35;
		transform: scale(0.97);
	}

	.chip.dragover {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.drag-handle {
		color: var(--color);
		font-size: 14px;
		cursor: grab;
		line-height: 1;
	}

	.chip-label {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.num-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: 13px;
		font-weight: 700;
		color: var(--color);
	}

	.num-input {
		width: 50px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color);
		background: var(--surface);
		border: 1.5px solid var(--color);
		border-radius: 4px;
		padding: 1px 4px;
		outline: none;
	}

	.top-badge {
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.06em;
		color: var(--green);
		background: color-mix(in srgb, var(--green) 15%, transparent);
		border-radius: 4px;
		padding: 1px 4px;
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.step-btn {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1.5px solid color-mix(in srgb, var(--color) 50%, transparent);
		background: var(--surface);
		color: var(--color);
		font-size: 14px;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.count {
		font-size: 13px;
		font-weight: 700;
		color: var(--text);
		min-width: 16px;
		text-align: center;
	}

	.people-label {
		font-size: 12px;
		color: var(--text2);
	}

	.delete-btn {
		background: none;
		border: none;
		padding: 0;
		margin-left: 2px;
		cursor: pointer;
		font-size: 14px;
		color: var(--text3);
		line-height: 1;
		transition: color 0.15s;
	}

	.delete-btn:hover:not(:disabled) {
		color: var(--red);
	}

	.delete-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>
