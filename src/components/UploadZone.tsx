"use client";

import { Upload, X } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onImageSelect: (file: File) => void;
    selectedImage: string | null;
    onClear: () => void;
}

export function UploadZone({ onImageSelect, selectedImage, onClear }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                onImageSelect(file);
            }
        },
        [onImageSelect]
    );

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <AnimatePresence mode="wait">
                {!selectedImage ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key="upload-zone"
                        onClick={handleClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300",
                            isDragging
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 hover:border-gray-600"
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                        <div className="flex flex-col items-center gap-4 text-center p-6">
                            <div
                                className={cn(
                                    "p-4 rounded-full transition-colors",
                                    isDragging ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                                )}
                            >
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-gray-200">
                                    Click or drag chart image here
                                </p>
                                <p className="text-sm text-gray-400">
                                    Supports JPG, PNG (Max 5MB)
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: 10 }}
                        key="preview"
                        className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
                    >
                        <img
                            src={selectedImage}
                            alt="Uploaded Chart"
                            className="w-full h-full max-h-[500px] object-contain bg-black/50"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
