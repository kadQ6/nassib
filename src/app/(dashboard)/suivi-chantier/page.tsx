import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CalendarRange,
  Droplets,
  FlaskConical,
  LayoutDashboard,
  ShieldAlert,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

const CHANTIER_MODULES = [
  { href: "/planning", label: "Planning WBS / Gantt", desc: "Jalons, dépendances, alertes", icon: CalendarRange, color: "from-[#003F72] to-[#0891B2]" },
  { href: "/lots", label: "Lots techniques MEP", desc: "CFO, CVC, fluides, SSI", icon: LayoutDashboard, color: "from-slate-700 to-slate-900" },
  { href: "/fluides-medicaux", label: "Fluides médicaux", desc: "O₂, air, vide", icon: Droplets, color: "from-cyan-600 to-blue-700" },
  { href: "/essais", label: "Essais & réception", desc: "OPR, protocoles, PV", icon: FlaskConical, color: "from-emerald-600 to-teal-700" },
  { href: "/reunions", label: "Réunions chantier", desc: "CR, décisions, actions", icon: Users, color: "from-violet-600 to-purple-700" },
  { href: "/journal", label: "Journal de chantier", desc: "Quotidien, effectifs", icon: BookOpen, color: "from-stone-600 to-stone-800" },
  { href: "/risques", label: "Risques & alertes", desc: "Registre, plans", icon: ShieldAlert, color: "from-red-600 to-rose-700" },
  { href: "/reserves", label: "Réserves", desc: "Punch list, levée", icon: AlertTriangle, color: "from-orange-500 to-red-600" },
];

export default function SuiviChantierPage() {
  return (
    <>
      <PageHeader
        title="Suivi chantier"
        description="Modules opérationnels de pilotage terrain"
      />
      <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CHANTIER_MODULES.map((mod) => (
            <Link key={mod.href} href={mod.href} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className={cn("h-2 bg-gradient-to-r", mod.color)} />
                <div className="flex flex-1 flex-col p-5">
                  <mod.icon className="mb-3 h-6 w-6 text-[#003F72]" />
                  <h3 className="font-semibold text-slate-900">{mod.label}</h3>
                  <p className="mt-1 text-sm text-slate-500">{mod.desc}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
