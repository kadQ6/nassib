"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KBIO_BRAND } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";

const MODULE_LINKS = [
  { href: "/planning", label: "Planning" },
  { href: "/locaux", label: "Locaux" },
  { href: "/lots", label: "Lots MEP" },
  { href: "/reserves", label: "Réserves" },
  { href: "/documents", label: "Documents" },
  { href: "/boq", label: "Finance" },
];

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#003F72] text-sm font-bold text-white">
            AH
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#003F72]">ARCHI HOSP</p>
            <p className="text-xs text-slate-500">Polyclinique Nassib</p>
          </div>
        </Link>

        {!isHome && (
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="mr-2 flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              <LayoutGrid className="h-4 w-4" />
              Accueil
            </Link>
            {MODULE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-[#003F72] text-white"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800 sm:inline">
            MVP v0.2
          </span>
          <span className="hidden lg:inline">{KBIO_BRAND}</span>
        </div>
      </div>
    </header>
  );
}
