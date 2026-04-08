import Chart from "chart.js/auto";
import type { ChartType } from "chart.js";
import type { Period, Stock } from "../models/stock.types";

// Instance actuelle du graphique
let chartInstance: Chart | null = null;

// Convertit la période choisie en nombre de jours
function getDaysFromPeriod(period: Period): number {
  switch (period) {
    case "3d":
      return 3;
    case "5d":
      return 5;
  }
}

// Récupère les labels du graphique à partir des dates
function buildLabels(stock: Stock, days: number): string[] {
  return stock.history.slice(-days).map((point) => point.date);
}

// Récupère les prix d'une action sur la période choisie
function buildPrices(stock: Stock, days: number): number[] {
  return stock.history.slice(-days).map((point) => point.price);
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
  const days = getDaysFromPeriod(period);

  clearStockChart();

  chartInstance = new Chart(canvas, {
    type: chartType,
    data: {
      labels: buildLabels(stockA, days),
      datasets: [
        {
          label: `${stockA.symbol} - ${stockA.name}`,
          data: buildPrices(stockA, days),
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: `${stockB.symbol} - ${stockB.name}`,
          data: buildPrices(stockB, days),
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
