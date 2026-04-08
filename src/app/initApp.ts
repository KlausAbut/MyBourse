import { fetchStockHistory } from '../features/stocks/api/stockApi';
import type { Period } from '../features/stocks/models/stock.types';
import { renderStockForm } from '../features/stocks/ui/stockForm';
import { showMessage } from '../features/stocks/ui/messages';

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    throw new Error('app introuvable');
  }

  renderStockForm(app);

  const btn = document.querySelector<HTMLButtonElement>('#loadBtn');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    const s1 = document.querySelector<HTMLSelectElement>('#symbol1')?.value;
    const s2 = document.querySelector<HTMLSelectElement>('#symbol2')?.value;
    const period = document.querySelector<HTMLSelectElement>('#period')?.value as Period | undefined;
    const result = document.querySelector<HTMLDivElement>('#result');

    if (!s1 || !s2 || !period || !result) {
      showMessage('Sélection invalide', 'error');
      return;
    }

    if (s1 === s2) {
      showMessage('Choisir 2 actions différentes', 'error');
      return;
    }

    try {
      showMessage('Chargement des données...', 'info');

      const [stock1, stock2] = await Promise.all([
        fetchStockHistory(s1, period),
        fetchStockHistory(s2, period)
      ]);

      result.innerHTML = `
        <div class="result-content">
          <div class="stock-block">
            <h2>${stock1.symbol}</h2>
            <ul>
              ${stock1.prices.map((point) => `<li>${point.date} : ${point.price} €</li>`).join('')}
            </ul>
          </div>

          <div class="stock-block">
            <h2>${stock2.symbol}</h2>
            <ul>
              ${stock2.prices.map((point) => `<li>${point.date} : ${point.price} €</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      showMessage('Données chargées avec succès', 'info');
    } catch {
      showMessage('Erreur lors du chargement des données', 'error');
    }
  });
}