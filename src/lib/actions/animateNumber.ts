export function animateNumber(node: HTMLElement, value: number) {
	let from = value;
	let to = value;
	let rafId: number | null = null;
	let startTime: number | null = null;
	const DURATION = 180;

	function easeOutCubic(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}

	function tick(now: number) {
		if (startTime === null) startTime = now;
		const elapsed = now - startTime;
		const t = Math.min(elapsed / DURATION, 1);
		const eased = easeOutCubic(t);
		node.textContent = Math.round(from + (to - from) * eased).toLocaleString('ja-JP');
		if (t < 1) {
			rafId = requestAnimationFrame(tick);
		} else {
			from = to;
			rafId = null;
			startTime = null;
		}
	}

	node.textContent = value.toLocaleString('ja-JP');

	return {
		update(newValue: number) {
			if (newValue === to) return;
			from = Math.round(from + (to - from) * (startTime ? easeOutCubic(Math.min((performance.now() - startTime) / DURATION, 1)) : 1));
			to = newValue;
			startTime = null;
			if (rafId !== null) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(tick);
		},
		destroy() {
			if (rafId !== null) cancelAnimationFrame(rafId);
		}
	};
}
