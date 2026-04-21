import { browser } from "$app/environment";

const THEME_KEY = "pay-grade-dark";

export function createThemeStore() {
  let darkMode = $state(false);

  // 初期化の責務（同期）
  if (browser) {
    const saved = localStorage.getItem(THEME_KEY);
    darkMode =
      saved !== null
        ? saved === "true"
        : (window.matchMedia?.("(prefers-color-scheme: dark)").matches ??
          false);
  }

  // 副作用の責務
  // モジュールレベルでのインスタンス化に備え、rootでラップしてOrphan Errorを回避
  if (browser) {
    $effect.root(() => {
      $effect(() => {
        localStorage.setItem(THEME_KEY, String(darkMode));
        document.documentElement.classList.toggle("dark", darkMode);
      });
    });
  }

  return {
    get darkMode() {
      return darkMode;
    },
    toggle: () => {
      darkMode = !darkMode;
    },
  };
}

// コンポーネントツリー外（モジュール評価時）での実行
export const theme = createThemeStore();
