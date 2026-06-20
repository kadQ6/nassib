# Fiches locaux & Plans généraux CFO/CFA — Gaz médicaux — Polyclinique Nassib (FIOG)

Livrables générés à partir de l'analyse des plans architecte `A-01` (RDC) / `A-02` (R+1)
indice 180526 et des fiches d'équipement FIOG, en lien avec l'étude
[`../ETUDE_TECHNIQUE_CFO_CFA_GAZ.md`](../ETUDE_TECHNIQUE_CFO_CFA_GAZ.md).

## 1. Plans généraux (principe de distribution, en overlay sur le plan 2D)

`public/plans/generated/` :

| Fichier | Contenu |
|---|---|
| `RDC_CFO_CFA.png` | Plan général CFO/CFA RDC — zones par criticité, TGBT, colonne montante, TD de zone |
| `R1_CFO_CFA.png` | Idem niveau R+1 |
| `RDC_GAZ.png` | Plan général gaz médicaux RDC — centrale, colonne, vannes & alarmes de zone |
| `R1_GAZ.png` | Idem niveau R+1 |

Zonage **indicatif de principe** (avant-projet) : le détail terminal local-par-local
est porté par les plans d'implantation et les fiches ci-dessous.

### Plans d'implantation des prises (repères par local)

Niveau de détail supérieur : un repère compact des prises est placé **à l'emplacement
de chaque local** sur le plan 2D réel.

| Fichier | Contenu |
|---|---|
| `RDC_IMPLANTATION_GAZ.png` / `R1_IMPLANTATION_GAZ.png` | Prises O₂ / Air / Vide (+N₂O/AGSS) par local desservi |
| `RDC_IMPLANTATION_CFO_CFA.png` / `R1_IMPLANTATION_CFO_CFA.png` | PC normale, PC ondulée/secourue, RJ45, appel malade, alim. dédiées par local |

> **Maternité** : le RDC ne comporte **aucune chambre maternité** (plateau obstétrical
> uniquement : pré-travail, travail, bloc). Les **14 chambres maternité sont au R+1**
> (plan A-02). Implantation **indicative** à caler sur fond DWG ; positions exactes par le BE.

### Dossier PDF A3 (8 plans + page de garde)

`docs/plans/plans-techniques-nassib-A3.pdf` — les 4 plans de principe + 4 plans
d'implantation assemblés en **A3 paysage**, 1 plan par page, cartouche en pied de page.

**Régénérer :**
```bash
# nécessite les rendus PNG des plans dans $PLANS_SRC (défaut /tmp/plans)
python3 scripts/gen-plans-generaux.py        # plans de principe (zonage + réseaux)
node   scripts/gen-fiches-locaux.mjs         # fiches HTML + rooms-data.json
python3 scripts/gen-fiches-xlsx.py           # classeur Excel éditable
python3 scripts/gen-plans-implantation.py    # plans d'implantation des prises
python3 scripts/gen-plans-pdf.py             # dossier PDF A3 des 8 plans
```

## 2. Fiches locaux remplies (room-by-room)

`docs/fiches-locaux/` :

| Fichier | Contenu |
|---|---|
| `fiches-locaux-nassib.html` | 76 fiches (1/local) au format K'BIO, imprimables A4 paysage |
| `fiches-locaux-nassib.pdf` | Même contenu, PDF prêt à diffuser (couverture + 76 fiches) |
| `fiches-locaux-nassib.xlsx` | **Classeur Excel éditable** — matrice room-by-room (76 locaux × 55 colonnes groupées : identité, finitions, portes, CVC, CFO, CFA, fluides, plomberie) + feuille Légende. Filtres + volets figés. |

Chaque fiche reprend le gabarit « fiche local K'BIO » et remplit, par local :
finitions (sols/murs/plafonds/plinthes), portes, CVC (renouvellement, T°, surpression,
filtration), **électricité CFO/CFA** (PC normale/ondulée/secourue, RJ45, appel infirmière,
vidéo, contrôle d'accès… avec colonnes Qté/Bras/Mur/GTL-bandeau), **fluides médicaux**
(O₂/Vide/Air/N₂O), surface/volume, plomberie sanitaire, et observations (criticité,
régime électrique, réserves).

Données : **visible** plan / fiches FIOG + valeurs **déduites/proposées** des templates
techniques — à dimensionner par les bureaux d'études. Ne vaut pas plan d'exécution.

**Régénérer :**
```bash
node scripts/gen-fiches-locaux.mjs                 # -> HTML
python3 -c "from weasyprint import HTML; HTML('docs/fiches-locaux/fiches-locaux-nassib.html').write_pdf('docs/fiches-locaux/fiches-locaux-nassib.pdf')"
```

Le catalogue source des 76 locaux et les templates techniques restent
`src/data/nassib/plan-catalog.ts` et `src/lib/room-sheet/templates.ts` (référence projet).
