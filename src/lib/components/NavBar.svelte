<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
</script>

<nav>
	<div class="nav-inner">
		<div class="nav-brand">
			<svg width="26" height="26" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<defs>
					<linearGradient id="icon-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stop-color="#3a7ef6" />
						<stop offset="100%" stop-color="#1faa6b" />
					</linearGradient>
				</defs>
				<rect width="40" height="40" rx="10" fill="url(#icon-grad)" />
				<text x="20" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="white" font-family="-apple-system,sans-serif">¥</text>
				<rect x="10" y="24" width="4" height="10" rx="1" fill="white" opacity="0.9" />
				<rect x="16" y="21" width="4" height="13" rx="1" fill="white" opacity="0.75" />
				<rect x="22" y="27" width="4" height="7" rx="1" fill="white" opacity="0.6" />
				<rect x="28" y="23" width="4" height="11" rx="1" fill="white" opacity="0.85" />
			</svg>
			<span class="nav-title">金額計算</span>
		</div>

		<div class="theme-segment" role="group" aria-label="テーマ切り替え">
			<button
				class="theme-icon-button"
				class:is-active={!theme.darkMode}
				onclick={() => {
					if (theme.darkMode) theme.toggle();
				}}
				aria-label="ライトモードに設定"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="5" />
					<line x1="12" y1="1" x2="12" y2="3" />
					<line x1="12" y1="21" x2="12" y2="23" />
					<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
					<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
					<line x1="1" y1="12" x2="3" y2="12" />
					<line x1="21" y1="12" x2="23" y2="12" />
					<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
					<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
				</svg>
			</button>

			<button
				class="theme-icon-button"
				class:is-active={theme.darkMode}
				onclick={() => {
					if (!theme.darkMode) theme.toggle();
				}}
				aria-label="ダークモードに設定"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			</button>
		</div>


	</div>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: var(--nav-height);
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		transition: background-color 0.3s;
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		padding: 0 16px;
		max-width: 480px;
		margin: 0 auto;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.nav-title {
		font-size: 18px;
		font-weight: 800;
		color: var(--text);
	}

	.theme-segment {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		padding: 4px;
		background: var(--surface2);
		border: 1px solid var(--border);
	}

	.theme-icon-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 9999px;
		background: transparent;
		color: var(--text2);
		cursor: pointer;
		transition:
			background-color 0.25s,
			color 0.25s,
			box-shadow 0.25s;
	}

	.theme-icon-button:hover {
		color: var(--text);
	}

	.theme-icon-button.is-active {
		/* ライト時は背景を白にしてアイコンを黒寄りに固定 */
		background: var(--surface);
		color: var(--text);
		box-shadow: var(--shadow);
	}

	.theme-icon-button svg {
		display: flex;
	}

	:global(.dark) .theme-icon-button.is-active {
		background: #4a4740;
		color: #f0ede8;
	}
</style>
