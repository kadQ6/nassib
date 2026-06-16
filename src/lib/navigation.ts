import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  FolderOpen,
  Hospital,
  LayoutDashboard,
  Map,
  Package,
  PackageCheck,
  PlayCircle,
  ShoppingCart,
  Stethoscope,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

export type NavSectionId = "workflow";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Routes legacy / sous-pages */
  aliases?: string[];
  /** Module central — mise en évidence sidebar */
  highlight?: boolean;
}

export interface NavSection {
  id: NavSectionId;
  label: string;
  items: NavItem[];
}

/**
 * Navigation workflow chantier hospitalier — 18 modules ordonnés.
 * Logique centrale : locaux (room by room) au cœur du pilotage.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workflow",
    label: "Pilotage chantier",
    items: [
      { href: "/projet", label: "1. Projet", icon: LayoutDashboard, aliases: ["/"] },
      { href: "/plans", label: "2. Plans", icon: Map },
      {
        href: "/locaux",
        label: "3. Locaux",
        icon: Hospital,
        highlight: true,
        aliases: ["/batiments", "/departements", "/programme", "/programme/dispatch"],
      },
      {
        href: "/besoins-techniques",
        label: "4. Besoins techniques",
        icon: Zap,
      },
      { href: "/boq", label: "5. BOQ", icon: ClipboardList },
      { href: "/planning", label: "6. Planning", icon: FileText, aliases: ["/suivi-chantier"] },
      { href: "/lots", label: "7. Corps d'état", icon: Wrench, aliases: ["/fluides-medicaux"] },
      { href: "/equipements", label: "8. Équipements & mobilier", icon: Stethoscope, aliases: ["/mobilier", "/programme/derivations", "/equipements/recap", "/equipements/financier", "/equipements/bilan", "/equipements/ecarts-boq"] },
      { href: "/approvisionnements", label: "9. Approvisionnements", icon: ShoppingCart, aliases: ["/budget"] },
      { href: "/logistique", label: "10. Logistique", icon: Truck },
      {
        href: "/installation-dm",
        label: "11. Installation DM",
        icon: PackageCheck,
        aliases: ["/mise-en-service"],
      },
      { href: "/taches", label: "12. Tâches", icon: CheckCircle2 },
      { href: "/reunions", label: "13. Réunions", icon: Building2, aliases: ["/journal"] },
      { href: "/reserves", label: "14. Réserves", icon: AlertTriangle },
      { href: "/essais", label: "15. Essais", icon: FlaskConical },
      { href: "/boq/paiements", label: "16. Paiements", icon: CreditCard },
      { href: "/reception", label: "17. Réception", icon: Package },
      { href: "/mise-en-exploitation", label: "18. Mise en exploitation", icon: PlayCircle },
      { href: "/documents", label: "Documents", icon: FolderOpen },
      { href: "/rapports", label: "Rapports", icon: FileText },
    ],
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/projet") {
    return pathname === "/" || pathname === "/projet";
  }
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return (item.aliases ?? []).some(
    (alias) => pathname === alias || pathname.startsWith(`${alias}/`),
  );
}

export function findNavSection(pathname: string): NavSectionId | null {
  for (const section of NAV_SECTIONS) {
    if (section.items.some((item) => isNavItemActive(pathname, item))) {
      return section.id;
    }
  }
  return null;
}
