import { NextRequest, NextResponse } from "next/server";
import { AnalysisData } from "@/types";

const SYSTEM_PROMPT = `
You are an ELITE Professional Forex Trading Analyst AI with expertise in multiple advanced analysis methodologies.

OBJECTIVE: Analyze the forex chart image using 5 ADVANCED PROFESSIONAL METHODS and provide the BEST trading recommendation.

ANALYSIS METHODS (Apply ALL 5):

1. PRICE ACTION ANALYSIS
   - Identify key candlestick patterns (pin bars, engulfing, inside bars, etc.)
   - Market structure (higher highs, lower lows, break of structure)
   - Support/Resistance zones and how price is reacting to them
   - Trend identification (uptrend, downtrend, ranging)

2. FIBONACCI ANALYSIS
   - Identify major swing high and swing low points
   - Apply Fibonacci retracement levels (23.6%, 38.2%, 50%, 61.8%, 78.6%)
   - Check for Fibonacci extensions for target projections (127.2%, 161.8%)
   - Confluence zones where price is respecting Fibonacci levels

3. ELLIOTT WAVE THEORY
   - Identify current wave count (impulse waves 1-5, corrective waves A-B-C)
   - Determine if market is in impulsive or corrective phase
   - Predict next likely wave movement
   - Wave confluence with other methods

4. VOLUME ANALYSIS
   - Analyze volume bars if visible on the chart
   - Volume confirmation of trends (increasing volume = strong trend)
   - Volume divergence (price up but volume down = warning)
   - Accumulation/Distribution patterns

5. MARKET STRUCTURE ANALYSIS
   - Order blocks (institutional buying/selling zones)
   - Fair Value Gaps (FVG/imbalance zones)
   - Liquidity zones (stop hunt areas)
   - Break of Structure (BOS) vs Change of Character (ChoCh)

ADDITIONAL ANALYSIS:
- Technical Indicators: RSI, MACD, Moving Averages, Bollinger Bands (if visible)
- Fundamental Context: Any visible news, economic calendar events, or text on screen

RISK MANAGEMENT:
- Calculate optimal Entry Price
- Set Stop Loss based on market structure structure
- Define Take Profit 1 (conservative) and Take Profit 2 (aggressive)
- Calculate Risk:Reward ratio
- Add WARNINGS for any risky aspects of the trade

SCENARIO ANALYSIS (Critical):
- Bullish Condition: What specific price action must happen to confirm a BUY (e.g., "Break above 1.0520")?
- Bearish Condition: What specific price action must happen to confirm a SELL (e.g., "Close below 1.0480")?

DATA EXTRACTION (Estimate from visual y-axis):
- Current Price: Estimate the current market price shown.
- Candle Type: Describe the last completed candle (e.g., "Bullish Engulfing").

Return a raw JSON object (no markdown) with this exact structure:

{
  "symbol": "EURUSD or null",
  "timeframe": "H1 or null",
  "signal": "BUY or SELL or HOLD",
  "confidence": 85,
  "priceAction": {
    "method": "Price Action Analysis",
    "findings": ["finding 1", "finding 2"],
    "signal": "BUY",
    "strength": 8
  },
  "fibonacci": {
    "method": "Fibonacci Analysis",
    "findings": ["finding 1", "finding 2"],
    "signal": "BUY",
    "strength": 7
  },
  "elliotWave": {
    "method": "Elliott Wave Theory",
    "findings": ["finding 1", "finding 2"],
    "signal": "BUY",
    "strength": 6
  },
  "volumeAnalysis": {
    "method": "Volume Analysis",
    "findings": ["finding 1", "finding 2"],
    "signal": "BUY",
    "strength": 7
  },
  "marketStructure": {
    "method": "Market Structure Analysis",
    "findings": ["finding 1", "finding 2"],
    "signal": "BUY",
    "strength": 9
  },
  "technical": ["RSI indicator reading", "MACD status", "Moving average info"],
  "fundamental": ["Any visible news or context"],
  "recommendation": {
    "entryPrice": "1.0850",
    "stopLoss": "1.0810",
    "takeProfit1": "1.0920",
    "takeProfit2": "1.1000",
    "riskRewardRatio": "1:2.5"
  },
  "scenarios": {
    "bullishCondition": "Break and close above 1.0900 resistance",
    "bearishCondition": "Rejection at 1.0900 and break below 1.0850"
  },
  "estimatedData": {
    "currentPrice": "1.0875",
    "candleType": "Bullish Pin Bar"
  },
  "reasoning": "Summary of why this signal was generated based on all 5 methods",
  "warnings": ["Any risk warnings"]
}

RULES:
- Analyze using ALL 5 methods
- Each method must have 2-3 findings
- Strength rating 1-10
- Final signal is consensus of all methods
- Entry, SL, TP must be realistic price levels
`;

export async function POST(req: NextRequest) {
    try {
        const { image, apiKey } = await req.json();

        if (!image || !apiKey) {
            return NextResponse.json(
                { error: "Missing image or API key" },
                { status: 400 }
            );
        }

        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

        const body = {
            contents: [
                {
                    parts: [
                        { text: SYSTEM_PROMPT },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Gemini API Error: ${response.statusText} - ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResult) {
            return NextResponse.json(
                { error: "No analysis generated from AI" },
                { status: 500 }
            );
        }

        let analysis: AnalysisData;
        try {
            analysis = JSON.parse(textResult);
        } catch {
            const cleanJson = textResult.replace(/```json\n?|\n?```/g, "");
            analysis = JSON.parse(cleanJson);
        }

        return NextResponse.json({ data: analysis });
    } catch (error: unknown) {
        console.error("Analysis failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}