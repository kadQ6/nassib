# Guide utilisateur — ARCHI HOSP (MVP v0.2)

## Connexion

- Mode démo : accès direct sans identifiants
- Mode production : email + mot de passe Supabase

## Page d'accueil

Après connexion, le **tableau de bord global** affiche :

- **Indice de maîtrise chantier** (/100) — vert / orange / rouge
- KPIs : avancement prévu vs réel, écart délai, écart budget, réserves, approvisionnements
- Graphique avancement par lot MEP
- **15 cartes applications** — un clic ouvre chaque module

## Modules principaux

| Module | Usage quotidien |
|--------|-----------------|
| **Planning** | WBS 28 phases, Gantt, alertes retard/MEP |
| **Lots MEP** | Suivi CFO, CVC, fluides, SSI par entreprise |
| **Locaux** | Room-by-room, checklist, prérequis |
| **Réserves** | Punch list, gravité, blocage réception |
| **Fluides médicaux** | O₂, vide, air — checklist validation |
| **Équipements bio** | Statuts commande → MES, alertes prérequis |
| **Essais / OPR** | Protocoles par système |
| **BOQ / Paiements** | Situations, retenues, workflow validation |
| **Réunions** | CR, décisions, actions |
| **Journal** | Compte rendu quotidien |
| **Risques** | Registre, criticité, plans d'action |
| **Rapports** | Export CSV réserves |

## Rôles (production)

MOA, Chef de projet, OPC, Architecte, Ingénieur biomédical, Ingénieur MEP, Entreprise, Finance, Lecture seule — voir `src/lib/constants/roles.ts`.

## Règles métier intégrées

- Pas de fermeture faux plafond avant validation MEP (alerte auto)
- Document obsolète ≠ référence active
- Équipement sans prérequis local → alerte
- Réserves bloquantes listées sur l'accueil

## Exports

- CSV réserves : module Rapports ou `/api/export/reserves`
- PDF / Excel complets : prévus MVP+
