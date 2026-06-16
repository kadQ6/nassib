"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoomHub } from "@/types/room-hub";

const NEED_KEYS = [
  { key: "cfo", label: "CFO" },
  { key: "cfa", label: "CFA" },
  { key: "vdi", label: "VDI" },
  { key: "medicalGas", label: "Gaz médicaux" },
  { key: "plumbing", label: "Plomberie" },
  { key: "cvc", label: "CVC" },
  { key: "ssi", label: "SSI" },
] as const;

type NeedKey = (typeof NEED_KEYS)[number]["key"];

function matchesNeed(h: RoomHub, key: NeedKey): boolean {
  if (key === "medicalGas") return h.profile.needs.medicalGas;
  return Boolean(h.profile.needs[key]);
}

export function BesoinsFilterPanel({ rooms }: { rooms: RoomHub[] }) {
  const params = useSearchParams();
  const active = params.get("besoin") as NeedKey | null;

  const needCounts = rooms.reduce<Record<string, number>>((acc, h) => {
    for (const n of NEED_KEYS) {
      if (matchesNeed(h, n.key)) acc[n.key] = (acc[n.key] ?? 0) + 1;
    }
    return acc;
  }, {});

  const filtered = active
    ? rooms.filter((h) => matchesNeed(h, active))
    : [];

  const gasTotals = rooms.reduce(
    (s, h) => ({
      o2: s.o2 + h.profile.needs.o2Outlets,
      vacuum: s.vacuum + h.profile.needs.vacuumOutlets,
      air: s.air + h.profile.needs.medicalAirOutlets,
    }),
    { o2: 0, vacuum: 0, air: 0 },
  );

  return (
    <>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#003F72]">
          Synthèse — cliquez pour filtrer les locaux
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NEED_KEYS.map((n) => (
            <Link key={n.key} href={`/besoins-techniques?besoin=${n.key}`}>
              <Card
                className={`cursor-pointer transition-shadow hover:shadow-md ${
                  active === n.key ? "ring-2 ring-[#0891B2]" : ""
                }`}
              >
                <CardContent className="flex items-center justify-between py-4">
                  <span className="text-sm font-medium">{n.label}</span>
                  <Badge variant="brand">{needCounts[n.key] ?? 0} locaux</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {active && (
          <p className="mt-3 text-sm text-slate-600">
            Filtre actif : <strong>{NEED_KEYS.find((n) => n.key === active)?.label}</strong>
            {" · "}
            <Link href="/besoins-techniques" className="text-[#0891B2] hover:underline">
              Tout afficher
            </Link>
          </p>
        )}
      </section>

      {active && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#003F72]">
            Locaux — {NEED_KEYS.find((n) => n.key === active)?.label} ({filtered.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((h) => (
              <Link key={h.room.id} href={`/locaux/${h.room.id}`}>
                <Card className="hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {h.room.code} — {h.room.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1">
                    {NEED_KEYS.filter((n) => matchesNeed(h, n.key)).map((n) => (
                      <Badge key={n.key} variant="brand">{n.label}</Badge>
                    ))}
                    {h.profile.needs.medicalGas && (
                      <Badge variant="warning">
                        O₂×{h.profile.needs.o2Outlets} · Asp.×{h.profile.needs.vacuumOutlets}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#003F72]">Prises fluides (plan)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/besoins-techniques?besoin=medicalGas">
            <Card className="hover:shadow-md">
              <CardContent className="py-4 text-center">
                <p className="text-2xl font-bold text-[#003F72]">{gasTotals.o2}</p>
                <p className="text-sm text-slate-500">Prises O₂</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/besoins-techniques?besoin=medicalGas">
            <Card className="hover:shadow-md">
              <CardContent className="py-4 text-center">
                <p className="text-2xl font-bold text-[#003F72]">{gasTotals.vacuum}</p>
                <p className="text-sm text-slate-500">Aspiration</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/besoins-techniques?besoin=medicalGas">
            <Card className="hover:shadow-md">
              <CardContent className="py-4 text-center">
                <p className="text-2xl font-bold text-[#003F72]">{gasTotals.air}</p>
                <p className="text-sm text-slate-500">Air médical</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </>
  );
}
