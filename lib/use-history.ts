"use client";

import { useCallback, useEffect, useState } from "react";

export interface HistoryItem {
  id: string;
  value: string;
  type: string;
  timestamp: number;
}

const STORAGE_KEY = "barcode-scanner-history";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const addToHistory = useCallback((value: string, type: string) => {
    setHistory((prev) => {
      // Remove existing item with same value if it exists
      const filtered = prev.filter((item) => item.value !== value);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        value,
        type,
        timestamp: Date.now(),
      };
      
      const updated = [newItem, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, isLoaded, addToHistory, removeFromHistory, clearHistory };
}
