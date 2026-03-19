import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <h1>MyBourse</h1>
    <p>Base Vite + TypeScript OK</p>
  `;
}
