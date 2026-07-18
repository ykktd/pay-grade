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
		onpointerdown: (e: PointerEvent) => void; // downのみ残す
	}

	// 修正: 不要なPropsの受け取りを削除
	let {
		grade,
		index,
		isTop,
		dragging,
		dragOver,
		ondragstart,
		ondragover,
		ondrop,
		ondragend,
		onpointerdown
	}: Props = $props();

	let editingLabel = $state(false);
	let labelDraft = $state<string | null>(null);

	const color = $derived(isTop ? 'var(--green)' : 'var(--accent)');
	const colorLight = $derived(isTop ? 'var(--greenL)' : 'var(--accentL)');
	const displayedLabel = $derived(labelDraft ?? grade.label);

	function startEditLabel(input: HTMLInputElement) {
		if (editingLabel) return;
		labelDraft = grade.label;
		editingLabel = true;

		// iOSでもタップ操作の最中にキーボードが開くよう、DOMを同期的に編集可能にする
		input.readOnly = false;
		input.focus({ preventScroll: true });
	}

	function commitLabel() {
		const normalized = (labelDraft ?? grade.label).trim();
		if (normalized) {
			calculator.updateGradeLabel(grade.id, normalized);
		}
		labelDraft = null;
		editingLabel = false;
	}

	function onLabelKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitLabel();
		if (e.key === 'Escape') {
			labelDraft = null;
			editingLabel = false;
		}
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
	data-chip-index={index}
>
	<span 
		class="drag-handle" 
		aria-hidden="true"
		{onpointerdown}
	>⠿</span>

	<div class="chip-label">
		<input
			type="text"
			class="label-input"
			class:editing={editingLabel}
			value={displayedLabel}
			readonly={!editingLabel}
			oninput={(event) => (labelDraft = event.currentTarget.value)}
			onpointerdown={(event) => startEditLabel(event.currentTarget)}
			onclick={(event) => startEditLabel(event.currentTarget)}
			onblur={commitLabel}
			onkeydown={onLabelKeydown}
			aria-label="{grade.label} — タップで編集"
			maxlength="30"
			style:width="{Math.min(Math.max(displayedLabel.length, 2), 14)}em"
		/>
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
		aria-label="{grade.label}を削除"
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
		/* 修正: ここから touch-action: none; を削除 */
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
		/* 修正: ハンドル部分にのみ touch-action: none; を適用 */
		touch-action: none; 
		padding: 4px; /* タップ領域を少し広げるとモバイルで掴みやすくなります */
		margin-left: -4px;
	}

	.chip-label {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.label-input {
		min-width: 2em;
		max-width: 14em;
		background: transparent;
		border: 1.5px solid transparent;
		border-radius: 4px;
		padding: 1px 3px;
		outline: none;
		cursor: pointer;
		font-size: 13px;
		font-weight: 700;
		color: var(--color);
		font-family: inherit;
	}

	.label-input.editing {
		background: var(--surface);
		border: 1.5px solid var(--color);
		cursor: text;
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
