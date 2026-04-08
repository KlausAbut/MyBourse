import { API_BASE_URL } from "../../../shared/config/env";
import { AppError } from "../../../shared/errors/AppError";
import type { Stock } from "../models/stock.types";

// Vérifie qu'un point d'historique est valide
function isStockHistoryPoint(value: unknown): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const point = value as Record<string, unknown>;

  return (
    typeof point.date === "string" &&
    typeof point.price === "number" &&
    typeof point.volume === "number"
  );
}

// Vérifie qu'une action est valide
function isStock(value: unknown): value is Stock {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const stock = value as Record<string, unknown>;

  return (
    typeof stock.symbol === "string" &&
    typeof stock.name === "string" &&
    typeof stock.sector === "string" &&
    typeof stock.currentPrice === "number" &&
    typeof stock.currency === "string" &&
    Array.isArray(stock.history) &&
    stock.history.every(isStockHistoryPoint)
  );
}

// Récupère toutes les actions
export async function fetchStocks(): Promise<Stock[]> {
  let response: Response;

  try {
    response = await fetch(API_BASE_URL);
  } catch {
    throw new AppError("Impossible de contacter l'API.");
  }

  if (!response.ok) {
    throw new AppError(
      `Erreur API : ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isStock)) {
    throw new AppError("Les données reçues sont invalides.");
  }

  return data;
}
