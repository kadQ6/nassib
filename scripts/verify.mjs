#!/usr/bin/env node
/**
 * Smoke test ARCHI HOSP — vérifie build data + routes HTTP
 * Usage: node scripts/verify.mjs [port]
 */
const PORT = process.argv[2] || process.env.PORT || 3456;
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  "/",
  "/login",
  "/planning",
  "/lots",
  "/lots/lot-cvc",
  "/locaux",
  "/locaux/r-blc-01",
  "/reserves",
  "/programme",
  "/programme/dispatch",
  "/programme/derivations",
  "/departements",
  "/besoins-techniques",
  "/mobilier",
  "/budget",
  "/logistique",
  "/taches",
  "/suivi-chantier",
  "/documents",
  "/approvisionnements",
  "/equipements",
  "/equipements/bilan",
  "/equipements/ecarts-boq",
  "/equipements/recap",
  "/equipements/financier",
  "/projet",
  "/fluides-medicaux",
  "/essais",
  "/boq",
  "/boq/paiements",
  "/reunions",
  "/journal",
  "/risques",
  "/rapports",
  "/settings",
];

async function check(path, expectJson = false) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) return { path, ok: false, status: res.status };
  if (expectJson) {
    const data = await res.json();
    return { path, ok: data.status === "ok", status: res.status, data };
  }
  return { path, ok: true, status: res.status };
}

async function main() {
  console.log(`\n🔍 ARCHI HOSP verify — ${BASE}\n`);

  const health = await check("/api/health", true);
  const initialReserves = health.data?.counts?.reserves ?? 0;
  console.log(
    health.ok
      ? `✅ /api/health — masterIndex ${health.data?.masterIndex}, reserves ${initialReserves}`
      : `❌ /api/health — ${health.status}`,
  );

  // CRUD smoke (demo mode)
  let crudOk = false;
  try {
    const createRes = await fetch(`${BASE}/api/demo/reserves`, { method: "POST" });
    const createData = await createRes.json();
    const healthAfter = await check("/api/health", true);
    const afterCount = healthAfter.data?.counts?.reserves ?? 0;
    await fetch(`${BASE}/api/demo/reserves`, { method: "DELETE" });
    crudOk =
      createRes.ok &&
      createData.delta === 1 &&
      afterCount === initialReserves + 1;
    console.log(
      crudOk
        ? `✅ CRUD réserves — ${createData.created} (+1 puis reset)`
        : `❌ CRUD réserves — delta=${createData.delta}, count=${afterCount}`,
    );
  } catch {
    console.log("❌ CRUD réserves — endpoint inaccessible");
  }

  const csv = await fetch(`${BASE}/api/export/reserves`);
  const csvOk = csv.ok && (await csv.text()).includes("number,date,room");
  console.log(csvOk ? "✅ /api/export/reserves — CSV OK" : "❌ /api/export/reserves");

  let failed = 0;
  for (const route of ROUTES) {
    const r = await check(route);
    if (r.ok) {
      console.log(`✅ ${route} — ${r.status}`);
    } else {
      console.log(`❌ ${route} — ${r.status}`);
      failed++;
    }
  }

  console.log(
    failed === 0
      ? `\n✅ Tous les tests passés (${ROUTES.length} routes)\n`
      : `\n❌ ${failed} route(s) en échec\n`,
  );
  process.exit(failed === 0 && health.ok && csvOk && crudOk ? 0 : 1);
}

main().catch((e) => {
  console.error("❌ Serveur inaccessible — lancez: npm run dev");
  console.error(e.message);
  process.exit(1);
});
