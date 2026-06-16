import Link from "next/link";
import { NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppLauncher() {
  return (
    <div className="space-y-8">
      {NAV_SECTIONS.map((section) => (
        <section key={section.id}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-400">
            {section.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-[#0891B2]/40 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#003F72]/5 text-[#003F72]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={cn("text-sm font-medium text-slate-800")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
