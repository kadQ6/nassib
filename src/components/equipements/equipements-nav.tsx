"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const TABS = [
  { href: "/equipements", label: "Par local" },
  { href: "/equipements/bilan", label: "Bilan prévu / manquant" },
  { href: "/equipements/ecarts-boq", label: "Écarts BOQ / plan" },
  { href: "/equipements/recap", label: "Récapitulatif" },
  { href: "/equipements/financier", label: "Préparation financière" },
];

export function EquipementsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 border-b pb-4">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href}>
          <Button
            variant={pathname === tab.href ? "default" : "outline"}
            size="sm"
          >
            {tab.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
