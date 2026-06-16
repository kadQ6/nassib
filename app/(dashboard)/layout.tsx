"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  Building2,
  FileSpreadsheet,
  CalendarDays,
  Layers,
  Stethoscope,
  ShoppingCart,
  Truck,
  CheckSquare,
  Users,
  AlertTriangle,
  FlaskConical,
  CreditCard,
  ClipboardCheck,
  Power,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// ─── Navigation Items ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard",         label: "Tableau de bord",       icon: LayoutDashboard },
  { href: "/plans",             label: "Plans",                 icon: Map             },
  { href: "/locaux",            label: "Locaux",                icon: Building2,  central: true },
  { href: "/boq",               label: "BOQ",                   icon: FileSpreadsheet },
  { href: "/planning",          label: "Planning",              icon: CalendarDays    },
  { href: "/lots",              label: "Lots Techniques",       icon: Layers          },
  { href: "/equipements",       label: "Équipements Bioméd.",   icon: Stethoscope     },
  { href: "/approvisionnements",label: "Approvisionnements",    icon: ShoppingCart    },
  { href: "/logistique",        label: "Logistique",            icon: Truck           },
  { href: "/taches",            label: "Tâches",                icon: CheckSquare     },
  { href: "/reunions",          label: "Réunions",              icon: Users           },
  { href: "/reserves",          label: "Réserves / NC",         icon: AlertTriangle   },
  { href: "/essais",            label: "Essais",                icon: FlaskConical    },
  { href: "/paiements",         label: "Paiements",             icon: CreditCard      },
  { href: "/reception",         label: "Réception",             icon: ClipboardCheck  },
  { href: "/exploitation",      label: "Mise en exploitation",  icon: Power           },
  { href: "/documents",         label: "Documents / GED",       icon: FolderOpen      },
]

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className={`
          relative flex-shrink-0 flex flex-col bg-slate-900 text-white
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Logo */}
        <div
          className={`
            flex items-center border-b border-slate-700/60 px-4 py-5
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-black text-xl leading-tight tracking-wide">
                NASSIB
              </p>
              <p className="text-slate-400 text-xs font-medium">
                Polyclinique
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          className="
            absolute -right-3 top-[72px] z-10
            flex items-center justify-center
            w-6 h-6 rounded-full
            bg-slate-700 hover:bg-blue-600
            text-slate-300 hover:text-white
            border-2 border-slate-900
            transition-all duration-200 shadow-lg
          "
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item, index) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const isCentral = item.central

              // Insert a subtle separator line before the "Locaux" central module
              const showSeparator = isCentral

              return (
                <li key={item.href}>
                  {showSeparator && (
                    <div className="my-2 mx-2 border-t border-slate-700/50" />
                  )}
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                      transition-all duration-150
                      ${collapsed ? "justify-center" : ""}
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow shadow-blue-900/30"
                          : isCentral && !isActive
                          ? "bg-slate-800/70 text-blue-300 hover:bg-slate-700/70 hover:text-blue-200 ring-1 ring-blue-900/40"
                          : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                      }
                    `}
                  >
                    <Icon
                      className={`flex-shrink-0 ${collapsed ? "w-5 h-5" : "w-4 h-4"}`}
                    />
                    {!collapsed && (
                      <span className="truncate text-[13px] font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                  {/* Insert closing separator after central module */}
                  {isCentral && (
                    <div className="mt-2 mx-2 border-t border-slate-700/50" />
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
