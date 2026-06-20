# PROMPT — Génération d'un plan 2D CFO/CFA + Gaz médicaux (Polyclinique Nassib)

> **Mode d'emploi.** Copiez-collez l'intégralité de ce document dans une IA capable
> de produire des plans techniques (ou de piloter un outil de DAO). Il contient le
> contexte, les décisions figées, les données local-par-local, les conventions
> graphiques et la définition exacte du livrable attendu. Tout ce qui est marqué
> **[À CONFIRMER]** doit rester signalé comme tel sur le plan.

---

## 0) RÔLE & MISSION

Tu es **projeteur senior en électricité hospitalière (CFO/CFA) et fluides médicaux**.
À partir des informations ci-dessous (issues des plans architecte A-01/A-02 de la
Polyclinique Nassib — Fondation Ismail Omar Guelleh, Djibouti — indice 180526 — et des
fiches d'équipement FIOG), tu dois produire **deux familles de plans 2D, par niveau** :

1. **Plan CFO/CFA** (courants forts + courants faibles) — RDC et R+1.
2. **Plan de distribution des gaz médicaux** — RDC et R+1.

Pour chaque famille, produire **2 vues** :
- **(A) Plan de principe / distribution** : sources, troncs, colonnes montantes, tableaux/vannes de zone, alarmes.
- **(B) Plan d'implantation des prises** : repère par local avec quantités exactes (table §5).

Le rendu doit être **propre, orthogonal, coté logiquement, normalisé** (cartouche, légende,
flèche Nord), exploitable par un BE pour établir les plans d'exécution. **Ne pas inventer**
de donnée présentée comme certaine ; conserver les codes/noms de locaux ; rester générique
sur les équipements (pas de marque).

---

## 1) CONTEXTE BÂTIMENT (visible sur plans)

- Établissement de santé recevant du public — **2 niveaux : RDC (plan A-01) + R+1 (plan A-02)**.
- **Double circulation parallèle nommée** (épine dorsale de la séparation des flux) :
  - **« Couloir circulation équipement & personnel médical–paramédical »** (côté **arrière / personnel**, au Nord du plan).
  - **« Couloir circulation famille–patient »** (côté **public/patient**, plus au Sud).
- **Circulation verticale** : 1 **ascenseur + escalier central** (≈ milieu du bâtiment, repère grilles M–N),
  et 1 **escalier secondaire Est** (grilles R/S, mention « HAUT »).
- Trame : files **A → S** (horizontal), **1 → 10** (vertical).

### Zones fonctionnelles
**RDC :** Maternité/plateau obstétrical (Pré-travail ×3, Travail ×3, Infirmerie mat., Bureaux mat.),
Bloc Césarienne + SAS + SSPI/Salle de réveil + Stérilisation, Consultations (Bureau CS, GYN, Dentaire),
Imagerie (Radiologie), Laboratoire, Pharmacie/Magasin, Urgences (SAS accueil, Box 1–4, Déchocage,
Petit chir, Infirmerie urg., Mini-labo, Bureaux urg., Stock), Accueil/Caisse/Admin/Salle d'attente, Vestiaires.
**R+1 :** Hospitalisation **Maternité — Chambres 1 à 14** (post-partum), Bibonnerie & soin bébé (néonat léger),
Hospitalisation Médecine (Chambres 1–7), Hôpital de jour, Infirmerie d'étage, Administration/Direction, Salle d'attente.

> **RÈGLE FERME :** le **RDC ne comporte AUCUNE chambre maternité** (uniquement le plateau
> obstétrical). **Les 14 chambres maternité sont toutes au R+1.** Ne pas en placer au RDC.

---

## 2) POINTS DE DÉPART (décisions figées par le maître d'ouvrage)

- **Électricité (CFO/CFA)** : départ depuis le **LOCAL TECHNIQUE EXTÉRIEUR ARRIÈRE** (au Nord,
  hors enveloppe) contenant **arrivée générale + TGBT + groupe électrogène + onduleur (ASI)**.
  L'alimentation **entre par l'arrière** du bâtiment.
- **Gaz médicaux** : **centrale au même secteur technique extérieur arrière** —
  **production O₂ + secours bouteilles + réserve**, **centrale de vide**, **centrale d'air médical**
  (séparation réglementaire élec/gaz). Accès livraison bouteilles + ventilation.
- **Colonne montante (liaison verticale RDC ↔ R+1)** : **gaine technique à l'escalier central**
  (une seule colonne retenue).

### Schéma imposé de distribution
1. Source (arrière) → **alimentation entrante par l'arrière**.
2. → **TRONC PRINCIPAL** cheminant **le long du couloir personnel** (arrière).
3. → **COLONNE MONTANTE** unique à l'**escalier central** desservant le R+1.
4. → **ANTENNES ORTHOGONALES** (tracés à angle droit uniquement, **jamais en diagonale**)
   descendant du tronc vers **un tableau divisionnaire (TD) par zone** (CFO/CFA) ou
   **un coffret de vanne de zone** (gaz).
5. Au **R+1**, l'alimentation **arrive par la colonne montante** puis se distribue via un
   **tronc d'étage** vers les TD/vannes de chaque zone.

---

## 3) PRINCIPE CFO/CFA À DESSINER

- **Trois réseaux terminaux**, repérés par couleur de prise : **Normal (blanc)** /
  **Secouru groupe (rouge)** / **Ondulé ASI (vert)**.
- **Un TD par zone fonctionnelle et par niveau**, alimenté depuis le tronc/colonne montante.
- **Régime IT médical** (transformateur d'isolement + **contrôleur permanent d'isolement (CPI)**
  avec report d'alarme) pour les **locaux du groupe 2** : **Bloc Césarienne, SSPI/Salle de réveil,
  Déchocage, Petit chir**.
- **Liaisons équipotentielles supplémentaires** dans ces mêmes locaux.
- **Alimentations force dédiées** : générateur **Radiologie**, **autoclave** (stérilisation),
  enceintes **réfrigérées pharmacie/labo**, têtes de bloc.
- **CFA séparé des CFO** (chemins de câbles distincts). **SSI (détection incendie)** et
  **appel malade** sur **câblage et alimentation indépendants**.
- CFA à représenter : RJ45/VDI, Wi-Fi, téléphonie, **appel malade** (chambres, box, SSPI, WC),
  **vidéosurveillance** (entrées, accueils, pharmacie, stock), **contrôle d'accès** (bloc, pharma,
  stéril, technique), interphonie (SAS), **report d'alarmes** (gaz, froid, groupe, onduleur) vers GTB.

### Criticité électrique (couleur de zone)
- **Critique** : Bloc Césarienne, SSPI, Déchocage, Petit chir, locaux techniques.
- **Élevé** : Imagerie, Laboratoire, Stérilisation, Pharmacie, Pré-travail, Travail, toutes
  Chambres, Bibonnerie, Hôpital de jour, Infirmeries, Bureau GYN, Dentaire.
- **Moyen** : Consultations, bureaux médicaux.
- **Faible** : Administration, Salles d'attente, Vestiaires, Magasin, Stock.

---

## 4) PRINCIPE GAZ MÉDICAUX À DESSINER

- Gaz : **O₂ (oxygène)**, **Air médical 3,5 bar**, **Vide/aspiration**.
  **N₂O + AGSS (évacuation gaz anesthésiques)** au **Bloc Césarienne** uniquement et **[À CONFIRMER]**
  (réserve R-07, selon protocole anesthésique). **Pas d'azote/air moteur** (non requis).
- Réseau : **source arrière → réseau primaire → colonne montante (escalier central) →
  branches par zone → prises terminales**.
- **Coffret de vanne de sectionnement par zone**, accessible aux soignants.
- **Alarmes de zone** (pression haute/basse) reportées aux postes de soins + **alarme centrale**
  au local technique et en supervision.
- **Anti-suréquipement** : aucun gaz dans administration, attente, accueil, stock, magasin,
  vestiaires, imagerie, bureaux CS standard. (Aspiration dentaire = réseau dédié, **pas** le vide médical central.)
- Positions des prises : **bandeau de tête de lit/box (h ≈ 1,40 m)**, **bras/panneau** au bloc et SSPI.

---

## 5) DONNÉES LOCAL-PAR-LOCAL (à reporter exactement)

Quantités de **prises terminales gaz** (O₂/Air/Vide) et **CFO/CFA** par local.
`Crit` = criticité (C/E/M/F). `Ond/Sec` = prises ondulées/secourues. `Appel` = appel malade.
`Dédiée` = alimentations force dédiées. `N₂O/AGSS` = oui ⇒ à confirmer (R-07).

| Code | Local | Niv | Crit | O₂ | Air | Vide | N₂O/AGSS | PC16 | Ond/Sec | RJ45 | Appel | Dédiée |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ACC-01 | Accueil | RDC | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| ADM-01 | Administration | RDC | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| ATT-01 | Salle d'attente | RDC | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| BCS-01 | Bureau CS 1 | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BCS-02 | Bureau CS 2 | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BCS-03 | Bureau CS 3 | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BCS-04 | Bureau CS 4 | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BGYN-01 | Bureau GYN 1 | RDC | M | 2 | 0 | 2 | - | 4 | 1 | 2 | - | 1 |
| BGYN-02 | Bureau GYN 2 | RDC | M | 2 | 0 | 2 | - | 4 | 1 | 2 | - | 1 |
| BLC-01 | Bloc césarienne | RDC | C | 2 | 2 | 2 | oui(R-07) | 4 | 2 | 0 | - | 0 |
| BMAT-01 | Bureau Mat 1 | RDC | F | 0 | 0 | 0 | - | 2 | 1 | 0 | - | 0 |
| BMAT-02 | Bureau Mat 2 | RDC | F | 0 | 0 | 0 | - | 2 | 1 | 0 | - | 0 |
| BOX-01 | Box 1 | RDC | E | 2 | 2 | 2 | - | 2 | 4 | 4 | oui | 2 |
| BOX-02 | Box 2 | RDC | E | 2 | 2 | 2 | - | 2 | 4 | 4 | oui | 2 |
| BOX-03 | Box 3 | RDC | E | 2 | 2 | 2 | - | 2 | 4 | 4 | oui | 2 |
| BOX-04 | Box 4 | RDC | E | 1 | 1 | 1 | - | 2 | 4 | 4 | oui | 2 |
| BUR-URG1 | Bureau URG 1 | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BUR-URG2 | Bureau URG 2 | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| CAI-01 | Caisse | RDC | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| DECH-01 | Déchocage | RDC | C | 2 | 2 | 2 | - | 2 | 4 | 5 | oui | 4 |
| DEN-01 | Dentaire | RDC | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| IMG-01 | Salle radiologie | RDC | E | 0 | 0 | 0 | - | 4 | 1 | 4 | - | 2 |
| INF-MAT | Infirmerie maternité | RDC | E | 1 | 0 | 1 | - | 2 | 4 | 4 | oui | 2 |
| INF-URG | Infirmerie urgences | RDC | E | 1 | 0 | 1 | - | 2 | 4 | 4 | oui | 2 |
| LAB-01 | Laboratoire | RDC | E | 0 | 0 | 0 | - | 10 | 2 | 6 | - | 3 |
| MAG-01 | Magasin | RDC | F | 0 | 0 | 0 | - | 2 | 1 | 0 | - | 0 |
| MLAB-01 | Mini-labo | RDC | E | 0 | 0 | 0 | - | 10 | 2 | 6 | - | 3 |
| PCH-01 | Petit chirurgie | RDC | C | 1 | 1 | 1 | oui(R-07) | 8 | 2 | 4 | - | 4 |
| PHA-01 | Pharmacie | RDC | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| PRE-01 | Pré-travail 1 | RDC | E | 1 | 1 | 1 | - | 8 | 1 | 1 | oui | 2 |
| PRE-02 | Pré-travail 2 | RDC | E | 1 | 1 | 1 | - | 8 | 1 | 1 | oui | 2 |
| PRE-03 | Pré-travail 3 | RDC | E | 1 | 1 | 1 | - | 8 | 1 | 1 | oui | 2 |
| REV-01 | Salle réveil | RDC | C | 2 | 2 | 2 | - | 2 | 4 | 4 | oui | 0 |
| SAS-BLC | SAS bloc césarienne | RDC | C | 0 | 0 | 0 | - | 8 | 2 | 4 | - | 4 |
| SAS-IMG | Sas patient imagerie | RDC | E | 0 | 0 | 0 | - | 4 | 1 | 4 | - | 2 |
| SAS-URG | Sas accueil urgences | RDC | E | 2 | 0 | 2 | - | 2 | 4 | 4 | oui | 2 |
| STE-01 | Stérilisation | RDC | E | 0 | 0 | 0 | - | 8 | 1 | 2 | - | 2 |
| STK-URG | Stock urgences | RDC | F | 0 | 0 | 0 | - | 2 | 1 | 0 | - | 0 |
| TRV-01 | Salle travail 1 | RDC | E | 1 | 1 | 1 | oui(R-07) | 8 | 1 | 1 | oui | 2 |
| TRV-02 | Salle travail 2 | RDC | E | 1 | 1 | 1 | oui(R-07) | 8 | 1 | 1 | oui | 2 |
| TRV-03 | Salle travail 3 | RDC | E | 1 | 1 | 1 | oui(R-07) | 8 | 1 | 1 | oui | 2 |
| VES-F | Vestiaire femmes | RDC | F | 0 | 0 | 0 | - | 2 | 1 | 0 | - | 0 |
| VES-H | Vestiaire hommes | RDC | F | 0 | 0 | 0 | - | 2 | 1 | 0 | - | 0 |
| ACC-R1 | Accueil R+1 | R+1 | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| ADM-R1 | Administration R+1 | R+1 | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| ATT-R1 | Salle d'attente R+1 | R+1 | F | 0 | 0 | 0 | - | 6 | 1 | 4 | - | 0 |
| BIB-01 | Biberonnerie & soin bébé | R+1 | E | 1 | 1 | 1 | - | 2 | 4 | 4 | oui | 2 |
| BUR-R1-1 | Bureau R+1 — 1 | R+1 | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BUR-R1-2 | Bureau R+1 — 2 | R+1 | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BUR-R1-3 | Bureau R+1 — 3 | R+1 | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BUR-R1-4 | Bureau R+1 — 4 | R+1 | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| BUR-R1-5 | Bureau R+1 — 5 | R+1 | M | 0 | 0 | 0 | - | 4 | 1 | 2 | - | 1 |
| HDJ-01 | Hospitalisation de jour | R+1 | E | 5 | 0 | 5 | - | 2 | 4 | 4 | oui | 2 |
| HOS-01 | Chambre médicale 1 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| HOS-02 | Chambre médicale 2 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| HOS-03 | Chambre médicale 3 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| HOS-04 | Chambre médicale 4 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| HOS-05 | Chambre médicale 5 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| HOS-06 | Chambre médicale 6 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| HOS-07 | Chambre médicale 7 | R+1 | E | 2 | 0 | 2 | - | 2 | 4 | 3 | oui | 1 |
| INF-R1 | Infirmerie R+1 | R+1 | E | 1 | 1 | 1 | - | 2 | 4 | 4 | oui | 2 |
| MAT-01 | Chambre maternité 1 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-02 | Chambre maternité 2 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-03 | Chambre maternité 3 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-04 | Chambre maternité 4 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-05 | Chambre maternité 5 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-06 | Chambre maternité 6 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-07 | Chambre maternité 7 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-08 | Chambre maternité 8 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-09 | Chambre maternité 9 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-10 | Chambre maternité 10 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-11 | Chambre maternité 11 | R+1 | E | 1 | 0 | 1 | - | 2 | 4 | 3 | oui | 1 |
| MAT-12 | Chambre maternité 12 | R+1 | E | 2 | 0 | 2 | - | 2 | 4 | 3 | oui | 1 |
| MAT-13 | Chambre maternité 13 | R+1 | E | 2 | 0 | 2 | - | 2 | 4 | 3 | oui | 1 |
| MAT-14 | Chambre maternité 14 | R+1 | E | 2 | 0 | 2 | - | 2 | 4 | 3 | oui | 1 |
| TEC-01 | Local technique fluides & CVC | exterieur | C | 0 | 0 | 0 | - | 4 | 2 | 2 | - | 6 |

> Lecture : pour les locaux à **bandeau de lit (BTDL)** — chambres, box, SSPI, déchocage,
> hôpital de jour, travail, bibonnerie — O₂/Vide/élec. secourue + appel malade + RJ45 sont
> **intégrés à la tête de lit**. Les chambres doubles (MAT-12/13/14, HOS-07) portent **2 jeux**.

---

## 6) CONVENTIONS GRAPHIQUES (à respecter)

- **Fond** : plan architecte (linework noir net) ; surcouches techniques par-dessus.
- **Tracés réseau** : **orthogonaux uniquement** (angles droits), pas de diagonale.
  Tronc principal en trait épais ; antennes en trait moyen ; **pastille de piquage** à chaque dérivation.
- **Calques séparés** : (1) Zones/criticité, (2) Tronc+colonne montante, (3) TD/vannes,
  (4) Prises terminales/repères, (5) Alarmes, (6) Légende/cartouche. (Si format vectoriel : 1 calque par poste.)
- **Couleurs** : CFO/CFA = bleu marine `#003F72` ; Gaz = vert `#00785A` ;
  O₂ = vert `#009646`, Air = bleu `#0087C8`, Vide = gris ardoise `#5F6978`, N₂O/AGSS = violet `#9650A0` ;
  Normal blanc, Secouru rouge `#CD3C3C`, Ondulé vert.
- **Criticité de zone** (aplat translucide léger) : Critique `#D22D2D`, Élevé `#EB8C19`,
  Moyen `#E1C31E`, Faible `#46AA5A`.
- **Symboles** : TGBT/centrale = boîte source ; TD = boîte ; vanne de zone = coffret ;
  alarme = triangle rouge ; colonne montante = symbole d'échelle verticale + flèche niveau.
- **Étiquette par local** : **code local + intitulé** lisibles, + quantités de prises.
- **Cartouche** (coin) : « POLYCLINIQUE NASSIB — FIOG / Djibouti », titre du plan, niveau,
  indice 180526, mention « avant-projet — ne vaut pas plan d'exécution », **flèche Nord**, échelle.

---

## 7) CONTENU OBLIGATOIRE DU LIVRABLE (checklist)

Pour CHAQUE plan :
- [ ] Source au bon endroit (**arrière**, hors enveloppe) + alimentation entrante.
- [ ] Tronc principal le long du **couloir personnel**.
- [ ] **Colonne montante** unique à l'**escalier central** (flèche ↑R+1 / ↓RDC).
- [ ] **Un TD / une vanne de zone** par zone, relié par **antenne orthogonale**.
- [ ] **Criticité** des zones en aplat + libellé.
- [ ] **Prises terminales** par local conformes à la table §5 (plan d'implantation).
- [ ] CFO : repérage **Normal/Secouru/Ondulé** ; **IT médical** sur bloc/SSPI/déchocage/petit chir ;
      liaisons équipotentielles ; alim. dédiées (RX, autoclave, froid).
- [ ] CFA : RJ45, appel malade, vidéo, contrôle d'accès, SSI, report alarmes (calques distincts).
- [ ] Gaz : O₂/Air/Vide par local, coffrets vannes + **alarmes de zone**, N₂O/AGSS **[À CONFIRMER]**.
- [ ] Légende + cartouche + flèche Nord + échelle.
- [ ] Tous les **[À CONFIRMER]** annotés visiblement.

---

## 8) RÉSERVES & HYPOTHÈSES (à faire apparaître)

- **R-02/R-05/R-08** : locaux techniques (TGBT, centrale gaz, groupe, ASI) à l'arrière — emprise à valider.
- **R-03** : gaine technique verticale (escalier central) à réserver sur les 2 niveaux.
- **R-04** : baie informatique (local CFA) à localiser.
- **R-06** : distance source ↔ gros consommateurs à minimiser.
- **R-07** : N₂O + AGSS au bloc selon protocole anesthésique.
- **R-09** : étude SSI (obligation établissement de santé).
- **R-10** : traitement d'air classé bloc/SSPI (surpression, filtration).
- **R-01** : local déchets DASRI / utilités sales-propres à identifier.
- Valeurs CFO/CFA/CVC = **déduites de templates** : à **dimensionner par les BE** (notes de calcul).

---

## 9) FORMAT DE SORTIE ATTENDU

- Idéalement **vectoriel** (SVG ou DXF) avec calques nommés comme au §6 ; sinon image haute
  résolution propre. **A3 paysage**, 1 plan par feuille.
- Échelle cohérente, cotation logique, textes lisibles, **aucun chevauchement** d'étiquettes.
- Si une information manque, écrire **« Information à confirmer »** plutôt que d'inventer.
- Toujours distinguer : **visible sur plan / déduit / proposé / à confirmer**.

**Commence par** : (1) reformuler l'organisation du bâtiment et les points de départ ;
(2) lister les zones et leur criticité ; (3) décrire le cheminement du tronc et de la colonne
montante ; (4) puis produire, niveau par niveau, le plan de principe puis le plan d'implantation,
en respectant strictement la table §5 et les conventions §6.
