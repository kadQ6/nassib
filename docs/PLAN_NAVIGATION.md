# ARCHI HOSP — Plan de navigation v0.3

> Alignement sur le référentiel **K'BIO Pilotage Hospitalier**  
> Projet : Polyclinique Nassib · Djibouti  
> Date : 2026-06-13

---

## 1. Découpage en 4 domaines

L'application est structurée en **4 piliers** distincts, chacun avec un périmètre métier clair :

| Domaine | Rôle | Public cible |
|---------|------|--------------|
| **Pilotage** | Vision MOA/MOE, spatialisation, documents | Direction projet, architecte, MOA |
| **Programme** | Besoins techniques, équipements, mobilier | Ingénierie biomédicale, AMO technique |
| **Finances** | Budget, achats, logistique | Finance, achats, OPC |
| **Chantier** | Exécution terrain, BOQ, réserves, paiements | OPC, entreprises, conducteurs travaux |

---

## 2. Arborescence navigation (sidebar)

### PILOTAGE
| Écran | Route | Statut MVP |
|-------|-------|------------|
| Tableau de bord | `/` | ✅ |
| Bâtiments & niveaux | `/batiments` | ✅ |
| Départements | `/departements` | ✅ |
| Locaux | `/locaux` | ✅ |
| Documents | `/documents` | ✅ |
| Rapports | `/rapports` | ✅ |

### PROGRAMME
| Écran | Route | Statut MVP |
|-------|-------|------------|
| Besoins techniques | `/besoins-techniques` | ✅ |
| Équipements | `/equipements` | ✅ |
| Mobilier | `/mobilier` | ✅ |

### FINANCES
| Écran | Route | Statut MVP |
|-------|-------|------------|
| Budget | `/budget` | ✅ |
| Achats | `/approvisionnements` | ✅ |
| Logistique | `/logistique` | ✅ |

### CHANTIER
| Écran | Route | Statut MVP |
|-------|-------|------------|
| BOQ | `/boq` | ✅ |
| Suivi chantier | `/suivi-chantier` | ✅ (hub) |
| Réserves | `/reserves` | ✅ + CRUD démo |
| Paiements | `/boq/paiements` | ✅ |

---

## 3. Modules secondaires (via Suivi chantier)

Ces écrans restent accessibles depuis le hub **Suivi chantier** :

| Module | Route | Regroupement |
|--------|-------|--------------|
| Planning WBS / Gantt | `/planning` | Chantier |
| Lots MEP | `/lots` | Chantier |
| Fluides médicaux | `/fluides-medicaux` | Chantier + Programme |
| Essais / OPR | `/essais` | Chantier |
| Réunions | `/reunions` | Chantier |
| Journal | `/journal` | Chantier |
| Risques | `/risques` | Chantier |

---

## 4. Mapping données Nassib

```
Pilotage
  batiments    ← rooms.groupBy(level)
  departements ← zones + rooms.groupBy(zoneId)
  locaux       ← rooms[] + fiche room

Programme
  besoins      ← room.needs + medicalGas[]
  equipements  ← equipment[]
  mobilier     ← rooms.filter(needs.furniture)

Finances
  budget       ← project + boq[] + dashboard
  achats       ← procurement[]
  logistique   ← procurement[] (flux livraison)

Chantier
  boq          ← boq[]
  suivi        ← hub → planning, lots, essais…
  reserves     ← reserves[] (store mutable)
  paiements    ← boq payments
```

---

## 5. Évolutions planifiées (v0.4+)

1. **130 locaux** — extension seed Nassib (actuellement 15 locaux démo)
2. **Hiérarchie bâtiment** — Bâtiment A/B, sous-sols, toiture
3. **Mobilier** — fiches mobilier liées aux locaux + quantités
4. **Budget** — courbes S, scénarios, avenants
5. **Logistique** — scan réception, stock par zone
6. **Permissions** — masquage sidebar par rôle (MOA, OPC, ing. bio…)
7. **Supabase** — persistance sur toutes les entités

---

## 6. Fichiers de référence code

| Fichier | Rôle |
|---------|------|
| `src/lib/navigation.ts` | Config centralisée sidebar |
| `src/components/layout/app-sidebar.tsx` | UI sidebar |
| `src/app/(dashboard)/layout.tsx` | Layout sidebar + contenu |

---

*K'BIO Conseil — Confidentiel*
