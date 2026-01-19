"use client";

import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  History,
  Link2,
  QrCode,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "@/components/bottom-nav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHistory } from "@/lib/use-history";

function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function HistoryPage() {
  const { history, isLoaded, removeFromHistory, clearHistory } = useHistory();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleClearAll = () => {
    clearHistory();
    toast.success("History cleared");
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-zinc-200">
        <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">History</h1>
          </div>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-500 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your scanned codes. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </header>

      <main className="px-4 py-6 pb-24 max-w-lg mx-auto">
        {!isLoaded ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
              <QrCode className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-700 mb-2">
              No scans yet
            </h3>
            <p className="text-zinc-500 text-sm max-w-xs">
              Your scanned barcodes and QR codes will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const isUrl = isValidUrl(item.value);
              const isCopied = copiedId === item.id;

              return (
                <Card
                  key={item.id}
                  className="bg-white border-zinc-200 p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-medium uppercase">
                        {item.type}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromHistory(item.id)}
                      className="h-7 w-7 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="relative">
                    <Input
                      value={item.value}
                      readOnly
                      className="pr-10 bg-zinc-50 border-zinc-200 text-zinc-900 font-mono text-sm h-11 rounded-xl"
                    />
                    {isUrl && (
                      <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(item.id, item.value)}
                      size="sm"
                      className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${
                        isCopied
                          ? "bg-zinc-900 hover:bg-zinc-800 text-white"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                    {isUrl && (
                      <Button
                        onClick={() => handleOpenLink(item.value)}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 rounded-lg border-zinc-200 hover:bg-zinc-50 text-xs font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
