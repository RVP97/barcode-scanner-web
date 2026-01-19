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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-zinc-200">
        <div className="flex items-center justify-center gap-3 h-16 px-4">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">
            <ScanBarcode className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Scanner</h1>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 py-8 pb-24">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
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
