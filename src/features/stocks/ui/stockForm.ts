// Génère le formulaire principal de l'application
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
              <option value="">Choisir une action</option>
            </select>
          </div>

          <div class="field">
            <label for="symbol2">Action 2</label>
            <select id="symbol2">
              <option value="">Choisir une action</option>
            </select>
          </div>

          <div class="field">
            <label for="period">Période</label>
            <select id="period">
              <option value="7d">7 derniers jours</option>
              <option value="1m" selected>1 mois</option>
              <option value="3m">3 mois</option>
              <option value="6m">6 mois</option>
              <option value="all">Toute la période</option>
            </select>
          </div>

          <div class="field">
            <label for="chartType">Type de graphique</label>
            <select id="chartType">
              <option value="line" selected>Ligne</option>
              <option value="bar">Barres</option>
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

        <div class="chart-card">
          <canvas id="stockChart"></canvas>
        </div>
      </div>
    </section>
  `;
}
