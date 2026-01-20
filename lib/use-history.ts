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
        const parsed = JSON.parse(stored);
        // Limit to 50 items on load (keep most recent)
        const limited = Array.isArray(parsed) ? parsed.slice(0, 50) : [];
        setHistory(limited);
        // Update storage if we trimmed the array
        if (limited.length < parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
        }
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

      // Add new item and limit to 50 items (remove oldest if exceeds)
      const updated = [newItem, ...filtered].slice(0, 50);
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
