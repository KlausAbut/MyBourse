import type { Stock } from "../stocks/models/stock.types";

function buildTickerItem(stock: Stock): string {
  const lastTwo = stock.history.slice(-2);
  const change =
    lastTwo.length === 2
      ? ((lastTwo[1].price - lastTwo[0].price) / lastTwo[0].price) * 100
      : 0;

  const arrow = change >= 0 ? "▲" : "▼";
  const cls = change >= 0 ? "ticker-item--up" : "ticker-item--down";
  const sign = change >= 0 ? "+" : "";

  return `
    <span class="ticker-item ${cls}">
      <strong>${stock.symbol}</strong>
      ${stock.currentPrice.toFixed(2)} ${stock.currency}
      <em>${arrow} ${sign}${change.toFixed(2)}%</em>
    </span>
  `;
}

export function renderTicker(container: HTMLElement, stocks: Stock[]): void {
  const items = stocks.map(buildTickerItem).join("");

  // Duplicate items so the animation loops seamlessly
  const ticker = document.createElement("div");
  ticker.className = "ticker-bar";
  ticker.setAttribute("aria-hidden", "true");
  ticker.innerHTML = `
    <div class="ticker-track">
      ${items}
      ${items}
    </div>
  `;

  container.insertAdjacentElement("afterbegin", ticker);
}
