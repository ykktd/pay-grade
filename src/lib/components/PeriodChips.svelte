<script lang="ts">
	import { calculator } from '$lib/stores/calculator.svelte';
	import PeriodChip from './PeriodChip.svelte';

	let dragIdx = $state<number | null>(null);
	let dragOverIdx = $state<number | null>(null);

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
</script>

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
