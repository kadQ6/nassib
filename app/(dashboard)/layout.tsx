"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Map,
  Wrench,
  Droplets,
  Activity,
  Package,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  Users,
  BookOpen,
  CheckSquare,
  Shield,
  Building2,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─── Navigation Items ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/planning", label: "Planning & Gantt", icon: Calendar },
  { href: "/dashboard/zones", label: "Zones & Locaux", icon: Map },
  { href: "/dashboard/lots", label: "Lots Techniques", icon: Wrench },
  { href: "/dashboard/fluides", label: "Fluides Médicaux", icon: Droplets },
  { href: "/dashboard/equipements", label: "Équipements Bioméd.", icon: Activity },
  { href: "/dashboard/approvisionnements", label: "Approvisionnements", icon: Package },
  { href: "/dashboard/reserves", label: "Réserves & NC", icon: AlertTriangle },
  { href: "/dashboard/documents", label: "Documents", icon: FolderOpen },
  { href: "/dashboard/budget", label: "Budget & BOQ", icon: DollarSign },
  { href: "/dashboard/reunions", label: "Réunions", icon: Users },
  { href: "/dashboard/journal", label: "Journal Chantier", icon: BookOpen },
  { href: "/dashboard/essais", label: "Essais & Réception", icon: CheckSquare },
  { href: "/dashboard/risques", label: "Registre Risques", icon: Shield },
]

// Alert badge counts (mock data)
const NAV_BADGES: Record<string, number> = {
  "/dashboard/reserves": 23,
  "/dashboard/approvisionnements": 4,
  "/dashboard/documents": 12,
  "/dashboard/planning": 8,
  "/dashboard/risques": 3,
}

// Breadcrumb labels per pathname segment
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  planning: "Planning & Gantt",
  zones: "Zones & Locaux",
  lots: "Lots Techniques",
  fluides: "Fluides Médicaux",
  equipements: "Équipements Biomédicaux",
  approvisionnements: "Approvisionnements",
  reserves: "Réserves & NC",
  documents: "Documents",
  budget: "Budget & BOQ",
  reunions: "Réunions",
  journal: "Journal Chantier",
  essais: "Essais & Réception",
  risques: "Registre Risques",
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
      <span className="text-slate-400">Polyclinique</span>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/")
        const label = SEGMENT_LABELS[seg] ?? seg
        const isLast = i === segments.length - 1
        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-slate-300" />
            {isLast ? (
              <span className="font-semibold text-slate-700">{label}</span>
            ) : (
              <Link href={href} className="hover:text-slate-700 transition-colors">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Déconnexion réussie")
    router.push("/")
  }

  // ─── Sidebar content (shared between desktop & mobile) ───────────────────

  const SidebarContent = ({ showClose = false }: { showClose?: boolean }) => (
    <>
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-slate-700/50",
          collapsed && !showClose ? "justify-center" : ""
        )}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/30">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || showClose) && (
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-bold leading-tight truncate">
              Polyclinique
            </p>
            <p className="text-slate-400 text-xs truncate">Cité Nassib</p>
          </div>
        )}
        {showClose && (
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Project badge */}
      {(!collapsed || showClose) && (
        <div className="px-4 py-2 border-b border-slate-700/30">
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">Chantier en cours</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const badge = NAV_BADGES[item.href]

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group relative",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-900/30"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "flex-shrink-0",
                    collapsed && !showClose ? "w-5 h-5" : "w-4 h-4"
                  )}
                />
                {(!collapsed || showClose) && (
                  <>
                    <span className="truncate flex-1 text-[13px]">{item.label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span
                        className={cn(
                          "flex-shrink-0 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none",
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-red-500 text-white"
                        )}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {/* Dot badge when collapsed */}
                {collapsed && !showClose && badge !== undefined && badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-slate-900" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-slate-700/50 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-left",
                collapsed && "justify-center"
              )}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                  CP
                </AvatarFallback>
              </Avatar>
              {(!collapsed || showClose) && (
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 text-sm font-medium truncate leading-tight">
                    Chef de Projet
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    kader.omar@gmail.com
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-56 bg-slate-800 border-slate-700 text-slate-200"
          >
            <DropdownMenuLabel className="text-slate-400 text-xs font-normal">
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-slate-200">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-slate-200">
              <Settings className="w-4 h-4 mr-2 text-slate-400" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              className="hover:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300 focus:bg-slate-700 focus:text-red-300"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent showClose />
      </aside>

      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-slate-900 transition-all duration-300 ease-in-out flex-shrink-0 relative",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] z-10 flex items-center justify-center w-6 h-6 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-full border-2 border-slate-900 transition-all shadow-lg"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors flex-shrink-0"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <Breadcrumb pathname={pathname} />
          </div>

          <div className="flex items-center gap-2">
            {/* Search bar */}
            <div
              className={cn(
                "hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all",
                searchFocused
                  ? "border-blue-400 bg-white ring-2 ring-blue-100 w-64"
                  : "border-slate-200 bg-slate-50 w-48 hover:border-slate-300"
              )}
            >
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
              />
            </div>

            {/* Notification bell */}
            <button
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                      CP
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    Chef de Projet
                  </span>
                  <ChevronRight className="hidden sm:block w-3 h-3 text-slate-400 rotate-90" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  kader.omar@gmail.com
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  )
}
