"use client";

import { Check, Copy, ExternalLink, Link2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface ResultModalProps {
  value: string;
  type: string;
  onClose: () => void;
}

function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

export function ResultModal({ value, type, onClose }: ResultModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isUrl = isValidUrl(value);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleOpenLink = () => {
    if (isUrl) {
      window.open(value, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pb-24 sm:pb-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white border-zinc-200 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-zinc-900" />
            </div>
            Scan Result
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {type || "Code"} Detected
            </span>
            <div className="relative">
              <Input
                value={value}
                readOnly
                aria-label="Scanned code value"
                className="pr-12 bg-zinc-50 border-zinc-200 text-zinc-900 font-mono text-sm h-12 rounded-xl"
              />
              {isUrl && (
                <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                isCopied
                  ? "bg-zinc-900 hover:bg-zinc-800 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>

            {isUrl && (
              <Button
                onClick={handleOpenLink}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-zinc-200 hover:bg-zinc-50 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open Link
              </Button>
            )}
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-12 rounded-xl text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          >
            Scan Another
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
