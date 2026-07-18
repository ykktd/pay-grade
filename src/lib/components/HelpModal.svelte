<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let {
		open = $bindable(false),
		onclose
	}: {
		open: boolean;
		onclose?: () => void;
	} = $props();

	let modalEl = $state<HTMLDivElement | null>(null);

	function close() {
		open = false;
		onclose?.();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close();
	}

	$effect(() => {
		if (open) {
			setTimeout(() => modalEl?.focus(), 0);
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="overlay" role="presentation" onclick={close} transition:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			bind:this={modalEl}
			class="modal"
			onclick={(event) => event.stopPropagation()}
			transition:scale={{ duration: 200, start: 0.95 }}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="help-title"
		>
			<div class="modal-header">
				<div>
					<p class="eyebrow">HOW TO USE</p>
					<h2 id="help-title">金額計算の使い方</h2>
				</div>
				<button class="close-btn" onclick={close} aria-label="使い方を閉じる">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>

			<div class="help-content">
				<ol class="steps">
					<li>
						<span class="step-number">1</span>
						<div>
							<h3>総額を入力</h3>
							<p>画面上部の金額をタップして、集めたい総額を入力します。</p>
						</div>
					</li>
					<li>
						<span class="step-number">2</span>
						<div>
							<h3>期と人数を設定</h3>
							<p>「＋ 期追加」で期を追加します。「15期」などの期名をタップすると、「上級生」「2年」などを含む名前全体を自由に変更できます。− / ＋ で人数を1人ずつ変更できます。</p>
							<p class="sub-note">左端の⠿をドラッグすると並べ替え、右端の×で削除できます。</p>
						</div>
					</li>
					<li>
						<span class="step-number">3</span>
						<div>
							<h3>支払額を調整</h3>
							<p>青色の各期のスライダーで、一人あたりの支払額を決めます。一番上の緑色の期は、総額からほかの期の支払分を引いた残額をもとに自動計算されます。</p>
						</div>
					</li>
					<li>
						<span class="step-number">4</span>
						<div>
							<h3>確認してコピー</h3>
							<p>支払いサマリーで合計を確認し、「結果をコピー」で結果を共有できます。</p>
						</div>
					</li>
				</ol>

				<div class="tip">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
					<p><strong>ご意見をお聞かせください</strong><br />画面右上の吹き出しボタンから、改善してほしい点や気づいた点を送れます。お名前の入力は任意です。</p>
				</div>
			</div>

			<button class="primary-btn" onclick={close}>使ってみる</button>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
	}

	.modal {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		box-shadow: var(--shadow2);
		width: 100%;
		max-width: 400px;
		max-height: calc(100dvh - 32px);
		padding: 20px;
		display: flex;
		flex-direction: column;
		outline: none;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 16px;
	}

	.eyebrow {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--accent);
		margin: 0 0 3px;
	}

	.modal-header h2 {
		font-size: 18px;
		font-weight: 750;
		color: var(--text);
		margin: 0;
	}

	.close-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		border: none;
		border-radius: 9999px;
		background: var(--surface2);
		color: var(--text2);
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
	}

	.close-btn:hover {
		background: var(--border);
		color: var(--text);
	}

	.help-content {
		overflow-y: auto;
		overscroll-behavior: contain;
		padding-right: 2px;
	}

	.steps {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.steps li {
		display: flex;
		align-items: flex-start;
		gap: 11px;
	}

	.step-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		flex-shrink: 0;
		border-radius: 8px;
		background: var(--accentL);
		color: var(--accentD);
		font-size: 13px;
		font-weight: 800;
	}

	.steps h3 {
		font-size: 14px;
		font-weight: 700;
		color: var(--text);
		margin: 2px 0 3px;
	}

	.steps p,
	.tip p {
		font-size: 12px;
		line-height: 1.6;
		color: var(--text2);
		margin: 0;
	}

	.steps .sub-note {
		margin-top: 3px;
	}

	.tip strong {
		color: var(--text);
		font-size: 13px;
	}

	.tip {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		background: var(--surface2);
		border-radius: 10px;
		padding: 10px 12px;
		margin-top: 16px;
	}

	.tip svg {
		color: var(--green);
		flex-shrink: 0;
		margin-top: 1px;
	}

	.primary-btn {
		width: 100%;
		border: none;
		border-radius: 9px;
		background: linear-gradient(135deg, var(--accent), var(--green));
		color: white;
		font-size: 14px;
		font-weight: 700;
		padding: 11px 16px;
		margin-top: 16px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.primary-btn:hover {
		opacity: 0.88;
	}

	@media (max-height: 620px) {
		.modal {
			padding: 16px;
		}

		.modal-header {
			margin-bottom: 12px;
		}

		.steps {
			gap: 10px;
		}

		.tip {
			margin-top: 12px;
		}

		.primary-btn {
			margin-top: 12px;
		}
	}
</style>
