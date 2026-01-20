"use client";

import { ScanBarcode } from "lucide-react";
import { useCallback, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { ResultModal } from "@/components/result-modal";
import { Scanner } from "@/components/scanner";
import { useHistory } from "@/lib/use-history";

interface ScanResult {
  value: string;
  type: string;
}

export default function HomePage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const { addToHistory } = useHistory();

  const handleScanSuccess = useCallback(
    (decodedText: string, decodedType: string) => {
      setResult({ value: decodedText, type: decodedType });
      addToHistory(decodedText, decodedType);
    },
    [addToHistory],
  );

  const handleCloseResult = () => {
    setResult(null);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-zinc-50 text-zinc-900"
      style={{
        overscrollBehavior: "none",
        overscrollBehaviorY: "none",
        touchAction: "manipulation",
      }}
    >
      <header className="shrink-0 z-30 bg-white/90 backdrop-blur-xl border-b border-zinc-200">
        <div className="flex items-center justify-center gap-3 h-12 px-4">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
            <ScanBarcode className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Scanner</h1>
        </div>
      </header>

      <main
        className="flex-1 flex flex-col items-center justify-start px-4 pt-6 pb-24 overflow-hidden"
        style={{ overscrollBehavior: "none" }}
      >
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2 mt-8">
            <h2 className="text-2xl font-bold text-zinc-900">Scan a Code</h2>
            <p className="text-zinc-500 text-sm">
              Point your camera at a barcode or QR code
            </p>
          </div>

          <Scanner onScanSuccess={handleScanSuccess} />
        </div>
      </main>

      {result && (
        <ResultModal
          value={result.value}
          type={result.type}
          onClose={handleCloseResult}
        />
      )}

      <BottomNav />
    </div>
  );
}
