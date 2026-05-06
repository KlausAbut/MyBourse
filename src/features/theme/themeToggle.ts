const STORAGE_KEY = "mybourse-theme";
const DARK  = "dark";
const LIGHT = "light";

type Theme = typeof DARK | typeof LIGHT;

function getPreferred(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === DARK || saved === LIGHT) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
}

function apply(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);

  const btn = document.querySelector<HTMLButtonElement>("#themeBtn");
  if (!btn) return;
  btn.textContent  = theme === DARK ? "☀️" : "🌙";
  btn.title        = theme === DARK ? "Passer en mode clair" : "Passer en mode sombre";
  btn.setAttribute("aria-label", btn.title);
}

export function initTheme(): void {
  apply(getPreferred());

  const btn = document.createElement("button");
  btn.id        = "themeBtn";
  btn.className = "theme-toggle";
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") as Theme;
    apply(current === DARK ? LIGHT : DARK);
  });

  document.body.appendChild(btn);
  // text/title set by apply() above — re-run to populate the new button
  apply(getPreferred());
}
