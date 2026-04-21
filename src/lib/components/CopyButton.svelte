<script lang="ts">
	import { calculator } from '$lib/stores/calculator.svelte';

	let copied = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function buildCopyText(): string {
		const lines: string[] = [];
		if (calculator.topGrade) {
			lines.push(
				`${calculator.topGrade.num}期: ${calculator.topPayment.toLocaleString('ja-JP')}円`
			);
		}
		for (const g of calculator.lower) {
			lines.push(`${g.num}期: ${g.payment.toLocaleString('ja-JP')}円`);
		}
		return lines.join('\n');
	}

	const previewText = $derived(buildCopyText());

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(previewText);
			copied = true;
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => (copied = false), 2000);
		} catch {
			// フォールバック: テキストエリアを使用
			const ta = document.createElement('textarea');
			ta.value = previewText;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
			copied = true;
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div class="copy-section">
	<div class="section-inner">
		<button
			class="copy-btn"
			class:success={copied}
			onclick={handleCopy}
			aria-label="結果をコピー"
		>
			{#if copied}
				✓ コピーしました！
			{:else}
				結果をコピー
			{/if}
		</button>

		<pre class="preview">{previewText}</pre>
	</div>
</div>

<style>
	.copy-section {
		padding: 0 16px 32px;
		max-width: 480px;
		margin: 0 auto;
	}

	.section-inner {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.copy-btn {
		width: 100%;
		height: 48px;
		border: none;
		border-radius: 14px;
		background: linear-gradient(135deg, #3a7ef6, #2a6ee0);
		color: white;
		font-size: 17px;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 0 4px 16px rgba(58, 126, 246, 0.35);
		transition:
			background 0.25s,
			box-shadow 0.25s,
			transform 0.1s;
	}

	.copy-btn:active {
		transform: scale(0.98);
	}

	.copy-btn.success {
		background: linear-gradient(135deg, #1faa6b, #17905c);
		box-shadow: 0 4px 16px rgba(31, 170, 107, 0.35);
	}

	.preview {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
		font-size: 12px;
		color: var(--text2);
		background: var(--surface2);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 10px 12px;
		white-space: pre-wrap;
		word-break: break-all;
		margin: 0;
		line-height: 1.6;
	}
</style>
