"use client";

import { Scanner as QrScanner } from "@yudiel/react-qr-scanner";
import { Camera, CameraOff, ScanBarcode } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";

interface ScannerProps {
  onScanSuccess: (decodedText: string, decodedType: string) => void;
}

interface DetectedCode {
  format: string;
  rawValue: string;
}

export function Scanner({ onScanSuccess }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    (detectedCodes: DetectedCode[]) => {
      if (detectedCodes.length > 0) {
        // Try all detected codes, not just the first one
        // This helps with partial or distorted barcodes
        for (const code of detectedCodes) {
          if (code.rawValue && code.rawValue.trim().length > 0) {
            const format = code.format || "UNKNOWN";
            onScanSuccess(code.rawValue, format);
            break; // Only process the first valid code
          }
        }
      }
    },
    [onScanSuccess],
  );

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes("Permission")) {
      setError("Camera permission denied. Please allow camera access.");
    } else if (
      errorMessage.includes("NotFoundError") ||
      errorMessage.includes("No camera")
    ) {
      setError("No camera found on this device.");
    } else {
      setError(errorMessage);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-zinc-100 border-2 border-zinc-200 shadow-sm">
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 z-10">
            <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center">
              <ScanBarcode className="w-10 h-10 text-zinc-500" />
            </div>
            <p className="text-zinc-500 text-center text-sm">
              Tap the button below to start scanning barcodes and QR codes
            </p>
          </div>
        )}

        {isScanning && (
          <>
            <div className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full">
              <QrScanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: "environment",
                  width: { ideal: 1920, min: 1280 },
                  height: { ideal: 1080, min: 720 },
                }}
                formats={[
                  // 2D Barcodes
                  "qr_code",
                  "aztec",
                  "data_matrix",
                  "pdf417",
                  "maxi_code",
                  "micro_qr_code",
                  "rm_qr_code",
                  // 1D Barcodes
                  "code_128",
                  "code_39",
                  "code_93",
                  "codabar",
                  "ean_13",
                  "ean_8",
                  "itf",
                  "upc_a",
                  "upc_e",
                  "databar",
                  "databar_expanded",
                  "databar_limited",
                  "dx_film_edge",
                ]}
                scanDelay={50}
                allowMultiple={false}
                components={{
                  finder: true,
                  torch: true,
                }}
              />
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 relative">
                  <div className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-zinc-900 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-r-4 border-t-4 border-zinc-900 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-l-4 border-b-4 border-zinc-900 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-r-4 border-b-4 border-zinc-900 rounded-br-xl" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-900/50 animate-pulse" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="w-full max-w-sm p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      <Button
        onClick={() => {
          setIsScanning((prev) => !prev);
          if (isScanning) {
            setError(null);
          }
        }}
        size="lg"
        className={`rounded-full px-8 py-6 text-base font-medium transition-all ${
          isScanning
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-zinc-900 hover:bg-zinc-800 text-white"
        }`}
      >
        {isScanning ? (
          <>
            <CameraOff className="w-5 h-5" />
            Stop Scanning
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Start Scanning
          </>
        )}
      </Button>
    </div>
  );
}
