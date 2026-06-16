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

## Configuration Supabase

Copier `.env.local.example` vers `.env.local` et renseigner :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DEMO_MODE=false
```

Puis appliquer la migration SQL sur votre projet Supabase.
