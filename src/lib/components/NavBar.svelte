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

		<button
			class="theme-toggle"
			class:dark={theme.darkMode}
			onclick={() => theme.toggle()}
			aria-label={theme.darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
		>
			<span class="toggle-icon">
				{#if theme.darkMode}
					<!-- Moon -->
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{:else}
					<!-- Sun -->
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
				{/if}
			</span>
			<span class="toggle-thumb"></span>
		</button>
	</div>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: 46px;
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

	.theme-toggle {
		position: relative;
		width: 36px;
		height: 20px;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		background: var(--border2);
		padding: 0;
		transition: background-color 0.25s;
		display: flex;
		align-items: center;
		padding: 0 3px;
	}

	.theme-toggle.dark {
		background: var(--accent);
	}

	.toggle-icon {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		color: white;
		opacity: 0.8;
		pointer-events: none;
	}

	.toggle-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.25s;
		flex-shrink: 0;
	}

	.theme-toggle.dark .toggle-thumb {
		transform: translateX(16px);
	}
</style>
