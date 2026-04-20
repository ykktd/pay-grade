import type { Grade } from '$lib/types';
import { SNAP_STEP } from '$lib/types';

export function redistributeLower(lower: Grade[], targetSum: number, step: number = SNAP_STEP): Grade[] {
	if (lower.length === 0) return [];

	const p = lower.map((g) => g.payment);
	let diff = p.reduce((s, v, i) => s + v * lower[i].count, 0) - targetSum;
	let iter = 0;

	if (diff > 0) {
		while (diff > step * 0.5 && iter++ < 10000) {
			let done = false;
			for (let i = p.length - 1; i >= 0; i--) {
				const floor = i < p.length - 1 ? p[i + 1] : 0;
				if (p[i] - step >= floor) {
					p[i] -= step;
					diff -= lower[i].count * step;
					done = true;
					break;
				}
			}
			if (!done) break;
		}
	} else if (diff < 0) {
		while (-diff > step * 0.5 && iter++ < 10000) {
			let done = false;
			for (let i = p.length - 1; i >= 0; i--) {
				const ceil = i > 0 ? p[i - 1] : Infinity;
				if (p[i] + step <= ceil) {
					p[i] += step;
					diff += lower[i].count * step;
					done = true;
					break;
				}
			}
			if (!done) break;
		}
	}

	return lower.map((g, i) => ({ ...g, payment: p[i] }));
}

export function computeAutoTop(total: number, lower: Grade[], topCount: number): number {
	const manualSum = lower.reduce((s, g) => s + g.payment * g.count, 0);
	return Math.round((total - manualSum) / topCount);
}

export function snapToStep(value: number, step: number = SNAP_STEP): number {
	return Math.round(value / step) * step;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
