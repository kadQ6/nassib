# ARCHI HOSP — Logique programme → exécution

> Projet Nassib en **phase exécution** — référentiels amont figés, dérivation automatique vers le suivi chantier.

---

## 1. Principe

L'application ne part **pas** d'un projet vierge. Elle repose sur :

1. **Plan APD finalisé** (V3, verrouillé)
2. **BOQ validé** (V2, 12,5 M€)
3. **Dispatching des locaux** — rôle clinique, effectifs, besoins CFO/CFA/gaz/DM/bureautique
4. **Schéma d'implantation DM** — slots équipements, mobilier, IT par local

À partir de ces données, le **moteur de dérivation** génère les work packages qui alimentent :

- Déploiement MEP (CFO, CFA, CVC, fluides, VDI, SSI)
- Production O₂ (centrale TEC-01 → prises par local)
- Commandes & achats
- Logistique livraisons
- Installations équipements
- Essais & coordination (réunions)

---

## 2. Chaîne de données

```
┌─────────────────┐
│ Plan APD V3     │──┐
│ BOQ V2 validé   │──┼──► ProgrammeContext (baseline figée)
│ Dispatch V1.2   │──┤
│ Schéma DM V1    │──┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ deriveProgramme │  src/lib/programme/derive-engine.ts
└────────┬────────┘
         │
         ├──► Work packages MEP (par local × lot)
         ├──► Production / essais O₂
         ├──► Commandes DM + logistique
         ├──► Installations (bio, mobilier, IT)
         └──► Révisions programme (propositions d'évolution)
         │
         ▼
┌─────────────────────────────────────────────┐
│ Modules exécution                           │
│ planning · lots · achats · logistique ·     │
│ équipements · fluides · réserves · réunions │
└─────────────────────────────────────────────┘
```

---

## 3. Modèle dispatching local

Chaque local (`RoomDispatch`) contient :

| Champ | Usage |
|-------|--------|
| `assignedRole` | Rôle fonctionnel validé |
| `clinicalActivity` | Activité clinique |
| `staffing` | IDE, médecins, aides, admin |
| `needs` | CFO, CFA, CVC, plomberie, gaz, mobilier, SSI, VDI, DM |
| `gasOutlets` | Prises O₂, vide, air médical planifiées |
| `dispatchRevision` | Numéro de révision |

---

## 4. Fichiers code

| Fichier | Rôle |
|---------|------|
| `src/types/programme.ts` | Types baseline, dispatch, dérivation |
| `src/lib/programme/baseline.ts` | Référentiels figés Nassib |
| `src/lib/programme/dispatch.ts` | 15 locaux dispatchés |
| `src/lib/programme/equipment-schema.ts` | Slots implantation DM/mobilier/IT |
| `src/lib/programme/derive-engine.ts` | Moteur de dérivation |
| `src/lib/programme/index.ts` | `buildProgrammeContext()` |
| `src/app/(dashboard)/programme/*` | UI programme |

---

## 5. Révisions

Toute modification amont (dispatch, DM, BOQ) passe par une **révision programme** :

- `proposed` → analyse d'impact
- `approved` → re-dérivation des work packages
- `rejected` → ignorée

Exemple ouvert : URG-01 +2 prises O₂ (impact essais fluides +5j).

---

## 6. Prochaines étapes v0.4

1. Re-dérivation automatique à l'approbation d'une révision
2. Lien bidirectionnel work package ↔ tâche planning
3. Extension 130 locaux (modèle identique)
4. Persistance Supabase (`programme_baseline`, `room_dispatch`, `derived_packages`)
5. Import Excel dispatching / schéma DM

---

*K'BIO Conseil — Confidentiel*
