// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Library,
  Repeat,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Video", icon: Film },
  { href: "/dashboard/library", label: "Library", icon: Library },
  { href: "/dashboard/series", label: "Series", icon: Repeat },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#12121a] border border-[#2a2a3e] text-gray-400 hover:text-white"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-[#12121a] border-r border-[#2a2a3e] transition-all duration-300 flex flex-col",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64",
          "lg:translate-x-0 lg:static lg:h-auto"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#2a2a3e]">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                ReelForge
              </span>
            </Link>
          )}
          <button
            className="hidden lg:flex p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#1a1a2e]"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => {
            const isActive = link.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a2e]"
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
              >
                <link.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive && "text-purple-400"
                  )}
                />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
