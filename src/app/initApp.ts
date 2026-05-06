import type { ChartType } from "chart.js";
import { fetchStocks } from "../features/stocks/api/stockApi";
import {
  clearStockChart,
  renderStockChart,
} from "../features/stocks/charts/stockChart";
import type { Period, Stock, StockHistoryPoint } from "../features/stocks/models/stock.types";
import { showMessage } from "../features/stocks/ui/messages";
import { renderStockForm } from "../features/stocks/ui/stockForm";
import { renderTicker } from "../features/ticker/stockTicker";
import { initTheme } from "../features/theme/themeToggle";

// ── Helpers ──────────────────────────────────────────────

function findStockBySymbol(stocks: Stock[], symbol: string): Stock | undefined {
  return stocks.find((s) => s.symbol === symbol);
}

function populateStockSelects(stocks: Stock[]): void {
  const s1 = document.querySelector("#symbol1");
  const s2 = document.querySelector("#symbol2");

  if (!(s1 instanceof HTMLSelectElement) || !(s2 instanceof HTMLSelectElement)) {
    throw new Error("Sélecteurs introuvables.");
  }

  const opts = stocks
    .map((s) => `<option value="${s.symbol}">${s.symbol} — ${s.name}</option>`)
    .join("");

  s1.innerHTML = `<option value="">Sélectionner</option>${opts}`;
  s2.innerHTML = `<option value="">Sélectionner</option>${opts}`;

  if (stocks.length >= 2) {
    s1.value = stocks[0].symbol;
    s2.value = stocks[1].symbol;
  }
}

function sliceByPeriod(history: StockHistoryPoint[], period: Period): StockHistoryPoint[] {
  const map: Record<Period, number | null> = {
    "7d": 7, "1m": 30, "3m": 90, "6m": 180, "all": null,
  };
  const days = map[period];
  return days !== null ? history.slice(-days) : history;
}

interface PeriodStats {
  high: number;
  low: number;
  change: number;
  changePct: number;
}

function computeStats(history: StockHistoryPoint[]): PeriodStats {
  if (history.length < 2) {
    return { high: 0, low: 0, change: 0, changePct: 0 };
  }
  const prices = history.map((p) => p.price);
  const first = prices[0];
  const last  = prices[prices.length - 1];
  return {
    high:      Math.max(...prices),
    low:       Math.min(...prices),
    change:    last - first,
    changePct: ((last - first) / first) * 100,
  };
}

function fmt(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

function changeBadge(pct: number): string {
  const up    = pct >= 0;
  const arrow = up ? "▲" : "▼";
  const sign  = up ? "+" : "";
  const cls   = up ? "badge--up" : "badge--down";
  return `<span class="change-badge ${cls}">${arrow} ${sign}${fmt(pct)}%</span>`;
}

// ── Render stock cards ───────────────────────────────────

function renderStockInfos(stock1: Stock, stock2: Stock, period: Period): void {
  const result = document.querySelector("#result");
  if (!(result instanceof HTMLDivElement)) throw new Error("Zone résultat introuvable.");

  function card(stock: Stock): string {
    const h   = sliceByPeriod(stock.history, period);
    const stats = computeStats(h);
    const up  = stats.change >= 0;

    return `
      <article class="stock-block">
        <div class="stock-block__top">
          <div>
            <h2 class="stock-symbol">${stock.symbol}</h2>
            <p class="stock-name">${stock.name}</p>
          </div>
          ${changeBadge(stats.changePct)}
        </div>

        <div class="stock-price">
          ${fmt(stock.currentPrice)} <span class="stock-currency">${stock.currency}</span>
        </div>

        <div class="stock-meta">
          <span class="sector-badge">${stock.sector}</span>
        </div>

        <div class="stock-stats">
          <div class="stat-item">
            <span class="stat-label">Haut</span>
            <span class="stat-value">${fmt(stats.high)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Bas</span>
            <span class="stat-value">${fmt(stats.low)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Variation</span>
            <span class="stat-value ${up ? "stat--up" : "stat--down"}">
              ${up ? "+" : ""}${fmt(stats.change)} ${stock.currency}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  result.innerHTML = `
    <div class="result-content">
      ${card(stock1)}
      ${card(stock2)}
    </div>
  `;
}

// ── Render chart header ──────────────────────────────────

const CHART_COLORS = ["#8b5cf6", "#06b6d4"] as const;

function renderChartHeader(stock1: Stock, stock2: Stock, period: Period): void {
  const header = document.querySelector("#chartHeader");
  if (!(header instanceof HTMLDivElement)) return;

  const PERIOD_LABELS: Record<Period, string> = {
    "7d": "7 jours", "1m": "1 mois", "3m": "3 mois", "6m": "6 mois", "all": "Tout",
  };

  function chip(stock: Stock, color: string): string {
    const h = sliceByPeriod(stock.history, period);
    const stats = computeStats(h);
    return `
      <div class="chart-chip">
        <span class="chart-chip__dot" style="background:${color}"></span>
        <strong>${stock.symbol}</strong>
        <span class="chart-chip__price">${fmt(stock.currentPrice)} ${stock.currency}</span>
        ${changeBadge(stats.changePct)}
      </div>
    `;
  }

  header.innerHTML = `
    <div class="chart-header__chips">
      ${chip(stock1, CHART_COLORS[0])}
      ${chip(stock2, CHART_COLORS[1])}
    </div>
    <span class="chart-period-label">${PERIOD_LABELS[period]}</span>
  `;
}

// ── Clear ────────────────────────────────────────────────

function clearResults(): void {
  const result = document.querySelector("#result");
  const header = document.querySelector("#chartHeader");

  if (result instanceof HTMLDivElement) {
    result.innerHTML = `
      <div class="empty-state">
        <p class="empty-icon">📊</p>
        <h2>Prêt à comparer</h2>
        <p>Sélectionne deux actions et clique sur "Comparer les actions →"</p>
      </div>
    `;
  }

  if (header instanceof HTMLDivElement) header.innerHTML = "";

  clearStockChart();
}

// ── Init ─────────────────────────────────────────────────

export async function initApp(): Promise<void> {
  const app = document.querySelector("#app");
  if (!(app instanceof HTMLDivElement)) throw new Error("App introuvable.");

  initTheme();
  renderStockForm(app);
  showMessage("Chargement des données...", "info");

  const stocks = await fetchStocks();
  renderTicker(app, stocks);
  populateStockSelects(stocks);

  showMessage("", "info");

  const btn    = document.querySelector("#loadBtn");
  const canvas = document.querySelector("#stockChart");

  if (!(btn instanceof HTMLButtonElement) || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Éléments principaux introuvables.");
  }

  btn.addEventListener("click", () => {
    const s1        = document.querySelector("#symbol1");
    const s2        = document.querySelector("#symbol2");
    const period    = document.querySelector("#period");
    const chartType = document.querySelector("#chartType");

    if (
      !(s1 instanceof HTMLSelectElement) ||
      !(s2 instanceof HTMLSelectElement) ||
      !(period instanceof HTMLSelectElement) ||
      !(chartType instanceof HTMLSelectElement)
    ) {
      showMessage("Sélection invalide.", "error");
      clearResults();
      return;
    }

    if (!s1.value || !s2.value) {
      showMessage("Veuillez sélectionner deux actions.", "error");
      clearResults();
      return;
    }

    if (s1.value === s2.value) {
      showMessage("Veuillez choisir deux actions différentes.", "error");
      clearResults();
      return;
    }

    const stock1 = findStockBySymbol(stocks, s1.value);
    const stock2 = findStockBySymbol(stocks, s2.value);

    if (!stock1 || !stock2) {
      showMessage("Impossible de retrouver les actions sélectionnées.", "error");
      clearResults();
      return;
    }

    const p = period.value as Period;
    const t = chartType.value as ChartType;

    renderStockInfos(stock1, stock2, p);
    renderChartHeader(stock1, stock2, p);
    renderStockChart(canvas, stock1, stock2, p, t);

    showMessage("Données chargées avec succès.", "info");
  });
}
