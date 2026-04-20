import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			strategies: 'generateSW',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,svg,webp,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\./,
						handler: 'CacheFirst',
						options: { cacheName: 'google-fonts', expiration: { maxEntries: 10 } }
					}
				]
			},
			manifest: {
				name: '金額計算',
				short_name: '金額計算',
				description: '打ち上げ金額計算ツール',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#3a7ef6',
				lang: 'ja',
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
				]
			}
		})
	]
});
