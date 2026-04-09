import Chart from "chart.js/auto";
import type { ChartType } from "chart.js";
import type { Period, Stock, StockHistoryPoint } from "../models/stock.types";

// Instance actuelle du graphique
let chartInstance: Chart | null = null;

// Convertit la période choisie en nombre de jours
function getDaysFromPeriod(period: Period): number | null {
  switch (period) {
    case "7d":
      return 7;
    case "1m":
      return 30;
    case "3m":
      return 90;
    case "6m":
      return 180;
    case "all":
      return null;
  }
}

// Retourne l'historique filtré selon la période choisie
function getFilteredHistory(
  history: StockHistoryPoint[],
  period: Period,
): StockHistoryPoint[] {
  const days = getDaysFromPeriod(period);

  if (days === null) {
    return history;
  }

  return history.slice(-days);
}

// Formate une date pour l'affichage sur le graphique
function formatDateLabel(date: string): string {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

// Supprime le graphique actuel s'il existe
export function clearStockChart(): void {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

// Affiche ou met à jour le graphique
export function renderStockChart(
  canvas: HTMLCanvasElement,
  stockA: Stock,
  stockB: Stock,
  period: Period,
  chartType: ChartType,
): void {
  const filteredHistoryA = getFilteredHistory(stockA.history, period);
  const filteredHistoryB = getFilteredHistory(stockB.history, period);

  clearStockChart();

  chartInstance = new Chart(canvas, {
    type: chartType,
    data: {
      labels: filteredHistoryA.map((point) => formatDateLabel(point.date)),
      datasets: [
        {
          label: `${stockA.symbol} - ${stockA.name}`,
          data: filteredHistoryA.map((point) => point.price),
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: `${stockB.symbol} - ${stockB.name}`,
          data: filteredHistoryB.map((point) => point.price),
          borderWidth: 2,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}
