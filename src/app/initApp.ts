import type { ChartType } from "chart.js";
import { fetchStocks } from "../features/stocks/api/stockApi";
import {
  clearStockChart,
  renderStockChart,
} from "../features/stocks/charts/stockChart";
import type { Period, Stock } from "../features/stocks/models/stock.types";
import { showMessage } from "../features/stocks/ui/messages";
import { renderStockForm } from "../features/stocks/ui/stockForm";
import { renderTicker } from "../features/ticker/stockTicker";

// Recherche une action selon son symbole
function findStockBySymbol(stocks: Stock[], symbol: string): Stock | undefined {
  return stocks.find((stock) => stock.symbol === symbol);
}

// Remplit les deux listes déroulantes avec les actions disponibles
function populateStockSelects(stocks: Stock[]): void {
  const select1 = document.querySelector("#symbol1");
  const select2 = document.querySelector("#symbol2");

  if (
    !(select1 instanceof HTMLSelectElement) ||
    !(select2 instanceof HTMLSelectElement)
  ) {
    throw new Error("Sélecteurs d'actions introuvables.");
  }

  const options = stocks
    .map(
      (stock) =>
        `<option value="${stock.symbol}">${stock.symbol} - ${stock.name}</option>`,
    )
    .join("");

  select1.innerHTML = `<option value="">Choisir une action</option>${options}`;
  select2.innerHTML = `<option value="">Choisir une action</option>${options}`;

  if (stocks.length >= 2) {
    select1.value = stocks[0].symbol;
    select2.value = stocks[1].symbol;
  }
}

// Affiche les informations principales des deux actions sélectionnées
function renderStockInfos(stock1: Stock, stock2: Stock): void {
  const result = document.querySelector("#result");

  if (!(result instanceof HTMLDivElement)) {
    throw new Error("Zone de résultat introuvable.");
  }

  result.innerHTML = `
    <div class="result-content">
      <article class="stock-block">
        <h2>${stock1.symbol}</h2>
        <p><strong>Nom :</strong> ${stock1.name}</p>
        <p><strong>Secteur :</strong> ${stock1.sector}</p>
        <p><strong>Prix actuel :</strong> ${stock1.currentPrice} ${stock1.currency}</p>
      </article>

      <article class="stock-block">
        <h2>${stock2.symbol}</h2>
        <p><strong>Nom :</strong> ${stock2.name}</p>
        <p><strong>Secteur :</strong> ${stock2.sector}</p>
        <p><strong>Prix actuel :</strong> ${stock2.currentPrice} ${stock2.currency}</p>
      </article>
    </div>
  `;
}

// Remet l'interface de résultat à l'état initial
function clearResults(): void {
  const result = document.querySelector("#result");

  if (result instanceof HTMLDivElement) {
    result.innerHTML = `
      <div class="empty-state">
        <h2>Prêt à comparer</h2>
        <p>Sélectionne deux actions et clique sur “Charger les données”.</p>
      </div>
    `;
  }

  clearStockChart();
}

// Initialise l'application
export async function initApp(): Promise<void> {
  const app = document.querySelector("#app");

  if (!(app instanceof HTMLDivElement)) {
    throw new Error("App introuvable.");
  }

  renderStockForm(app);
  showMessage("Chargement des actions...", "info");

  const stocks = await fetchStocks();
  renderTicker(app, stocks);
  populateStockSelects(stocks);

  showMessage("Sélectionnez deux actions puis chargez les données.", "info");

  const btn = document.querySelector("#loadBtn");
  const canvas = document.querySelector("#stockChart");

  if (
    !(btn instanceof HTMLButtonElement) ||
    !(canvas instanceof HTMLCanvasElement)
  ) {
    throw new Error("Éléments principaux introuvables.");
  }

  btn.addEventListener("click", () => {
    const s1 = document.querySelector("#symbol1");
    const s2 = document.querySelector("#symbol2");
    const period = document.querySelector("#period");
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
      showMessage(
        "Impossible de retrouver les actions sélectionnées.",
        "error",
      );
      clearResults();
      return;
    }

    renderStockInfos(stock1, stock2);
    renderStockChart(
      canvas,
      stock1,
      stock2,
      period.value as Period,
      chartType.value as ChartType,
    );

    showMessage("Données chargées avec succès.", "info");
  });
}
