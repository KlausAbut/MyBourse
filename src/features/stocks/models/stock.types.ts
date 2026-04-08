// Représente un point dans l'historique d'une action
export interface StockHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

// Représente une action complète renvoyée par l'API
export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  currency: string;
  history: StockHistoryPoint[];
}

// Les périodes possibles dans l'application
export type Period = "3d" | "5d";
