# ARCHI HOSP

Plateforme de pilotage de chantier hospitalier — K'BIO.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Supabase (Auth, PostgreSQL, Storage, RLS)
- Données démo intégrées pour développement sans backend

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) — mode démo activé via `.env.local`.

## Documentation

- [Plan d'architecture complet](docs/PLAN_ARCHITECTURE.md)
- Schéma SQL : `supabase/migrations/00001_init_schema.sql`

## Modules MVP

| Module | Route |
|--------|-------|
| Dashboard chantier | `/` |
| Planning WBS + Gantt | `/planning` |
| Lots techniques | `/lots` |
| Locaux room-by-room | `/locaux` |
| Réserves | `/reserves` |
| Documents | `/documents` |
| Approvisionnements | `/approvisionnements` |
| Équipements biomédicaux | `/equipements` |
| Essais / réception | `/essais` |
| BOQ / paiements | `/boq`, `/boq/paiements` |
| Rapports & exports | `/rapports` |

> Le code applicatif vit entièrement sous `src/`. L'alias `@/*` pointe vers `src/*`.

## Exports Excel / PDF / CSV

Chaque module est exportable depuis la page **Rapports** (`/rapports`) ou via l'API :

```
GET /api/export/{format}/{dataset}
```

- `format` : `xlsx` | `pdf` | `csv`
- `dataset` : `reserves`, `boq`, `equipements`, `tests`, `approvisionnements`,
  `planning`, `projet`, une liste séparée par des virgules, ou `all`

Exemples : `/api/export/xlsx/all`, `/api/export/pdf/boq,equipements`, `/api/export/csv/reserves`.

Les colonnes sont déclarées une seule fois dans `src/lib/export/datasets.ts`
(source unique partagée par les trois formats). Générateurs : `excel.ts` (ExcelJS),
`pdf.ts` (jsPDF + autotable), `format.ts` (CSV).

## Tests

```bash
npm test          # Vitest — logique métier + générateurs d'export
npm run verify    # Smoke test HTTP des 35 routes (serveur dev requis)
```

## Configuration Supabase

Copier `.env.local.example` vers `.env.local` et renseigner :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DEMO_MODE=false
```

Puis appliquer la migration SQL sur votre projet Supabase.
