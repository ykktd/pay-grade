<script lang="ts">
	import { calculator } from '$lib/stores/calculator.svelte';
	import PeriodChip from './PeriodChip.svelte';

	let dragIdx = $state<number | null>(null);
	let dragOverIdx = $state<number | null>(null);
	let pointerId = $state<number | null>(null);
	let pointerStartX = $state(0);
	let pointerStartY = $state(0);
	let pointerDragCandidateIdx = $state<number | null>(null);

	const POINTER_DRAG_THRESHOLD = 8;

	/* --- ネイティブ Drag & Drop (macOS向け) --- */
	function handleDragStart(e: DragEvent, index: number) {
		dragIdx = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverIdx = index;
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		if (dragIdx !== null && dragIdx !== index) {
			calculator.reorderGrades(dragIdx, index);
		}
		dragIdx = null;
		dragOverIdx = null;
	}

	function handleDragEnd() {
		dragIdx = null;
		dragOverIdx = null;
	}

	/* --- Pointer Events (iOS向け) --- */
	function isInteractiveTarget(target: EventTarget | null): boolean {
		if (!(target instanceof Element)) return false;
		return !!target.closest('button, input, textarea, select, label');
	}

	function getChipIndexAtPoint(clientX: number, clientY: number): number | null {
		const hit = document.elementFromPoint(clientX, clientY);
		const chip = hit?.closest<HTMLElement>('[data-chip-index]');
		if (!chip) return null;
		const raw = chip.dataset.chipIndex;
		if (!raw) return null;
		const idx = Number(raw);
		return Number.isFinite(idx) ? idx : null;
	}

	function handlePointerDown(e: PointerEvent, index: number) {
		if (e.pointerType === 'mouse') return;
		if (isInteractiveTarget(e.target)) return;
		
		pointerId = e.pointerId;
		pointerStartX = e.clientX;
		pointerStartY = e.clientY;
		pointerDragCandidateIdx = index;
	}

	// 修正: window レベルで発火するため、pointerId の一致確認を厳密に行う
	function handlePointerMove(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		if (pointerId === null || e.pointerId !== pointerId) return;

		if (dragIdx === null && pointerDragCandidateIdx !== null) {
			const moved = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
			if (moved < POINTER_DRAG_THRESHOLD) return;
			// 閾値を超えたらドラッグ開始
			dragIdx = pointerDragCandidateIdx;
			dragOverIdx = pointerDragCandidateIdx;
		}

		if (dragIdx !== null) {
			e.preventDefault(); // スクロール等のデフォルト動作を防ぐ
			const over = getChipIndexAtPoint(e.clientX, e.clientY);
			// nullの場合でも、外れたことを視覚化するために更新する
			dragOverIdx = over;
		}
	}

	function resetPointerDrag() {
		pointerId = null;
		pointerDragCandidateIdx = null;
		dragIdx = null;
		dragOverIdx = null;
	}

	function handlePointerUp(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		if (pointerId === null || e.pointerId !== pointerId) return;

		const dropIdx = getChipIndexAtPoint(e.clientX, e.clientY) ?? dragOverIdx;
		if (dragIdx !== null && dropIdx !== null && dragIdx !== dropIdx) {
			calculator.reorderGrades(dragIdx, dropIdx);
		}

		resetPointerDrag();
	}

	function handlePointerCancel(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		if (pointerId === null || e.pointerId !== pointerId) return;
		resetPointerDrag();
	}
</script>

<svelte:window 
	onpointermove={handlePointerMove} 
	onpointerup={handlePointerUp} 
	onpointercancel={handlePointerCancel} 
/>

<div class="chips-section">
	<div class="chips-list" role="list" aria-label="期リスト">
		{#each calculator.grades as grade, i (grade.id)}
			<PeriodChip
				{grade}
				index={i}
				isTop={i === 0}
				dragging={dragIdx === i}
				dragOver={dragOverIdx === i && dragIdx !== i}
				ondragstart={(e) => handleDragStart(e, i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondrop={(e) => handleDrop(e, i)}
				ondragend={handleDragEnd}
				onpointerdown={(e) => handlePointerDown(e, i)}
			/>
		{/each}

		<button class="add-btn" onclick={() => calculator.addGrade()} aria-label="期を追加">
			＋ 期追加
		</button>
	</div>
</div>

<style>
	.chips-section {
		padding: 12px 16px;
		max-width: 480px;
		margin: 0 auto;
	}

	.chips-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.add-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: none;
		border: 1.5px dashed var(--border2);
		border-radius: 12px;
		padding: 5px 12px;
		font-size: 13px;
		font-weight: 600;
		color: var(--text2);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.add-btn:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
