"use client";

import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, Loader2, ScanBarcode } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface ScannerProps {
  onScanSuccess: (decodedText: string, decodedType: string) => void;
}

export function Scanner({ onScanSuccess }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = useCallback(async () => {
    if (!containerRef.current || scannerRef.current?.isScanning) return;

    setIsInitializing(true);
    setError(null);

    try {
      const scanner = new Html5Qrcode("scanner-container");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1,
        },
        (decodedText, result) => {
          const format = result.result.format?.formatName || "UNKNOWN";
          onScanSuccess(decodedText, format);
        },
        () => {
          // Ignore scan errors (no code found)
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start camera";
      if (errorMessage.includes("Permission")) {
        setError("Camera permission denied. Please allow camera access.");
      } else if (errorMessage.includes("NotFoundError") || errorMessage.includes("No camera")) {
        setError("No camera found on this device.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [onScanSuccess]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Ignore stop errors
      }
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-zinc-100 border-2 border-zinc-200 shadow-sm">
        {!isScanning && !isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center">
              <ScanBarcode className="w-10 h-10 text-zinc-500" />
            </div>
            <p className="text-zinc-500 text-center text-sm">
              Tap the button below to start scanning barcodes and QR codes
            </p>
          </div>
        )}
        
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-100 z-10">
            <Loader2 className="w-10 h-10 text-zinc-900 animate-spin" />
            <p className="text-zinc-500 text-sm">Starting camera...</p>
          </div>
        )}
        
        <div 
          id="scanner-container" 
          ref={containerRef}
          className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
        />
        
        {isScanning && (
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
        )}
      </div>

      {error && (
        <div className="w-full max-w-sm p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      <Button
        onClick={isScanning ? stopScanner : startScanner}
        disabled={isInitializing}
        size="lg"
        className={`rounded-full px-8 py-6 text-base font-medium transition-all ${
          isScanning 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-zinc-900 hover:bg-zinc-800 text-white"
        }`}
      >
        {isInitializing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting...
          </>
        ) : isScanning ? (
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
