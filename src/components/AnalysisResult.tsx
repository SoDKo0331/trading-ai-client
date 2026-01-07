"use client";

import { motion } from "framer-motion";
import {
    TrendingUp, TrendingDown, Minus, AlertCircle,
    Newspaper, Activity, Target, Shield, Zap,
    BarChart3, Waves, Ruler, Volume2, Grid3x3
} from "lucide-react";
import { AnalysisData, AnalysisMethod } from "@/types";

interface AnalysisResultProps {
    analysis: AnalysisData | null;
    isLoading: boolean;
}

export function AnalysisResult({ analysis, isLoading }: AnalysisResultProps) {
    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto p-8 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-sm animate-pulse">
                <div className="h-8 bg-white/5 rounded w-1/3 mb-4 mx-auto"></div>
                <div className="h-64 bg-white/5 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!analysis) return null;

    const getSignalColor = (s: string) => {
        if (s === "BUY") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        if (s === "SELL") return "text-rose-400 border-rose-500/30 bg-rose-500/10";
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    };

    const getStrengthColor = (strength: number) => {
        if (strength >= 8) return "bg-emerald-500";
        if (strength >= 6) return "bg-blue-500";
        if (strength >= 4) return "bg-yellow-500";
        return "bg-rose-500";
    };

    const SignalIcon = analysis.signal === "BUY" ? TrendingUp : analysis.signal === "SELL" ? TrendingDown : Minus;

    const MethodCard = ({ method, icon: Icon, color }: { method: AnalysisMethod; icon: any; color: string }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm hover:border-white/20 transition-colors"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <h4 className="font-semibold text-sm">{method.method}</h4>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getSignalColor(method.signal)}`}>
                        {method.signal}
                    </span>
                </div>
            </div>

            {/* Strength Bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Strength</span>
                    <span className="font-mono text-white">{method.strength}/10</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getStrengthColor(method.strength)} transition-all duration-500`}
                        style={{ width: `${method.strength * 10}%` }}
                    ></div>
                </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-300">
                {method.findings.map((finding, i) => (
                    <li key={i} className="flex gap-2">
                        <span className={`${color} opacity-50 flex-shrink-0`}>▸</span>
                        <span>{finding}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl mx-auto space-y-6"
        >
            {/* Header with Symbol & Timeframe */}
            {(analysis.symbol || analysis.timeframe) && (
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10">
                        {analysis.symbol && <span className="font-bold text-lg">{analysis.symbol}</span>}
                        {analysis.timeframe && <span className="text-gray-400">•</span>}
                        {analysis.timeframe && <span className="text-gray-400 font-mono">{analysis.timeframe}</span>}
                    </div>
                </div>
            )}

            {/* Estimated Data Context */}
            {analysis.estimatedData && (
                <div className="flex justify-center gap-4 text-sm">
                    <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200">
                        <span className="opacity-50 mr-2">Est. Price:</span>
                        <span className="font-mono font-bold">{analysis.estimatedData.currentPrice}</span>
                    </div>
                    <div className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-200">
                        <span className="opacity-50 mr-2">Candle:</span>
                        <span className="font-bold">{analysis.estimatedData.candleType}</span>
                    </div>
                </div>
            )}

            {/* Main Signal Card */}
            <div className={`p-8 rounded-3xl border ${getSignalColor(analysis.signal)} text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-sm uppercase tracking-widest opacity-70 mb-2">AI Trading Signal</h2>
                    <div className="flex items-center justify-center gap-4 text-6xl font-black tracking-tight mb-3">
                        <SignalIcon className="w-16 h-16" />
                        {analysis.signal}
                    </div>
                    <div className="text-lg font-mono opacity-80">
                        Confidence: {analysis.confidence}%
                    </div>
                </div>
            </div>

            {/* Trading Recommendation */}
            {analysis.recommendation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm"
                >
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-green-300">
                        <Target className="w-5 h-5" /> Trading Recommendation
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                            <div className="text-lg font-bold text-blue-300">{analysis.recommendation.entryPrice}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                            <div className="text-lg font-bold text-rose-300">{analysis.recommendation.stopLoss}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-gray-400 mb-1">Take Profit 1</div>
                            <div className="text-lg font-bold text-emerald-300">{analysis.recommendation.takeProfit1}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-gray-400 mb-1">Take Profit 2</div>
                            <div className="text-lg font-bold text-emerald-400">{analysis.recommendation.takeProfit2}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                            <div className="text-xs text-purple-300 mb-1">Risk:Reward</div>
                            <div className="text-lg font-bold text-purple-200">{analysis.recommendation.riskRewardRatio}</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Scenario Analysis */}
            {analysis.scenarios && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                            <TrendingUp className="w-4 h-4" /> Bullish Case
                        </h4>
                        <p className="text-sm text-emerald-100/80 leading-relaxed">
                            {analysis.scenarios.bullishCondition}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-sm">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-rose-400 mb-2 uppercase tracking-wider">
                            <TrendingDown className="w-4 h-4" /> Bearish Case
                        </h4>
                        <p className="text-sm text-rose-100/80 leading-relaxed">
                            {analysis.scenarios.bearishCondition}
                        </p>
                    </div>
                </div>
            )}

            {/* Advanced Analysis Methods - 5 Cards */}
            <div>
                <h3 className="text-xl font-bold mb-4 text-center">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        5 Advanced Analysis Methods
                    </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.priceAction && (
                        <MethodCard method={analysis.priceAction} icon={Activity} color="text-blue-400" />
                    )}
                    {analysis.fibonacci && (
                        <MethodCard method={analysis.fibonacci} icon={Ruler} color="text-purple-400" />
                    )}
                    {analysis.elliotWave && (
                        <MethodCard method={analysis.elliotWave} icon={Waves} color="text-cyan-400" />
                    )}
                    {analysis.volumeAnalysis && (
                        <MethodCard method={analysis.volumeAnalysis} icon={Volume2} color="text-orange-400" />
                    )}
                    {analysis.marketStructure && (
                        <MethodCard method={analysis.marketStructure} icon={Grid3x3} color="text-green-400" />
                    )}
                </div>
            </div>

            {/* Traditional Analysis Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Analysis */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-300">
                        <BarChart3 className="w-5 h-5" /> Technical Indicators
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        {analysis.technical.map((item, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-blue-500/50">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Fundamental Analysis */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-purple-300">
                        <Newspaper className="w-5 h-5" /> Fundamental / Context
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        {analysis.fundamental.length > 0 ? analysis.fundamental.map((item, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-purple-500/50">•</span> {item}
                            </li>
                        )) : (
                            <li className="text-gray-500 italic">No specific news or text detected in chart.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Warnings */}
            {analysis.warnings && analysis.warnings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm"
                >
                    <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 text-yellow-300">
                        <Shield className="w-4 h-4" /> Risk Warnings
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-200/80">
                        {analysis.warnings.map((warning, i) => (
                            <li key={i} className="flex gap-2">
                                <Zap className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                                {warning}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Reasoning */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-200">
                    <AlertCircle className="w-5 h-5" /> Comprehensive Analysis Summary
                </h3>
                <p className="text-gray-300 leading-relaxed">
                    {analysis.reasoning}
                </p>
            </div>
        </motion.div>
    );
}
