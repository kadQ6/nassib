import { NextResponse } from "next/server";
import { getNassibBundle } from "@/lib/nassib";

export async function GET() {
  const bundle = getNassibBundle();
  const { dashboard, project, reserves, tasks, rooms, mepLots } = bundle;

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? "demo" : "production",
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    project: {
      code: project.code,
      name: project.name,
      progressActual: dashboard.projectProgressActual,
      progressPlanned: dashboard.projectProgressPlanned,
      phase: bundle.programme.baseline.projectPhase,
    },
    programme: {
      baselineVersion: bundle.programme.baseline.dispatch.version,
      derivedPackages: bundle.programme.derivation.summary.totalPackages,
      dispatches: bundle.programme.dispatches.length,
      openRevisions: bundle.programme.derivation.summary.openRevisions,
    },
    counts: {
      tasks: tasks.length,
      rooms: rooms.length,
      lots: mepLots.length,
      reserves: reserves.length,
      openReserves: dashboard.openReserves,
    },
    masterIndex: dashboard.masterIndex.score,
  });
}
