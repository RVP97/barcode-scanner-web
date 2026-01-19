"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 backdrop-blur-sm py-2 px-4 text-sm font-medium text-black animate-in slide-in-from-top duration-300">
      <WifiOff className="w-4 h-4" />
      You&apos;re offline - Some features may be limited
    </div>
  );
}
