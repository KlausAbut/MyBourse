import type { Period, StockApiResponse } from '../models/stock.types';

export async function fetchStockHistory(
    symbol: string,
    period: Period,
): Promise<StockApiResponse> {
    await new Promise ((resolve) => setTimeout(resolve, 800));

    const totalPoints = getTotalPoints(period);

    const prices = Array.from({ length: totalPoints }, (_, index) => ({
        date: `Jour ${index + 1}`,
        price: generateFakePrice(symbol, index)
    }));

    return {
        symbol,
        prices    
    };
}

function getTotalPoints(period: Period): number {
    switch (period) {
        case '7d':
            return 7;
        case '1m':
            return 30;
        case '1y':
            return 12;
        default:
            return 7;
    }
}

function generateFakePrice(symbol: string, index: number): number {
    const basePrices: Record<string, number> = {
        AAPL: 180,
        TSLA: 210,
        MSFT: 420,
        GOOGL: 140,
        NVDA: 850,
        META: 470
    };
    const base = basePrices[symbol] ?? 100;
    const variation = Math.round((Math.random() - 0.5) * 20);

    return base + index * 2 + variation;
}