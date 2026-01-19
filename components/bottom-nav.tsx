"use client";

import { Camera, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: Camera, label: "Scanner" },
  { href: "/history", icon: History, label: "History" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-6 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
