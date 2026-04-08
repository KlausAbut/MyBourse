export function renderStockForm(container: HTMLElement): void {
  container.innerHTML = `
    <section class="app-shell">
      <div class="card">
        <div class="heading">
          <p class="eyebrow">Dashboard boursier</p>
          <h1>MyBourse</h1>
          <p class="subtitle">Comparer deux actions sur une période donnée</p>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="symbol1">Action 1</label>
            <select id="symbol1">
              <option value="AAPL">AAPL</option>
              <option value="TSLA" selected>TSLA</option>
              <option value="MSFT">MSFT</option>
            </select>
          </div>

          <div class="field">
            <label for="symbol2">Action 2</label>
            <select id="symbol2">
              <option value="GOOGL">GOOGL</option>
              <option value="NVDA" selected>NVDA</option>
              <option value="META">META</option>
            </select>
          </div>

          <div class="field">
            <label for="period">Période</label>
            <select id="period">
              <option value="7d" selected>7 jours</option>
              <option value="1m">1 mois</option>
              <option value="1y">1 an</option>
            </select>
          </div>
        </div>

        <button id="loadBtn" type="button" class="primary-btn">
          Charger les données
        </button>

        <p id="message" class="message"></p>

        <div id="result" class="result-card">
          <div class="empty-state">
            <h2>Prêt à comparer</h2>
            <p>Sélectionne deux actions et clique sur “Charger les données”.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}