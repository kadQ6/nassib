import type { SiteEvent } from "@/types/nassib";
import { formatDate } from "@/lib/utils";

export function RecentEvents({ events }: { events: SiteEvent[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#003F72]">Derniers événements</h3>
      <ul className="space-y-3">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <time className="shrink-0 text-xs text-slate-400">
              {formatDate(ev.date)}
            </time>
            <div>
              <p className="text-sm text-slate-800">{ev.message}</p>
              <p className="text-xs capitalize text-[#0891B2]">{ev.module}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
