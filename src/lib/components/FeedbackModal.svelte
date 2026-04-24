<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { PUBLIC_FORMSPREE_ENDPOINT } from '$env/static/public';

	let { open = $bindable(false) }: { open: boolean } = $props();

	let name = $state('');
	let message = $state('');
	let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');
	let errorMsg = $state('');

	function close() {
		if (status === 'sending') return;
		open = false;
	}

	function reset() {
		name = '';
		message = '';
		status = 'idle';
		errorMsg = '';
	}

	$effect(() => {
		if (!open) reset();
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!message.trim()) return;

		status = 'sending';
		errorMsg = '';

		try {
			const res = await fetch(PUBLIC_FORMSPREE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ name: name.trim() || '匿名', message: message.trim() })
			});

			if (res.ok) {
				status = 'success';
				setTimeout(() => {
					open = false;
				}, 1800);
			} else {
				status = 'error';
				errorMsg = '送信に失敗しました。しばらくしてからもう一度お試しください。';
			}
		} catch {
			status = 'error';
			errorMsg = '送信に失敗しました。ネットワーク接続を確認してください。';
		}
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="overlay" role="presentation" onclick={close} transition:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 200, start: 0.95 }}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="feedback-title"
		>
			<div class="modal-header">
				<h2 id="feedback-title">フィードバック</h2>
				<button class="close-btn" onclick={close} aria-label="閉じる" disabled={status === 'sending'}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>

			{#if status === 'success'}
				<div class="success-state">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10" />
						<polyline points="9 12 11 14 15 10" />
					</svg>
					<p>送信しました！ありがとうございます。</p>
				</div>
			{:else}
				<form onsubmit={handleSubmit}>
					<div class="field">
						<label for="fb-name">お名前<span class="optional">（任意）</span></label>
						<input
							id="fb-name"
							type="text"
							bind:value={name}
							placeholder="山田 太郎"
							disabled={status === 'sending'}
							maxlength="100"
						/>
					</div>

					<div class="field">
						<label for="fb-message">ご意見 <span class="required">*</span></label>
						<textarea
							id="fb-message"
							bind:value={message}
							placeholder="改善してほしい点や気になった点をお聞かせください"
							rows="5"
							disabled={status === 'sending'}
							maxlength="2000"
							required
						></textarea>
					</div>

					{#if status === 'error'}
						<p class="error-msg">{errorMsg}</p>
					{/if}

					<div class="actions">
						<button type="button" class="btn-cancel" onclick={close} disabled={status === 'sending'}>
							キャンセル
						</button>
						<button type="submit" class="btn-send" disabled={status === 'sending' || !message.trim()}>
							{status === 'sending' ? '送信中…' : '送信'}
						</button>
					</div>
				</form>
			{/if}
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
		max-width: 360px;
		padding: 20px;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.modal-header h2 {
		font-size: 17px;
		font-weight: 700;
		color: var(--text);
		margin: 0;
	}

	.close-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 9999px;
		background: var(--surface2);
		color: var(--text2);
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
	}

	.close-btn:hover:not(:disabled) {
		background: var(--border);
		color: var(--text);
	}

	.close-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	.field label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text);
	}

	.optional {
		font-weight: 400;
		color: var(--text3);
		margin-left: 4px;
	}

	.required {
		color: var(--red);
	}

	.field input,
	.field textarea {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--border2);
		border-radius: 8px;
		background: var(--surface);
		color: var(--text);
		font-size: 16px;
		font-family: inherit;
		transition: border-color 0.2s, box-shadow 0.2s;
		resize: vertical;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accentL);
	}

	.field input:disabled,
	.field textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.field textarea {
		min-height: 100px;
	}

	.error-msg {
		font-size: 13px;
		color: var(--red);
		margin: 0 0 14px;
	}

	.actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	.btn-cancel {
		padding: 9px 16px;
		border: 1px solid var(--border2);
		border-radius: 8px;
		background: transparent;
		color: var(--text2);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
	}

	.btn-cancel:hover:not(:disabled) {
		background: var(--surface2);
		color: var(--text);
	}

	.btn-cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-send {
		padding: 9px 20px;
		border: none;
		border-radius: 8px;
		background: linear-gradient(135deg, var(--accent), var(--green));
		color: white;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.btn-send:hover:not(:disabled) {
		opacity: 0.88;
	}

	.btn-send:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.success-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 24px 0 8px;
	}

	.success-state p {
		font-size: 15px;
		font-weight: 500;
		color: var(--text);
		margin: 0;
	}
</style>
