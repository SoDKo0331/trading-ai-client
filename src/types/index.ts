export interface TradingRecommendation {
    entryPrice?: string;
    stopLoss?: string;
    takeProfit1?: string;
    takeProfit2?: string;
    riskRewardRatio?: string;
}

export interface AnalysisMethod {
    method: string;
    findings: string[];
    signal: "BUY" | "SELL" | "HOLD";
    strength: number; // 1-10
}

export interface AnalysisData {
    symbol?: string;
    timeframe?: string;
    signal: "BUY" | "SELL" | "HOLD";
    confidence: number;

    // Advanced Multi-Method Analysis (5 methods)
    priceAction?: AnalysisMethod;
    fibonacci?: AnalysisMethod;
    elliotWave?: AnalysisMethod;
    volumeAnalysis?: AnalysisMethod;
    marketStructure?: AnalysisMethod;

    // Traditional Analysis
    technical: string[];
    fundamental: string[];

    // Trading Recommendations
    recommendation?: TradingRecommendation;

    // Advanced Image Context
    scenarios?: {
        bullishCondition: string;
        bearishCondition: string;
    };
    estimatedData?: {
        currentPrice: string;
        candleType: string;
    };

    reasoning: string;
    warnings?: string[];
}

export interface AnalyzeResponse {
    data?: AnalysisData;
    error?: string;
}
