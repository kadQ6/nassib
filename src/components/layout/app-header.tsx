"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getNassibBundle } from "@/lib/nassib";

export function AppHeader({ title }: { title: string }) {
  const router = useRouter();
  const { project } = getNassibBundle();

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#0891B2]">
          {project.code}
        </p>
        <h2 className="text-xl font-semibold text-[#003F72]">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm sm:block">
          <p className="font-medium text-slate-900">{project.name}</p>
          <p className="text-slate-500">{project.location}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
