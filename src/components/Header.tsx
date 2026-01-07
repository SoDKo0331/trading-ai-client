import { Zap } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="container flex h-16 items-center px-4">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <span>Trading<span className="text-blue-400">AI</span></span>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    {/* Settings or Key Indicator will go here */}
                    <div className="text-xs text-muted-foreground font-mono">v1.0.0</div>
                </div>
            </div>
        </header>
    );
}
