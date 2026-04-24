export interface Grade {
	id: string;
	num: number;
	count: number;
	payment: number;
}

export interface PersistedState {
	total: number;
	grades: Grade[];
	topOverridden: boolean;
	darkMode: boolean;
}

export const SNAP_STEP = 50;
export const SLIDER_MAX = 5_000;
export const SLIDER_HARD_MAX = 10_000;
export const STORAGE_KEY = 'pay-grade-state';

export const GRADE_COLORS = {
	top: { main: '#1faa6b', light: '#e3f8ef', dark: '#17905c' },
	lower: { main: '#3a7ef6', light: '#eaf1ff', dark: '#2a6ee0' }
} as const;
