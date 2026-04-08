export type Period = '7d' | '1m' | '1y';

export interface StockPoint {
    date: string;
    price: number;
}

export interface StockApiResponse {
    symbol: string;
    prices: StockPoint[];
}