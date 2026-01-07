"use client";

import { useState, useEffect } from "react";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisResult } from "@/components/AnalysisResult";
import { AnalysisData } from "@/types";
import { Sparkles, Key, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const storedKey = localStorage.getItem("gemini_api_key");

    if (envKey) {
      setApiKey(envKey);
    } else if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!selectedImage || !apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage, apiKey }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to analyze image";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center gap-8 min-h-[calc(100vh-4rem)]">

      {/* Introduction Wrapper */}
      {!selectedImage && !analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 my-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20">
            Market Vision
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Upload your forex charts. AI will analyze technical patterns and fundamental context to generate buy/sell signals.
          </p>
        </motion.div>
      )}

      {/* API Key Input */}
      {!apiKey && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200"
        >
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <Key className="w-5 h-5" /> API Key Required
          </div>
          <p className="text-sm opacity-80 mb-4">
            Please enter your Gemini API Key to start analysis. It is stored locally in your browser.
          </p>
          <input
            type="password"
            placeholder="Paste Gemini API Key here..."
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-white/20"
            onChange={(e) => handleApiKeyChange(e.target.value)}
          />
        </motion.div>
      )}

      {/* Main Workspace */}
      <div className="w-full flex-1 flex flex-col items-center">
        {apiKey && (
          <>
            <UploadZone
              selectedImage={selectedImage}
              onImageSelect={handleImageSelect}
              onClear={handleClear}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="w-full max-w-2xl bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {selectedImage && !analysis && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runAnalysis}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] flex items-center gap-2 text-lg transition-all"
              >
                <Sparkles className="w-5 h-5 fill-white/20" />
                Analyze Chart
              </motion.button>
            )}

            <AnalysisResult analysis={analysis} isLoading={isLoading} />
          </>
        )}
      </div>

    </main>
  );
}
