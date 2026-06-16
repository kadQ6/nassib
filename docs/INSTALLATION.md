# Installation — ARCHI HOSP

## Prérequis

- Node.js 20+
- npm
- Compte Supabase (optionnel en mode démo)

## Démarrage rapide (mode démo)

```bash
cd "ARCHI HOSP"
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_DEMO_MODE=true est suffisant
npm run dev
```

Ouvrir http://localhost:3000 → bouton « Accès démo » sur `/login`.

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier URL et clé anon dans `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_DEMO_MODE=false
```

3. Appliquer les migrations SQL dans l'ordre :
   - `supabase/migrations/00001_init_schema.sql`
   - `supabase/migrations/00002_nassib_extension.sql`

4. Activer Supabase Auth (email/password)
5. Créer un bucket Storage `documents` pour la GED

## Build production

```bash
npm run build
npm start
```

## Structure clé

| Dossier | Rôle |
|---------|------|
| `src/lib/nassib/` | Données projet Polyclinique Nassib |
| `src/lib/calculations/` | Avancement, indice maîtrise, alertes |
| `src/app/(dashboard)/` | 15 modules UI |
| `supabase/migrations/` | Schéma PostgreSQL + RLS |

## Projet par défaut

**Polyclinique Nassib** — Djibouti  
Période contractuelle : 01/06/2025 → 31/01/2027

Données démo : 35 tâches, 28 phases WBS, 15 locaux, 10 lots MEP, 20 réserves, 15 équipements bio, 10 approvisionnements, 5 réunions, 6 risques.
