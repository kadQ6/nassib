# Architecture Room Hub — ARCHI HOSP v0.4

## Principe

L'application part d'un **chantier déjà en cours** avec des données validées (plan APD, BOQ, planning, dispatch locaux).  
L'unité centrale de pilotage est le **local** (`RoomHub`), pas une tâche isolée ou un Gantt générique.

## Modèle de données

```
ProjectBaseline (validé)
    └── RoomHub[] (15 locaux démo)
            ├── RoomProfile (rôle, service, besoins, personnel, prérequis, réception)
            ├── NassibRoom (état chantier, checklist, lots)
            ├── RoomCrossLinks
            │     ├── tasks, lots, boqLines
            │     ├── equipmentBiomedical, furniture, itAssets
            │     ├── procurement, documents
            │     ├── reserves, tests
            │     └── derivedPackages (programme)
            └── RoomHubMetrics (KPI agrégés)
```

Fichiers clés :
- `src/types/room-hub.ts` — types
- `src/lib/room-hub/profiles.ts` — profils dispatch validés
- `src/lib/room-hub/registry.ts` — croisement automatique bundle → hubs
- `src/lib/nassib/index.ts` — `roomRegistry` dans le store

## Navigation (17 modules)

1. Projet → `/projet`  
2. Plans → `/plans`  
3. **Locaux** → `/locaux` + fiche `/locaux/[id]` (cockpit)  
4. Besoins techniques → `/besoins-techniques`  
5–17. BOQ, Planning, Lots, Équipements, Appro, Logistique, Tâches, Réunions, Réserves, Essais, Paiements, Réception, Mise en exploitation

## Exemple métier (GYN-01)

Depuis la fiche local, l'utilisateur accède à :
- prises O₂ / vide / air (profil)
- lots MEP (CVC, plomberie, fluides)
- échographe obstétrique (équipement)
- lignes BOQ lot fluides/CVC
- tâches planning rattachées
- réserves condensats CVC
- essais fluides
- documents plan + fiches techniques
- statut réception

## Prochaines étapes

- Persistance Supabase (`room_profiles`, `room_links` matérialisés)
- Import IFC/plans → création locaux
- 130 locaux Nassib (extension seed)
- Workflow réception OPR avec signatures
