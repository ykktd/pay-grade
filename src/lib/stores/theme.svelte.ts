const THEME_KEY = 'pay-grade-dark';

class ThemeStore {
	darkMode = $state<boolean>(false);

	constructor() {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem(THEME_KEY);
			if (saved !== null) {
				this.darkMode = saved === 'true';
			} else {
				this.darkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
			}
		}

		$effect(() => {
			localStorage.setItem(THEME_KEY, String(this.darkMode));
			if (this.darkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
	}

	toggle() {
		this.darkMode = !this.darkMode;
	}
}

export const theme = new ThemeStore();
