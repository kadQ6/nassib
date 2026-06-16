import { NextResponse } from "next/server";
import { addReserve, getNassibBundle, resetNassibStore } from "@/lib/nassib";

/** Smoke test CRUD réserves — actif uniquement en mode démo */
export async function POST() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Demo only" }, { status: 403 });
  }

  const before = getNassibBundle().reserves.length;

  const reserve = addReserve({
    title: "Test verify script",
    description: "Créée par scripts/verify.mjs",
    zone: "Zone test",
    lotCode: "LOT-CVC",
    company: "Entreprise test",
    severity: "minor",
    type: "technique",
    correctiveAction: "Vérification auto",
    assignedTo: "QA Script",
    dueDate: "2026-12-31",
    blocksReception: false,
  });

  const after = getNassibBundle().reserves.length;

  return NextResponse.json({
    ok: true,
    before,
    after,
    created: reserve.number,
    delta: after - before,
  });
}

export async function DELETE() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Demo only" }, { status: 403 });
  }

  resetNassibStore();
  const count = getNassibBundle().reserves.length;

  return NextResponse.json({ ok: true, reset: true, reserves: count });
}
