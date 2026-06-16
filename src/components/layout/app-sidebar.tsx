"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KBIO_BRAND } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, isNavItemActive } from "@/lib/navigation";
import type { NassibProject } from "@/types/nassib";

export function AppSidebar({
  project,
  roomCount,
}: {
  project: NassibProject;
  roomCount: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-[#faf9f7]">
      <div className="border-b border-stone-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#0891B2]">{KBIO_BRAND}</span>
        </div>
        <p className="mt-1 text-sm font-semibold text-[#003F72]">Pilotage Hospitalier</p>
        <p className="text-xs text-stone-500">Suivi de projet de construction</p>
      </div>

      <div className="mx-3 mt-4 rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-[#003F72]">
          {project.name}
        </p>
        <p className="text-[10px] font-medium uppercase text-stone-400">Djibouti</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
            {project.status === "active" ? "actif" : project.status}
          </span>
          <span className="rounded-full bg-[#0891B2]/10 px-2 py-0.5 text-[10px] font-medium text-[#0891B2]">
            {roomCount} locaux
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isNavItemActive(pathname, item);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                        item.highlight && !active && "ring-1 ring-[#0891B2]/30",
                        active
                          ? "bg-stone-200/80 font-medium text-[#003F72]"
                          : "text-stone-600 hover:bg-stone-100 hover:text-[#003F72]",
                        item.highlight && active && "ring-2 ring-[#0891B2]",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[#F97316]" />
                      )}
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-stone-200 px-4 py-3 text-[10px] text-stone-400">
        ARCHI HOSP v0.4 · Room Hub · {KBIO_BRAND}
      </div>
    </aside>
  );
}
