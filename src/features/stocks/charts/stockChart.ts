import Chart from "chart.js/auto";
import type { ChartType } from "chart.js";
import type { Period, Stock, StockHistoryPoint } from "../models/stock.types";

let chartInstance: Chart | null = null;

const PALETTE = [
  { line: "#8b5cf6", fillTop: "rgba(139,92,246,0.28)", fillBot: "rgba(139,92,246,0)" },
  { line: "#06b6d4", fillTop: "rgba(6,182,212,0.22)",  fillBot: "rgba(6,182,212,0)" },
];

function getDaysFromPeriod(period: Period): number | null {
  switch (period) {
    case "7d":  return 7;
    case "1m":  return 30;
    case "3m":  return 90;
    case "6m":  return 180;
    case "all": return null;
  }
}

function getFilteredHistory(history: StockHistoryPoint[], period: Period): StockHistoryPoint[] {
  const days = getDaysFromPeriod(period);
  return days === null ? history : history.slice(-days);
}

function formatDateLabel(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function makeGradient(ctx: CanvasRenderingContext2D, height: number, top: string, bot: string): CanvasGradient {
  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, top);
  g.addColorStop(1, bot);
  return g;
}

export function clearStockChart(): void {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

export function renderStockChart(
  canvas: HTMLCanvasElement,
  stockA: Stock,
  stockB: Stock,
  period: Period,
  chartType: ChartType,
): void {
  const histA = getFilteredHistory(stockA.history, period);
  const histB = getFilteredHistory(stockB.history, period);
  const ctx2d  = canvas.getContext("2d")!;
  const height = canvas.offsetHeight || 320;

  clearStockChart();

  const isLine = chartType === "line";

  const gradA = makeGradient(ctx2d, height, PALETTE[0].fillTop, PALETTE[0].fillBot);
  const gradB = makeGradient(ctx2d, height, PALETTE[1].fillTop, PALETTE[1].fillBot);

  chartInstance = new Chart(canvas, {
    type: chartType,
    data: {
      labels: histA.map((p) => formatDateLabel(p.date)),
      datasets: [
        {
          label: `${stockA.symbol} — ${stockA.name}`,
          data: histA.map((p) => p.price),
          borderColor:     PALETTE[0].line,
          backgroundColor: isLine ? gradA : "rgba(139,92,246,0.55)",
          borderWidth:     isLine ? 2 : 1,
          pointRadius:     isLine ? 0 : undefined,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: PALETTE[0].line,
          fill:    isLine,
          tension: 0.35,
        },
        {
          label: `${stockB.symbol} — ${stockB.name}`,
          data: histB.map((p) => p.price),
          borderColor:     PALETTE[1].line,
          backgroundColor: isLine ? gradB : "rgba(6,182,212,0.45)",
          borderWidth:     isLine ? 2 : 1,
          pointRadius:     isLine ? 0 : undefined,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: PALETTE[1].line,
          fill:    isLine,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      interaction: {
        mode:      "index",
        intersect: false,
      },
      animation: {
        duration: 600,
        easing:   "easeInOutQuart",
      },
      plugins: {
        legend: {
          position: "top",
          align:    "end",
          labels: {
            color:           "#8b8fa8",
            font:            { size: 12, family: "Inter, system-ui, sans-serif" },
            usePointStyle:   true,
            pointStyleWidth: 10,
            padding:         24,
            boxHeight:       6,
          },
        },
        tooltip: {
          backgroundColor: "#0f101a",
          borderColor:     "#2a2d4a",
          borderWidth:     1,
          titleColor:      "#e8e9f3",
          bodyColor:       "#8b8fa8",
          padding:         14,
          cornerRadius:    10,
          titleFont:       { size: 12, weight: "bold" },
          bodyFont:        { size: 13 },
          displayColors:   true,
          boxWidth:        8,
          boxHeight:       8,
          callbacks: {
            label: (item) =>
              `  ${item.dataset.label}: ${Number(item.parsed.y).toFixed(2)} USD`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color:     "rgba(30,32,53,0.8)",
            tickLength: 0,
          },
          border: { display: false },
          ticks: {
            color: "#555878",
            font:  { size: 11 },
            maxRotation: 0,
            maxTicksLimit: 10,
          },
        },
        y: {
          position: "right",
          grid: {
            color: "rgba(30,32,53,0.8)",
          },
          border: { display: false, dash: [4, 4] },
          ticks: {
            color: "#555878",
            font:  { size: 11 },
            callback: (v) => `$${Number(v).toFixed(0)}`,
          },
        },
      },
    },
  });
}
