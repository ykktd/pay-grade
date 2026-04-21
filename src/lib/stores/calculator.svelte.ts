import type { Grade, PersistedState } from "$lib/types";
import { browser } from "$app/environment";
import { SNAP_STEP, SLIDER_MAX, STORAGE_KEY } from "$lib/types";
import {
  redistributeLower,
  computeAutoTop,
  snapToStep,
  clamp,
} from "$lib/logic/redistribute";

const DEFAULT_GRADES: Grade[] = [
  { id: "1", num: 15, count: 4, payment: 2000 },
  { id: "2", num: 16, count: 6, payment: 1500 },
  { id: "3", num: 17, count: 3, payment: 1000 },
];

function loadFromStorage(): PersistedState | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

class CalculatorStore {
  total = $state<number>(20_000);
  grades = $state<Grade[]>([...DEFAULT_GRADES]);
  topOverridden = $state<boolean>(false);

  topGrade = $derived(this.grades[0]);
  lower = $derived(this.grades.slice(1));
  totalPeople = $derived(this.grades.reduce((s, g) => s + g.count, 0));
  manualSum = $derived(this.lower.reduce((s, g) => s + g.payment * g.count, 0));
  autoTop = $derived(
    this.topGrade && this.topGrade.count > 0
      ? computeAutoTop(this.total, this.lower, this.topGrade.count)
      : 0,
  );
  topPayment = $derived(
    this.topOverridden ? (this.topGrade?.payment ?? 0) : this.autoTop,
  );
  actualTotal = $derived(
    this.lower.reduce((s, g) => s + g.payment * g.count, 0) +
      this.topPayment * (this.topGrade?.count ?? 0),
  );
  balanced = $derived(Math.abs(this.actualTotal - this.total) <= 1);

  constructor() {
    const saved = loadFromStorage();
    if (saved) {
      this.total = saved.total;
      this.grades = saved.grades;
      this.topOverridden = saved.topOverridden;
    }

    if (browser) {
      $effect.root(() => {
        $effect(() => {
          const state: Omit<PersistedState, "darkMode"> = {
            total: this.total,
            grades: this.grades,
            topOverridden: this.topOverridden,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        });
      });
    }
  }

  setTotal = (val: number) => {
    this.total = Math.max(0, val);
  };

  setTopManual = (val: number) => {
    const snapped = snapToStep(clamp(val, 0, SLIDER_MAX));
    const minTop = this.lower.length > 0 ? this.lower[0].payment : 0;
    const newTop = Math.max(snapped, minTop);
    const target = this.total - newTop * this.topGrade.count;
    const adjusted = redistributeLower(this.lower, target, SNAP_STEP);
    this.grades = [{ ...this.topGrade, payment: newTop }, ...adjusted];
    this.topOverridden = true;
  };

  setTopAuto = () => {
    this.topOverridden = false;
    this.grades = [{ ...this.topGrade, payment: this.autoTop }, ...this.lower];
  };

  setLowerPayment = (id: string, val: number) => {
    const snapped = snapToStep(clamp(val, 0, SLIDER_MAX));
    const idx = this.lower.findIndex((g) => g.id === id);
    if (idx === -1) return;

    const floor = idx < this.lower.length - 1 ? this.lower[idx + 1].payment : 0;
    const ceil = idx > 0 ? this.lower[idx - 1].payment : this.topPayment;
    const v = clamp(snapped, floor, ceil);

    if (!this.topOverridden) {
      this.grades = [
        this.topGrade,
        ...this.lower.map((g) => (g.id === id ? { ...g, payment: v } : g)),
      ];
      return;
    }

    const targetLowerSum = this.total - this.topPayment * this.topGrade.count;
    const movedSubtotal = v * this.lower[idx].count;
    const otherTarget = targetLowerSum - movedSubtotal;
    const others = this.lower.filter((_, i) => i !== idx);
    const adjusted = redistributeLower(others, otherTarget, SNAP_STEP);

    let ptr = 0;
    const fullLower = this.lower.map((g, i) =>
      i === idx ? { ...g, payment: v } : (adjusted[ptr++] ?? g),
    );

    for (let i = 1; i < fullLower.length; i++) {
      if (fullLower[i].payment > fullLower[i - 1].payment) {
        fullLower[i] = { ...fullLower[i], payment: fullLower[i - 1].payment };
      }
    }

    this.grades = [this.topGrade, ...fullLower];
  };

  addGrade = () => {
    const lastNum =
      this.grades.length > 0 ? this.grades[this.grades.length - 1].num : 0;
    const lastPayment =
      this.grades.length > 0 ? this.grades[this.grades.length - 1].payment : 0;
    const newGrade: Grade = {
      id: crypto.randomUUID(),
      num: lastNum + 1,
      count: 3,
      payment: Math.max(0, lastPayment - SNAP_STEP),
    };
    this.grades = [...this.grades, newGrade];
    this.topOverridden = false;
  };

  removeGrade = (id: string) => {
    if (this.grades.length <= 1) return;
    this.grades = this.grades.filter((g) => g.id !== id);
    this.topOverridden = false;
  };

  updateGradeNum = (id: string, num: number) => {
    this.grades = this.grades.map((g) => (g.id === id ? { ...g, num } : g));
  };

  updateGradeCount = (id: string, delta: number) => {
    this.grades = this.grades.map((g) =>
      g.id === id ? { ...g, count: Math.max(1, g.count + delta) } : g,
    );
  };

  reorderGrades = (from: number, to: number) => {
    if (from === to) return;
    const arr = [...this.grades];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    this.grades = arr;
    this.topOverridden = false;
  };
}

export const calculator = new CalculatorStore();
