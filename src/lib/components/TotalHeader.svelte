<script lang="ts">
	import { calculator } from '$lib/stores/calculator.svelte';

	let editing = $state(false);
	let inputVal = $state('');
	const displayVal = $derived(editing ? inputVal : calculator.total.toLocaleString('ja-JP'));
	const inputWidth = $derived(
		editing
			? `calc(${Math.min(Math.max(displayVal.length, 5), 12)}ch + 16px)`
			: `calc(${Math.max(displayVal.length, 1)}ch + 8px)`
	);

	function startEdit(input: HTMLInputElement) {
		if (editing) return;
		inputVal = String(calculator.total);
		editing = true;

		// 入力欄の生成を待たず、ユーザーのタップ操作内で編集可能にしてフォーカスする
		// iOS Safariは非同期のfocus()ではソフトウェアキーボードを開かないことがある
		input.readOnly = false;
		input.value = inputVal;
		input.focus({ preventScroll: true });
	}

	function commitEdit() {
		const num = parseInt(inputVal.replace(/\D/g, ''), 10);
		if (!isNaN(num) && num >= 0) {
			calculator.setTotal(num);
		}
		editing = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') {
			inputVal = String(calculator.total);
			editing = false;
		}
	}
</script>

<div class="total-header">
	<div class="total-inner">
		<div class="total-left">
			<span class="total-label">TOTAL</span>
			<label class="total-amount-wrap">
				<span class="yen-prefix">¥</span>
				<input
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					class="total-input"
					class:editing
					value={displayVal}
					readonly={!editing}
					oninput={(event) => (inputVal = event.currentTarget.value)}
					onpointerdown={(event) => startEdit(event.currentTarget)}
					onclick={(event) => startEdit(event.currentTarget)}
					onblur={commitEdit}
					onkeydown={onKeydown}
					aria-label="総額を編集"
					style:width={inputWidth}
				/>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="edit-icon" aria-hidden="true">
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
			</label>
		</div>

		<div class="total-right">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
			<span class="people-count">{calculator.totalPeople}人</span>
		</div>
	</div>
</div>

<style>
	.total-header {
		position: sticky;
		top: var(--nav-height);
		z-index: 90;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		transition: background-color 0.3s;
	}

	.total-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 16px;
		max-width: 480px;
		margin: 0 auto;
	}

	.total-left {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.total-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text2);
	}

	.total-amount-wrap {
		display: flex;
		align-items: center;
		gap: 2px;
		cursor: pointer;
	}

	.yen-prefix {
		font-size: 20px;
		font-weight: 800;
		color: var(--text);
	}

	.total-input {
		min-width: 0;
		max-width: calc(100vw - 150px);
		background: transparent;
		border: 2px solid transparent;
		border-radius: 6px;
		padding: 2px 0;
		outline: none;
		cursor: pointer;
		font-size: 28px;
		font-weight: 800;
		color: var(--text);
		font-family: inherit;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.total-input.editing {
		background: var(--surface2);
		border-color: var(--accent);
		padding: 2px 6px;
		cursor: text;
	}

	.edit-icon {
		color: var(--text3);
		flex-shrink: 0;
	}

	.total-right {
		display: flex;
		align-items: center;
		gap: 4px;
		color: var(--text2);
	}

	.people-count {
		font-size: 13px;
		font-weight: 700;
		color: var(--text2);
	}
</style>
