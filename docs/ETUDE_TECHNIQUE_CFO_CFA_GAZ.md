# Étude technique de conception — CFO / CFA / Gaz médicaux & Implantation biomédicale
## Projet : Construction d'une Polyclinique à Nassib — Fondation Ismail Omar Guelleh (FIOG), Djibouti
**Lot support :** Architecture (DJI-FU SARL) — Plans RDC `A-01` et R+1 `A-02`, indice 180526
**Statut du document :** Étude de conception technique (avant-projet) — base de travail pour les plans d'exécution
**Destinataires :** Architecte · BE Électricité (CFO/CFA) · BE Fluides médicaux · Entreprise CFO/CFA · Entreprise Gaz médicaux · Équipe biomédicale · Maître d'ouvrage · Équipe chantier

> ⚠️ **Avertissement réglementaire.** Ce document est une étude de conception destinée à préparer les plans d'exécution. Il ne remplace ni une note de calcul officielle, ni une validation réglementaire, ni un avis d'organisme agréé (sécurité électrique hospitalière, gaz médicaux, sécurité incendie ERP/établissement de santé). Toute donnée non visible sur les documents fournis est explicitement signalée.

---

## Convention de lecture des sources

Chaque information est qualifiée par un marqueur :

| Marqueur | Signification |
|---|---|
| 🟩 **[VISIBLE]** | Lu directement sur le plan architectural ou la fiche d'équipement (FIOG) fournis |
| 🟦 **[DÉDUIT]** | Déduit du programme médical, du nom du local ou de l'organisation architecturale |
| 🟨 **[PROPOSÉ]** | Proposition selon les bonnes pratiques hospitalières (à dimensionner par le BE) |
| 🟥 **[À CONFIRMER]** | Donnée manquante ou incertaine — décision MOA / BE / autorité requise |

**Documents analysés :**
1. 🟩 `RDC_POLYCLINIQUE_180526.pdf` — plan architecturé A3, niveau RDC
2. 🟩 `R1_POLYCLINIQUE_180526.pdf` — plan architecturé A3, niveau R+1
3. 🟩 `FIOG_Plan_Equip` (., 2, 3, 4, 5) — fiches d'implantation équipement/prises par local (croquis annotés CFO/CFA/gaz)

---

# A. RAPPORT D'ANALYSE TECHNIQUE GÉNÉRAL

## A.1 — Identification du bâtiment

🟩 **[VISIBLE]** Établissement de santé recevant du public (polyclinique) sur **2 niveaux** : RDC + R+1.
🟩 **[VISIBLE]** Présence d'une **liaison verticale centrale** : 1 ascenseur (`Asc`) + 1 cage d'escalier centrale, et 1 escalier secondaire côté Est (grilles R/S, repère `14`, mention `HAUT`).
🟩 **[VISIBLE]** Le bâtiment est organisé autour de **deux circulations parallèles distinctes**, matérialisées et nommées sur les plans :
- **« COULOIR CIRCULATION ÉQUIPEMENT & PERSONNEL MÉDICAL – PARAMÉDICAL »** (tracé vert) — circulation « propre »/personnel.
- **« COULOIR CIRCULATION FAMILLE – PATIENT »** (tracé bleu) — circulation publique/patient.

🟦 **[DÉDUIT]** Cette double circulation est l'épine dorsale du principe de **séparation des flux** (personnel/logistique vs public/patient). Elle doit être respectée par tous les corps d'état (cheminements techniques, locaux techniques, accès maintenance côté « personnel »).

🟩 **[VISIBLE]** Trame structurelle repérée par files : **A → S** (horizontal) et **1 → 10** (vertical). Les cotes partielles sont portées au plan (ex. travées 3,41 / 4,03 / 3,76 / 3,94 m…).

## A.2 — Zones fonctionnelles identifiées

### Niveau RDC (plan A-01)

| Zone fonctionnelle | Localisation (files) | Locaux repérés 🟩 [VISIBLE] |
|---|---|---|
| **Maternité / Bloc obstétrical** | Aile Ouest (A→D, rangs 1→8) | Pré-travail ×3, Travail ×4, Infirmerie (mat.), Accueil mat., Bloc Césarienne, SAS Bloc Césa, Stérilisation, Vestiaire F |
| **Consultations externes** | Bandeau Sud + Centre (A→M, rangs 1→6) | Bureau ×plusieurs, Bureau CS 1-4, Bureau GYN 1-2, Dentaire, Vestiaire H, Magasin, Pharmacie *(à confirmer position)*, Stock |
| **Imagerie** | Centre-Est (M→N) | Radiologie |
| **Laboratoire** | Nord-Centre (F→G, rang 8) | Laboratoire |
| **Urgences** | Aile Est (P→S, rangs 1→9) | SAS accueil urgences, Box 1, Box 2, Box 3, Box 4, Déchocage, Petit chir, Infirmerie (urg.), Mini-Labo, Bureau URG 1-2, Stock |
| **Accueil / Pôle public** | Centre (G→Q, rangs 1→4) | Salle d'attente, Accueil, Caisse, Admin |
| **Logistique verticale** | Centre (N→Q) | Ascenseur, escalier central, escalier Est |

### Niveau R+1 (plan A-02)

| Zone fonctionnelle | Localisation | Locaux repérés 🟩 [VISIBLE] |
|---|---|---|
| **Hospitalisation Maternité** | Ouest + Centre | Chambre maternité 1 → 14, Bibonnerie & soin bébé |
| **Hospitalisation Médecine** | Est | Chambre Med 1 → 7 (repérées Chambre 1-7) |
| **Hôpital de jour** | Centre | Hospitalisation de jour |
| **Soins étage** | Centre-Est | Infirmerie, Accueil étage |
| **Administration / Direction** | Centre-Sud | Bureau Direction, Bureau adm 1, Bureau adm 2 (open-space), Salle d'attente, Bureaux |

🟥 **[À CONFIRMER]** Le repérage « Chambre 1-7 » côté médecine et « Chambre maternité 1-14 » se recoupe en numérotation : **conserver les codes locaux du plan architecte** (ne pas renuméroter). Demander à l'architecte la table de correspondance officielle code local ↔ nom.

## A.3 — Circuits et flux

🟦 **[DÉDUIT]** à partir de la double circulation nommée et de l'implantation :

| Flux | Principe déduit |
|---|---|
| **Patient ambulatoire** | Entrée publique → Accueil/Caisse → Salle d'attente → Consultations / Imagerie / Labo |
| **Patient urgent** | SAS accueil urgences (entrée dédiée) → Box / Déchocage / Petit chir |
| **Patient maternité** | Accueil mat. → Pré-travail → Travail → (Bloc Césarienne si besoin) → SSPI → Hospitalisation R+1 |
| **Personnel médical** | Couloir vert « personnel », vestiaires H/F, accès locaux de soins par l'arrière |
| **Logistique propre** | Stérilisation, Pharmacie, Magasin, Stock → couloir personnel |
| **Déchets / linge sale** | 🟥 **[À CONFIRMER]** — aucun local « déchets DASRI » ni « local sale » n'est clairement repéré sur les plans fournis (voir réserve R-01) |

## A.4 — Contraintes et observations générales (synthèse, détail en §G)

1. 🟥 Locaux techniques **CFO** (TGBT, TD), **gaz médicaux** (centrale O₂, vide, air) et **baie informatique** : non repérés explicitement sur les plans → à localiser (réserves R-02 à R-05).
2. 🟥 Zone **déchets DASRI / local sale / local propre** : non identifiée (R-01).
3. 🟦 Le **Bloc Césarienne** et la **SSPI/Salle réveil** imposent les exigences électriques et gaz les plus élevées (groupe local à usage médical / IT médical).
4. 🟦 La **production d'oxygène** doit être au plus près des gros consommateurs (Urgences + Bloc + Hospitalisation) tout en respectant les contraintes de sécurité (local dédié, ventilé, accès pompiers/livraison bouteilles secours).
5. 🟩 Présence de cloisons légères : la mention **« Partition en placoplâtre »** figure en légende du R+1 → impact sur fixation des bandeaux de lit, supports muraux lourds et chemins de câbles (R-12).

---

# B. TABLEAU ROOM-BY-ROOM (besoins par local)

> Logique de codification CFO/CFA/gaz reprise **directement des fiches FIOG** lorsqu'une valeur y figure (🟩), complétée par proposition (🟨) sinon.
> Légende criticité électrique : **C** = Critique · **É** = Élevé · **M** = Moyen · **F** = Faible.
> Gaz : **O₂** = oxygène · **Air** = air médical · **V** = vide/aspiration · **N₂O** = protoxyde · **AGSS** = évacuation gaz anesthésiques.

## B.1 — URGENCES (RDC) — fiches FIOG `.` et `2`

| Code/Local | Surf. | Criticité | Équipements biomédicaux | CFO normal | CFO secouru | CFO ondulé | CFA / RJ45 | Appel malade | Gaz médicaux | Plomberie | Ventil. | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Box 1** | 🟥 | É | 2 brancards, 2 moniteurs multiparam., pousse-seringues, aspirateur | 2 PC bas + 6 PC/bandeau (×2 bandeaux) | 🟨 bandeaux sur secouru | 🟨 moniteurs ondulés | 2 PC CFA/bandeau | 🟨 oui | **O₂×2, Air×2, V×2** (1 par bandeau) | point d'eau 🟨 | 🟨 oui | 🟩 FIOG |
| **Box 2** | 🟥 | É | idem Box 1 (2 postes) | 2 PC bas + 6 PC/bandeau ×2 | 🟨 | 🟨 | 2 PC CFA/bandeau | 🟨 oui | O₂×2, Air×2, V×2 | 🟨 | 🟨 | 🟩 FIOG |
| **Box 3** | 🟥 | É | idem (2 postes) | 2 PC bas + 6 PC/bandeau ×2 | 🟨 | 🟨 | 2 PC CFA/bandeau | 🟨 oui | O₂×2, Air×2, V×2 | 🟨 | 🟨 | 🟩 FIOG |
| **Box 4** | 🟥 | É | 1 brancard, 1 moniteur (box simple) | 2 PC bas + 6 PC/bandeau | 🟨 | 🟨 | 2 PC CFA | 🟨 oui | O₂×1, Air×1, V×1 | 🟨 | 🟨 | 🟩 FIOG |
| **Déchocage** | 🟥 | **C** | 2 brancards, 2 moniteurs, 2 ventilateurs/VNI, échographe, chariot urgence | 2 PC bas + **8 PC/bandeau ×2** | 🟨 tout secouru | 🟨 moniteurs+ventil ondulés | 2 PC CFA/bandeau | 🟨 oui + report alarme | **O₂×2, Air×2, V×2** | point d'eau | 🟨 renforcée | 🟩 FIOG |
| **Petit chir** | 🟥 | **C** | table de chirurgie, scialytique, respirateur/anesthésie, moniteur, table instrum., négatoscope mural | **8 PC/bandeau** | 🟨 tout secouru | 🟨 ondulé bistouri/moniteur | 2 PC CFA | 🟨 oui | **O₂×1, Air×1, V×1** + 🟥 AGSS si anesthésie | point d'eau (lavage mains) | 🟨 extraction | 🟩 FIOG |
| **Infirmerie urg.** | 🟥 | É | paillasse soins, 2 ch. soin, 2 guéridons, brancard, chariot urgence | 8 PC bas + 6 PC au-dessus paillasse + 4 PC bas | 🟨 partiel | 🟨 | **4 PC CFA bas** + 2 CFA | 🟨 oui | 🟨 O₂×1, V×1 (poste ch. urg) | évier paillasse | 🟨 | 🟩 FIOG |
| **SAS accueil urg.** | 🟥 | É | 2 brancards, 2 fauteuils roulants | 2 PC bas | 🟨 secouru | — | RJ45 accueil | 🟨 non | **O₂×2 + V×2 secourus** (mention « 2 vide+O₂ secouru ») | — | 🟨 | 🟩 FIOG |
| **Mini-Labo (urg.)** | 🟥 | É | paillasse, analyseurs de paillasse, 3 chaises | 8 PC au-dessus paillasse (×2 murs) + 2 PC bas | 🟨 analyseurs secourus | 🟨 analyseurs ondulés | 🟨 RJ45 ×2 (SIL) | non | 🟨 V possible (analyseur) | évier paillasse | 🟨 | 🟩 FIOG |
| **Bureau URG 1** | 🟥 | M | bureau, poste de saisie | 4 PC bas + 2 PC bas | 🟨 1 PC secourue (poste) | 🟨 poste informatique | **2 PC CFA bas** + RJ45 | non | non | — | — | 🟩 FIOG |
| **Bureau URG 2** | 🟥 | M | bureau, poste de saisie | 4 PC bas + 2 PC bas | 🟨 | 🟨 | 2 PC CFA bas + RJ45 | non | non | — | — | 🟩 FIOG |
| **Stock urg.** | 🟥 | F | rayonnages | 2 PC bas (×2) | — | — | — | non | non | — | 🟨 | 🟩 FIOG |

🟦 **[DÉDUIT]** « 6 prises CFO » sur les bandeaux de lit = prises de la **goulotte / bandeau technique de lit (BTDL)**, intégrant courant fort, courant faible et fluides. « PC bas » = prises murales basses.

## B.2 — CONSULTATIONS / IMAGERIE / LABO (RDC) — fiche FIOG `3`

| Code/Local | Criticité | Équipements | CFO normal | Secouru | Ondulé | CFA/RJ45 | Gaz | Plomb. | Source |
|---|---|---|---|---|---|---|---|---|---|
| **Bureau CS 1** | M | bureau, chaise, rangement | 4 PC bas + 2 PC bas | 🟨 1 poste | 🟨 PC poste | 2 PC CFA + RJ45 | non | 🟨 | 🟩 FIOG |
| **Bureau CS 2** | M | bureau, table CS, paravent, rangement | 4 PC bas + 4 PC | 🟨 | 🟨 | 2 PC CFA + RJ45 | non | 🟨 point d'eau | 🟩 FIOG |
| **Bureau CS 3 (×2)** | M | bureau, table CS, paravent, guéridon | 4 PC bas + 2 PC bas + 4 PC | 🟨 | 🟨 | 2 PC CFA + RJ45 | non | 🟨 | 🟩 FIOG |
| **Bureau CS 4** | M | bureau, table CS, paravent, guéridon | 🟨 idem CS 3 | 🟨 | 🟨 | 2 PC CFA + RJ45 | non | 🟨 | 🟩 FIOG |
| **Bureau GYN 1** | É | **échographe**, bureau, table d'examen gynéco, paravent, guéridon | 4 PC + 4 PC bas + 2 PC bas | 🟨 écho secouru | 🟨 écho ondulé | 2 PC CFA + RJ45 | **O₂×2 + V×2 secourus** (« 2 vide+O₂ secouru ») | point d'eau | 🟩 FIOG |
| **Bureau GYN 2** | É | échographe, bureau, table gynéco, paravent | 🟨 idem GYN 1 | 🟨 | 🟨 | 2 PC CFA + RJ45 | 🟨 O₂×2 + V×2 | point d'eau | 🟩 FIOG |
| **Dentaire** | É | fauteuil dentaire, paillasse dent., RX dentaire mural, guéridon | 4 PC au-dessus paillasse + 4 PC bas + 4 PC | 🟨 fauteuil/RX | 🟨 | **2 PC CFA bas** + RJ45 | 🟨 V (aspiration dentaire — réseau séparé conseillé) | crachoir/eau fauteuil | 🟩 FIOG |
| **Radiologie** | É | table de radiologie / capteur, 🟥 type à confirmer | 🟨 alim. dédiée générateur RX | 🟨 | 🟨 console | 🟨 RJ45 (PACS) | non | 🟨 | 🟦 déduit |
| **Laboratoire** | É→C* | analyseurs (hémato, biochimie…), paillasses, centrifugeuse | 🟨 nombreuses PC paillasse | 🟨 analyseurs secourus | 🟨 SIL/automates ondulés | 🟨 RJ45 (SIL) | 🟨 V possible | éviers, eau osmosée 🟥 | 🟦 déduit |
| **Pharmacie** | É | rayonnages, paillasse, poste, 🟥 enceinte réfrigérée | 4 PC bas + 4 PC bas | 🟨 réfrigérateurs secourus | 🟨 poste | 2 PC CFA + RJ45 | non | 🟨 point d'eau | 🟩 FIOG |
| **Magasin** | F | rayonnages | 2 PC + 4 PC bas (×2) | — | — | 2 PC CFA + RJ45 | non | — | 🟩 FIOG |
| **Vestiaire H / F** | F | vestiaires, bancs | 2 PC bas | — | — | — | non | 🟨 sanitaires/douches | 🟩 FIOG |

\* 🟥 **[À CONFIRMER]** Criticité du Laboratoire : « É » en routine, mais certains automates (transfusion, gaz du sang) peuvent exiger une **alimentation secourue/ondulée critique**. À arbitrer selon liste d'analyseurs définitive.

## B.3 — MATERNITÉ / BLOC OBSTÉTRICAL (RDC) — fiche FIOG `4`

| Code/Local | Criticité | Équipements | CFO/Secouru/Ondulé | CFA | Gaz médicaux | Plomb. | Ventil. | Source |
|---|---|---|---|---|---|---|---|---|
| **Pré-travail (×3)** | É | échographe, cardiotocographe (toco), tensiomètre, table d'examen, guéridon | 🟨 6-8 PC bas, écho+toco secourus | RJ45 + appel malade | 🟨 **O₂×1, Air×1, V×1** (bandeau) | point d'eau | 🟨 | 🟩 FIOG + déduit |
| **Travail (×4)** | É | table d'accouchement, cardiotocographe, moniteur, guéridon | 🟨 8 PC, table+monito secourus | RJ45 + appel malade/urgence | **O₂×1, Air×1, V×1** + 🟥 N₂O/MEOPA si analgésie | point d'eau + évacuation | 🟨 renforcée | 🟩 FIOG + déduit |
| **Bloc Césarienne** | **C** | table de chirurgie, scialytique, respirateur d'anesthésie, moniteur, table instrum., négatoscope | 🟨 ≥8 PC sur **IT médical**, tout secouru+ondulé, panneau de tête de bloc | RJ45 + report alarmes + interphonie | **O₂, Air, V, N₂O, AGSS** (prises plafonnières/bras ou bandeau) | lavage chirurgical | **traitement d'air classé (surpression)** 🟥 | 🟩 FIOG + déduit |
| **SAS Bloc Césa** | É | sas habillage/transfert | 🟨 PC entretien | contrôle d'accès | non | 🟨 | sas surpression | 🟩 visible |
| **Salle de réveil / SSPI** | **C** | 2 brancards, 2 moniteurs, respirateur, chariot urgence | 🟨 PC secouru/ondulé par poste, panneaux de tête | RJ45 + report alarme + appel urgence | **O₂×2, Air×2, V×2** (1 jeu/poste, mini 2 postes) | point d'eau | 🟨 renforcée | 🟩 FIOG |
| **Stérilisation** | É | autoclave(s), laveur-désinfecteur, paillasses zone sale/propre | 🟨 **alim. force dédiée autoclave (triphasé)** + PC paillasses, secouru partiel | RJ45 + supervision cycle | 🟨 air comprimé techn., 🟥 vapeur/eau adoucie | eau traitée, évacuation, vapeur 🟥 | extraction + surpression propre | 🟦 déduit |
| **Infirmerie mat.** | É | paillasse, brancard, guéridons, poste ch. urg. | 🟨 PC paillasse + bas | RJ45 + appel malade | 🟨 O₂×1, V×1 (poste urgence) | évier | 🟨 | 🟩 FIOG |
| **Accueil mat.** | M | banque accueil | 🟨 PC + poste | RJ45 + interphonie | non | — | — | 🟩 visible |
| **Bureau Mat 1 / 2** | M | bureau(x), chaise(s), rangement | 🟨 4 PC bas + poste | 2 PC CFA + RJ45 | non | — | — | 🟩 FIOG |

🟥 **[À CONFIRMER]** Statut anesthésique du **Bloc Césarienne** : présence ou non de N₂O et d'évacuation des gaz anesthésiques (AGSS). Si anesthésie générale/rachianesthésie avec gaz → N₂O + AGSS obligatoires ; sinon réseau réduit. Décision anesthésiste + MOA.

## B.4 — HOSPITALISATION & ADMINISTRATION (R+1) — fiche FIOG `5`

| Code/Local | Criticité | Équipements | CFO/Secouru | CFA | Gaz médicaux | Plomb. | Source |
|---|---|---|---|---|---|---|---|
| **Chambre maternité 1-8** | É | lit + bandeau BTDL, table à manger, fauteuil | 🟨 6 PC tête de lit (n+secouru), TV | RJ45 + TV + **appel malade** | 🟨 **O₂×1, V×1** (bandeau) | 🟥 WC selon plan | 🟩 FIOG |
| **Chambre maternité 9, 10, 11** | É | idem + WC privatif | 🟨 idem | RJ45 + TV + appel malade + appel WC | O₂×1, V×1 | WC/douche | 🟩 FIOG |
| **Chambre maternité 12, 13, 14 (doubles)** | É | 2 lits + 2 bandeaux, WC | 🟨 6 PC ×2 têtes | RJ45 + TV + appel malade ×2 | **O₂×2, V×2** | WC/douche | 🟩 FIOG |
| **Chambre Med 1-7** | É | lit + bandeau BTDL, table, fauteuil, chevet | 🟨 6 PC tête de lit | RJ45 + TV + appel malade | 🟨 O₂×1, V×1 | 🟥 WC selon plan | 🟩 FIOG |
| **Bibonnerie & soin bébé** | É | berceaux ×6, paillasses ×3, table de soin, présentoir | 🟨 PC nombreuses bas + paillasse, secouru chauffage bébé | RJ45 + appel | 🟨 **O₂×1, Air×1, V×1** (réa bébé légère) | éviers, eau chaude | 🟩 FIOG |
| **Hospitalisation de jour** | É | 4-5 brancards, paravent | 🟨 PC par poste + bas | RJ45 + appel malade ×postes | 🟨 **O₂ + V** par poste | WC | 🟩 FIOG |
| **Infirmerie étage** | É | paillasse, poste de soins, chariot urgence | 🟨 PC paillasse + poste | **PC central appel malade** + RJ45 | 🟨 O₂×1, V×1 | évier | 🟩 visible |
| **Bureau Direction** | F | bureau direction | 🟨 PC + poste | RJ45 + tél. + visio | non | — | 🟩 visible |
| **Bureau adm 1** | F | bureau, chaises | 🟨 PC + poste | RJ45 + tél. | non | — | 🟩 FIOG |
| **Bureau adm 2 (open-space)** | F | 6 postes bureautiques | 🟨 PC ×poste (nourrice/perimétrique) | **RJ45 ×2/poste** + tél. | non | — | 🟩 FIOG |
| **Salle d'attente (étage)** | F | sièges | 🟨 PC entretien | RJ45 borne + affichage | non | — | 🟩 visible |
| **Accueil étage** | M | banque | 🟨 PC + poste | RJ45 + interphonie | non | — | 🟩 visible |

---

# C. PROPOSITION DE PLAN CFO (courant fort)

## C.1 — Classement des locaux par criticité électrique

🟨 **[PROPOSÉ]** (à valider par BE Électricité + référentiel sécurité électrique hospitalière) :

| Classe | Locaux (regime à prévoir) |
|---|---|
| **CRITIQUE — IT médical (transfo d'isolement) + secours + ondulé** | Bloc Césarienne, Salle de réveil/SSPI, Déchocage, Petit chir |
| **CRITIQUE technique** | Local production O₂, centrale vide, centrale air médical, TGBT, local onduleurs, local groupe |
| **ÉLEVÉ — secouru groupe + ondulé partiel** | Radiologie, Laboratoire, Mini-Labo, Stérilisation, Pharmacie, Pré-travail, Travail, toutes Chambres d'hospitalisation, Bibonnerie, Hôpital de jour, Infirmeries, Bureau GYN, Dentaire |
| **MOYEN — normal + 1 départ secouru ponctuel** | Consultations (Bureau CS), Bureaux médicaux, Accueils, Bureaux URG/Mat |
| **FAIBLE — normal** | Administration, Salles d'attente, Vestiaires, Magasin, Stock |

## C.2 — Principe des trois réseaux

🟨 **[PROPOSÉ]** Distinction terminale par **repérage couleur des prises** (à figer en CCTP) :

| Réseau | Repère proposé | Origine | Locaux desservis |
|---|---|---|---|
| **Normal (NR)** | blanc | TGBT / réseau ville | Tous locaux |
| **Secouru (SEC)** | rouge/orange | Groupe électrogène (bascule < 15 s) | Locaux É et C, éclairages de sécurité, ascenseur prioritaire |
| **Ondulé (OND)** | vert | Onduleur (ASI) | Postes critiques : moniteurs, respirateurs, analyseurs, SIL/PACS, baie informatique, têtes de bloc |

## C.3 — Architecture de distribution (schéma de principe textuel)

```
 Réseau ville (Édéle/STEG-équiv. 🟥 fournisseur à confirmer)
        │
   ┌────┴─────┐
   │  TGBT    │◄──── Groupe électrogène (secours) ──┐
   │ (RDC,    │                                      │ inverseur
   │ local    │◄──── Onduleur central (ASI)          │ de source
   │ tech.)   │                                      │ automatique
   └────┬─────┘
        │ colonnes montantes (gaine technique verticale 🟥 à localiser)
        │
 ┌──────┼───────────────┬────────────────┬───────────────┐
 │      │               │                │               │
TD-URG  TD-MAT/BLOC   TD-CONSULT/IMG   TD-LABO/PHARMA   TD-GÉN.SERVICES
(box,   (pré-trav,    (CS, GYN,        (labo, mini-     (admin, attente,
décho,  travail,      dentaire,        labo, pharma,    accueil, VRD,
p.chir) bloc césa,    radio)           stéril.)         CVC, ascenseur)
        SSPI, stéril)
        │
        ├─ TD-IT-BLOC (transfo isolement bloc + SSPI)
        └─ TD-IT-URG  (transfo isolement déchocage + petit chir)

 R+1 : TD-HOSPI-MAT · TD-HOSPI-MED · TD-HJ/INFIRMERIE · TD-ADMIN
```

🟨 **[PROPOSÉ]** Tableaux divisionnaires (TD) **par zone fonctionnelle et par niveau**, alimentés depuis le TGBT par colonnes montantes en gaine technique dédiée. Chaque TD intègre ses départs Normal/Secouru/Ondulé.

## C.4 — Prescriptions CFO par zone (synthèse opérationnelle)

| Zone | Régime électrique | Alim. dédiées (force) | Points de vigilance |
|---|---|---|---|
| **Bloc Césarienne + SSPI** | **IT médical** + secours + ondulé | scialytique, table op., respirateur | Contrôleur permanent d'isolement (CPI) + report d'alarme ; liaison équipotentielle de la salle ; pas de coupure tolérée en per-opératoire |
| **Déchocage / Petit chir** | IT médical (recommandé) + secours + ondulé | bistouri/respirateur | Idem bloc, niveau légèrement réduit selon usage réel |
| **Radiologie** | Normal + secouru | **départ générateur RX dédié** (appel de courant élevé) | Sélectivité ; chute de tension générateur ; mise à la terre capteur |
| **Stérilisation** | Normal + secouru partiel | **autoclave triphasé dédié**, laveur | Forte puissance ; protection thermique ; coordination vapeur/eau |
| **Laboratoire / Mini-Labo** | Secouru + ondulé (analyseurs) | analyseurs, réfrigérateurs | Onduler le SIL et les automates sensibles ; froid secouru |
| **Pharmacie** | Normal + secouru (froid) | **enceintes réfrigérées médicaments** | Froid sur secours + report alarme température |
| **Chambres / Hospi** | Normal + secouru (têtes de lit) | bandeau de lit BTDL | 1 PC secourue mini par tête de lit ; appel malade indépendant |
| **Locaux techniques fluides** | Secouru prioritaire | compresseurs air, pompes à vide, station O₂ | **Alim. prioritaire absolue** (continuité des fluides vitaux) |

## C.5 — Besoins en source de remplacement

🟨 **[PROPOSÉ]** / 🟥 **[À CONFIRMER]** dimensionnement :
- **Groupe électrogène** : nécessaire (établissement de santé avec actes à risque vital). Puissance à calculer sur bilan de puissance secourue (R-08).
- **Onduleur(s)** : 1 ASI centrale pour informatique + un onduleur dédié par salle critique (bloc, SSPI, déchocage) pour autonomie locale (recommandé).
- **Mise à la terre** : réseau de terre général + **liaisons équipotentielles supplémentaires** dans tous les locaux à usage médical du groupe 2 (bloc, SSPI, déchocage, petit chir).

## C.6 — Liste des points à dessiner sur le plan CFO (pour le BE)

1. Implantation TGBT + local onduleurs + local groupe (à localiser, R-02/R-08).
2. Position de chaque TD de zone + colonnes montantes.
3. Repérage des prises NR/SEC/OND par local (couleurs).
4. Bandeaux de lit (BTDL) avec décompte de prises par fiche FIOG.
5. Alimentations force dédiées : RX, autoclave, échographes, têtes de bloc.
6. Transformateurs d'isolement + CPI des salles IT médical.
7. Liaisons équipotentielles des salles du groupe 2.
8. Éclairage de sécurité (BAES) et éclairage des locaux critiques sur 2 sources.

---

# D. PROPOSITION DE PLAN CFA (courant faible)

## D.1 — Réseaux CFA à prévoir

🟨 **[PROPOSÉ]**, sur base des prises CFA repérées dans les FIOG (🟩) :

| Système CFA | Périmètre | Origine |
|---|---|---|
| **Réseau informatique (VDI/RJ45)** | Tous bureaux, accueils, soins, labo, pharmacie, postes | Baie de brassage (local technique CFA, R-04) |
| **Téléphonie / DECT** | Accueils, bureaux, postes de soins, couverture étages | Baie / IPBX |
| **Wi-Fi** | Couverture générale (séparation réseaux médical / invité) | Bornes plafonnières |
| **Appel malade / appel d'urgence sanitaire** | Toutes chambres, hôpital de jour, SSPI, box urgences, sanitaires patients | Centrale appel malade + report poste infirmier |
| **Vidéosurveillance (CCTV)** | Entrées, accueils, SAS urgences, circulations, pharmacie, stock, attente | Enregistreur (NVR) en local CFA |
| **Contrôle d'accès** | Bloc, SSPI, pharmacie, stérilisation, locaux techniques, vestiaires, accès personnel | Centrale contrôle d'accès |
| **Interphonie** | SAS Bloc, SAS urgences, accès personnel, livraisons | — |
| **Détection incendie (SSI)** | Bâtiment complet (ERP/établissement de santé) | Centrale SSI (obligatoire — R-09) |
| **Report d'alarmes techniques** | Gaz médicaux (alarmes de zone/centrale), froid pharma/labo, groupe, onduleur, surpression bloc | Supervision technique (GTB/GTC) |
| **Sonorisation / appel général** | 🟥 selon choix MOA (évacuation, recherche de personne) | — |

## D.2 — Prescriptions CFA par local (extrait — détail au §B)

| Local | RJ45 | Appel malade | Vidéo | Contrôle d'accès | Observations |
|---|---|---|---|---|---|
| Chambres (toutes) | 1-2 | **Oui** (+ tirette WC) | Non (confidentialité) | Non | Confidentialité patient |
| SSPI / Déchocage / Box | 1-2 | Oui + appel urgence | 🟥 selon politique | Non | Report alarmes vitales |
| Bloc Césarienne | 2 | Appel urgence + interphonie | Non (champ opératoire) | **Oui** | Accès restreint |
| Pharmacie | 2 | Non | **Oui** | **Oui** | Stupéfiants — sûreté renforcée |
| Stérilisation | 1-2 | Non | 🟥 | Oui | Supervision cycles |
| Labo / Mini-Labo | 2 (SIL) | Non | 🟥 | Oui | Liaison automates |
| Bureaux / Admin | 1-2/poste | Non | Non | 🟥 | Open-space : 2 RJ45/poste |
| Accueils / Caisse | 2 | Non | **Oui** | — | Caisse : sûreté + bouton d'alerte 🟨 |
| SAS urgences / entrées | — | — | **Oui** | Interphonie | Flux non maîtrisé |

## D.3 — Infrastructure & séparation CFO/CFA

🟨 **[PROPOSÉ]** :
- **Baie informatique principale** en local CFA dédié (climatisé, secouru/ondulé) — à localiser (R-04). Sous-répartiteurs de brassage par niveau si distances > 90 m.
- **Chemins de câbles CFA séparés des CFO** (distance réglementaire / séparation physique), croisements à 90°.
- Détection incendie et appel malade sur **câblage et alimentation indépendants** (sécurité).
- GTB/GTC pour centraliser : alarmes gaz médicaux, froid sensible, groupe, onduleur, CVC bloc.

## D.4 — Points à dessiner sur le plan CFA

1. Position baie principale + sous-répartiteurs par niveau + colonnes CFA.
2. Prises RJ45 par local (décompte FIOG).
3. Terminaux appel malade (tête de lit + tirette WC + report couloir + poste infirmier).
4. Caméras + matrice de couverture.
5. Lecteurs de contrôle d'accès (bloc, pharma, stéril, technique).
6. Détecteurs SSI + diffuseurs + déclencheurs manuels.
7. Renvois d'alarmes gaz médicaux vers postes de soins (alarmes de zone) et supervision.

---

# E. PROPOSITION DE PLAN GAZ MÉDICAUX

## E.1 — Inventaire des gaz nécessaires (déduit du programme + FIOG)

| Gaz | Justification médicale | Zones desservies |
|---|---|---|
| **Oxygène (O₂)** | Soins respiratoires, urgences, bloc, hospitalisation, néonat | Urgences, Bloc, SSPI, Maternité (travail/pré-travail), Hospitalisation, Hôpital de jour, Bibonnerie, GYN, SAS urgences |
| **Vide / aspiration (V)** | Aspiration trachéo-bronchique, drainage, chirurgie | Mêmes zones que O₂ + bloc/dentaire |
| **Air médical (Air 5 bar)** | Ventilation/respirateurs, nébulisation, néonat | Déchocage, Petit chir, Bloc, SSPI, Travail, box urgences, Bibonnerie |
| **Protoxyde d'azote (N₂O) / MEOPA** | 🟥 Analgésie obstétricale / anesthésie césarienne — **uniquement si retenu** | Bloc Césarienne, éventuellement Travail (MEOPA) |
| **AGSS (évacuation gaz anesth.)** | 🟥 Obligatoire **si** anesthésie par gaz au bloc | Bloc Césarienne (+ Petit chir si anesthésie) |
| **Air moteur 8 bar / Azote chir.** | 🟥 Généralement non requis ici (pas d'orthopédie lourde repérée) | — |

🟦 **[DÉDUIT]** Les bandeaux d'urgence FIOG portent systématiquement « 1 O₂, 1 Air, 1 Aspiration » → triplet O₂/Air/Vide confirmé pour les box.

## E.2 — Décompte des prises terminales par local (depuis FIOG 🟩 + déduction 🟨)

| Local | O₂ | Air | Vide | N₂O | AGSS | Position recommandée |
|---|---|---|---|---|---|---|
| Box 1 / 2 / 3 | 2 | 2 | 2 | – | – | bandeau tête de lit, ×2 postes |
| Box 4 | 1 | 1 | 1 | – | – | bandeau tête de lit |
| Déchocage | 2 | 2 | 2 | – | – | bandeaux ×2, hauteur 1,40 m |
| Petit chir | 1 | 1 | 1 | – | 🟥 | bras/bandeau + AGSS si anesth. |
| SAS accueil urg. | 2 | – | 2 | – | – | mural bas, **secouru** |
| Infirmerie urg. | 1 | – | 1 | – | – | poste ch. urgence |
| Pré-travail (×3) | 1 | 1 | 1 | – | – | bandeau tête de lit |
| Travail (×4) | 1 | 1 | 1 | 🟥 (MEOPA) | – | bandeau table accouchement |
| **Bloc Césarienne** | 2 | 2 | 2 | 🟥 1 | 🟥 1 | bras plafonnier / panneau de tête |
| **SSPI / réveil** | 2 | 2 | 2 | – | – | 1 jeu / poste (≥2 postes) |
| Bibonnerie/néonat | 1 | 1 | 1 | – | – | mural plan de soin bébé |
| Chambres simples | 1 | – | 1 | – | – | bandeau tête de lit |
| Chambres doubles | 2 | – | 2 | – | – | 1 jeu / lit |
| Hôpital de jour | 1/poste | – | 1/poste | – | – | mural / bandeau par poste |
| Bureau GYN 1 / 2 | 2 | – | 2 | – | – | mural, **secouru** (« 2 vide+O₂ secouru ») |

> 🟨 **Principe anti-suréquipement appliqué** : aucun gaz dans les bureaux administratifs, vestiaires, magasin, stock, salles d'attente, accueil, Bureau CS standard, Dentaire (sauf aspiration dentaire = réseau dédié, **pas** le vide médical central).

## E.3 — Schéma de distribution (principe textuel)

```
 SOURCES (local technique gaz médicaux dédié, ventilé, R-05) :
 ┌──────────────────────────────────────────────────────────┐
 │ O₂  : production (PSA/concentrateur central) 🟥           │
 │       + SECOURS bouteilles (rampe inverseuse) + cuve 🟥  │
 │ Vide: centrale de pompes à vide (≥2 pompes redondées)    │
 │ Air : centrale compresseurs air médical (≥2) + sécheurs  │
 │ N₂O : cadre bouteilles 🟥 (si retenu, près du bloc)      │
 │ AGSS: pompes d'évacuation 🟥 (si anesthésie gaz)         │
 └───────────────┬──────────────────────────────────────────┘
                 │ réseau primaire (cuivre médical)
                 │ ┌── ALARME CENTRALE (local technique + report supervision)
                 │
        COLONNE MONTANTE (gaine technique verticale, R-03)
                 │
   ┌─────────────┼──────────────┬───────────────┬──────────────┐
 Vanne+Alarme  Vanne+Alarme   Vanne+Alarme    Vanne+Alarme   Vanne+Alarme
 ZONE URGENCES ZONE BLOC/SSPI ZONE MATERNITÉ  ZONE HOSPI R+1  ZONE HJ/CONSULT
 (coffret de   (coffret +     (pré-trav,      (chambres,      (GYN, hôpital
  sectionnement N₂O/AGSS si    travail)        infirmerie)     de jour)
  + alarme de   bloc)
  zone)
                 │
            Prises terminales (O₂/Air/Vide) à chaque poste
```

## E.4 — Tableau par zone (gaz)

| Zone | Gaz desservis | Vanne de sectionnement | Alarme de zone | Criticité |
|---|---|---|---|---|
| Urgences | O₂, Air, Vide | 1 coffret en entrée de zone | Oui (poste infirmier) | Critique |
| Bloc Césa + SSPI | O₂, Air, Vide (+N₂O/AGSS 🟥) | 1 coffret dédié bloc | Oui (panneau bloc) | Critique |
| Maternité (pré-trav/travail) | O₂, Air, Vide | 1 coffret | Oui | Élevé |
| Hospitalisation R+1 | O₂, Vide | 1 coffret/aile | Oui (infirmerie) | Élevé |
| Hôpital de jour / Consult. GYN | O₂, Vide | 1 coffret | Oui | Élevé |

## E.5 — Prescriptions de sécurité et maintenance (gaz)

🟨 **[PROPOSÉ]** / 🟥 **[À CONFIRMER par BE fluides]** :
- **Source O₂ triple** : production + secours + réserve (continuité réglementaire). Local dédié ventilé, accès livraison/secours bouteilles, signalétique ATEX/comburant.
- **Vannes de sectionnement de zone** accessibles aux soignants (isoler une zone sans couper le reste).
- **Alarmes de zone** (pression haute/basse) reportées aux postes de soins + **alarme centrale** en local technique et en supervision GTB.
- **Centrales vide et air redondées** (≥2 unités, démarrage automatique sur défaut), sur **alimentation électrique secourue prioritaire**.
- Distance source ↔ locaux desservis à **minimiser** (pertes de charge / réactivité) — voir réserve R-06.
- Réception : essais d'étanchéité, de non-inversion (cross-connection test), de débit/pression avant mise en service.

## E.6 — Points à dessiner sur le plan gaz médicaux

1. Local technique gaz (sources O₂/vide/air, + N₂O/AGSS si retenus) + ventilation.
2. Tracé réseau primaire + colonne(s) montante(s).
3. Coffrets de vannes de zone + alarmes de zone (position).
4. Alarme centrale + reports supervision.
5. Prises terminales par local (type + nombre, §E.2).
6. Bandeaux de lit / bras / panneaux de tête (bloc, SSPI).

---

# F. LISTE DES ÉQUIPEMENTS BIOMÉDICAUX PAR LOCAL (générique, sans marque)

🟩 **[VISIBLE sur FIOG]** sauf mention 🟨.

| Local | Équipements biomédicaux principaux |
|---|---|
| Box 1/2/3 | 2 moniteurs multiparamétriques, 2 brancards, pousse-seringues, aspirateur de mucosités, chariot de soin |
| Box 4 | 1 moniteur multiparamétrique, 1 brancard, pousse-seringues, aspirateur, chariot |
| Déchocage | 2 moniteurs, 2 ventilateurs / VNI, 1 échographe, chariot d'urgence, 2 brancards |
| Petit chir | table de chirurgie, scialytique, respirateur/anesthésie, moniteur, table d'instruments, négatoscope |
| Infirmerie (urg./mat./étage) | paillasse de soins, chariot d'urgence, guéridons, tensiomètre 🟨 |
| Mini-Labo | analyseurs de paillasse 🟨, centrifugeuse 🟨 |
| Bureau GYN 1/2 | échographe, table d'examen gynécologique |
| Pré-travail | échographe, cardiotocographe (toco), tensiomètre, table d'examen |
| Travail | table d'accouchement, cardiotocographe, moniteur |
| Bloc Césarienne | table de chirurgie, scialytique, respirateur d'anesthésie, moniteur, table d'instruments, négatoscope |
| Salle de réveil / SSPI | 2 moniteurs, 1 respirateur, 2 brancards, chariot d'urgence |
| Stérilisation | autoclave(s) 🟨, laveur-désinfecteur 🟨 |
| Radiologie | ensemble de radiologie / capteur 🟨 (type à confirmer) |
| Dentaire | fauteuil dentaire, radiographie dentaire |
| Bibonnerie/néonat | berceaux, table de soin bébé, 🟨 table chauffante |
| Chambres / Hôpital de jour | bandeau de lit BTDL (O₂/vide/élec.), 🟨 pousse-seringue mobile |
| Pharmacie | 🟨 enceintes réfrigérées médicaments |

---

# G. LISTE DES INCOHÉRENCES ET RISQUES (avec criticité)

| N° | Zone | Discipline | Problème / Incertitude | Impact | Criticité | Correction proposée |
|---|---|---|---|---|---|---|
| R-01 | Bâtiment | Archi/Hygiène | Aucun **local déchets DASRI / local sale / local propre** clairement repéré | Non-respect séparation propre/sale, non-conformité hygiène | **Élevée** | Identifier/créer locaux déchets + utilités sales par niveau |
| R-02 | RDC | CFO | **TGBT / local électrique** non localisé sur plans | Impossibilité de figer colonnes montantes | **Élevée** | MOA/archi : réserver local technique électrique (ventilé, accès direct) |
| R-03 | Bâtiment | Tous fluides | **Gaine technique verticale** (colonnes CFO/CFA/gaz/CVC) non repérée | Pas de cheminement R+1↔RDC | **Élevée** | Réserver gaine(s) alignée(s) sur les 2 niveaux |
| R-04 | RDC | CFA | **Baie informatique / local CFA** non localisé | Pas de point de brassage | Moyenne | Réserver local CFA climatisé/secouru |
| R-05 | Ext./RDC | Gaz médicaux | **Local technique gaz** (sources O₂/vide/air) non repéré | Pas de source fluides | **Élevée** | Réserver local dédié ventilé + aire livraison bouteilles |
| R-06 | Bloc/Urg | Gaz | Distance **production O₂ ↔ gros consommateurs** inconnue | Pertes de charge, réactivité | Moyenne | Positionner source au plus près urgences/bloc |
| R-07 | Bloc Césa | Gaz/Anesth | Présence **N₂O + AGSS** non tranchée | Sur/sous-équipement gaz et CVC | **Élevée** | Décision anesthésiste + MOA |
| R-08 | Bâtiment | CFO | **Groupe électrogène + onduleurs** non implantés ; puissances non calculées | Pas de continuité électrique | **Élevée** | Bilan de puissance + implantation local groupe |
| R-09 | Bâtiment | CFA/Sécurité | **SSI (détection incendie)** à confirmer (obligation ERP/santé) | Non-conformité sécurité | **Élevée** | Étude SSI dédiée |
| R-10 | Bloc/SSPI | CVC | **Traitement d'air classé** (surpression, filtration) non figuré | Risque infectieux | **Élevée** | Étude CVC salle propre |
| R-11 | Stérilisation | Plomb./CVC | Besoins **vapeur / eau adoucie / extraction** non précisés | Autoclave inopérant | Moyenne | Étude utilités stérilisation |
| R-12 | R+1 | CFO/Biomed | **Cloisons placoplâtre** (légende plan) | Fixation bandeaux de lit / supports lourds | Moyenne | Renforts (rails/contreplaqué) aux têtes de lit |
| R-13 | RDC | Archi | Doublons de noms « Bureau » et numérotation chambres ambiguë | Erreurs de repérage exécution | Faible | Figer codes locaux officiels (architecte) |
| R-14 | Labo | CFO | Criticité analyseurs (secouru/ondulé) indéterminée | Perte d'échantillons/résultats | Moyenne | Liste automates → arbitrage alim. |
| R-15 | Pharmacie | CFA | Sûreté stupéfiants (accès + vidéo) à valider | Conformité réglementaire | Moyenne | Contrôle d'accès + CCTV pharmacie |

---

# H. PLAN D'ACTION CHANTIER (par corps d'état)

🟨 **[PROPOSÉ]** — séquençage logique :

| Phase | Architecture | Électricité CFO | CFA | Gaz médicaux | CVC | Plomberie | Biomédical |
|---|---|---|---|---|---|---|---|
| **0 — Études** | Figer codes locaux + locaux techniques (R-01→R-05) | Bilan puissance, schéma unifilaire, IT médical | Architecture VDI/SSI/appel malade | Note de calcul débits/pressions, choix N₂O/AGSS | Calcul air neuf bloc/SSPI | Réseaux EF/EC/EU/EV | Liste équipements + fiches techniques |
| **1 — Gros œuvre / réservations** | Réservations gaines/locaux | Fourreaux, gaines, attentes TGBT | Fourreaux CFA séparés | Réservations colonne gaz | Réservations gaines CVC | Attentes EU/EV | Réservations supports lourds |
| **2 — Second œuvre / réseaux** | Cloisons (renforts R-12) | Colonnes, TD, chemins de câbles | Chemins CFA, baie | Réseau primaire + colonnes + vannes | Gaines, CTA | Réseaux + évacuations | Pré-implantation bandeaux |
| **3 — Équipements** | Faux-plafonds | Appareillage, IT médical, groupe, ASI | Brassage, caméras, appel malade, SSI | Sources, prises terminales, alarmes | CTA bloc/SSPI | Appareils sanitaires | Pose équipements + bandeaux |
| **4 — Essais** | — | Essais diélectriques, sélectivité, bascule groupe | Recette VDI, essais SSI/appel malade | Essais étanchéité + non-inversion + débit | Équilibrage, classe particulaire | Essais pression/étanchéité | Qualifications biomédicales |
| **5 — Réception** | Levée réserves | PV conformité électrique | PV CFA | Certificat gaz médicaux | PV CVC | PV plomberie | Mise en service + formation |

---

# I. CHECKLIST AVANT EXÉCUTION

🟨 **[PROPOSÉ]** — à solder avant lancement travaux :

- [ ] Codes locaux et surfaces officiels figés par l'architecte (R-13)
- [ ] Locaux techniques réservés : TGBT, onduleurs, groupe, baie CFA, **gaz médicaux** (R-02/R-04/R-05/R-08)
- [ ] Gaine(s) technique(s) verticale(s) RDC↔R+1 validée(s) (R-03)
- [ ] Local déchets DASRI / utilités sales-propres défini (R-01)
- [ ] Décision N₂O / AGSS au Bloc Césarienne (R-07)
- [ ] Bilan de puissance + dimensionnement groupe + ASI validés (R-08)
- [ ] Schéma unifilaire + zones IT médical (groupe 2) validés
- [ ] Note de calcul gaz médicaux (débits/pressions/diamètres) validée
- [ ] Étude CVC salles propres (bloc/SSPI) + classe d'air (R-10)
- [ ] Étude SSI validée par organisme (R-09)
- [ ] Liste définitive des équipements biomédicaux + fiches techniques (puissances, fluides, BTU/froid)
- [ ] Renforts de cloisons pour bandeaux/supports lourds positionnés (R-12)
- [ ] Repérage prises NR/SEC/OND + types de gaz validés local par local

# J. CHECKLIST AVANT RÉCEPTION (mise en service)

🟨 **[PROPOSÉ]** :

**Électricité CFO**
- [ ] Essais diélectriques et de continuité de terre
- [ ] Mesure des liaisons équipotentielles (salles groupe 2)
- [ ] Essai de bascule groupe électrogène (temps de reprise)
- [ ] Essai d'autonomie et de bascule onduleurs
- [ ] Contrôle des CPI (contrôleurs permanents d'isolement) + report d'alarme
- [ ] Sélectivité des protections vérifiée

**CFA**
- [ ] Recette VDI (certification des liens RJ45)
- [ ] Essai SSI complet (détection, asservissements, évacuation)
- [ ] Essai appel malade (chambres, WC, report poste, déclenchement urgence)
- [ ] Test vidéosurveillance + contrôle d'accès
- [ ] Remontée des alarmes (gaz, froid, groupe, onduleur) sur supervision

**Gaz médicaux**
- [ ] Essai d'étanchéité du réseau
- [ ] **Test de non-inversion des gaz** (cross-connection) à chaque prise terminale
- [ ] Vérification débit/pression à la prise la plus défavorable
- [ ] Essai des vannes de zone et alarmes de zone/centrale
- [ ] Vérification source + secours + réserve O₂ (bascule)
- [ ] Certificat de conformité gaz médicaux émis

**CVC / Plomberie / Biomédical**
- [ ] Équilibrage aéraulique + classe particulaire bloc/SSPI (R-10)
- [ ] Essais pression/étanchéité réseaux d'eau
- [ ] Qualifications biomédicales (OQ/PQ) des équipements critiques (autoclave, RX, moniteurs)
- [ ] Formation utilisateurs + dossier d'exploitation/maintenance (DOE) remis

---

## Synthèse des points bloquants prioritaires (à trancher en premier)

1. **Localiser les locaux techniques manquants** (électrique, gaz, CFA) et la **gaine verticale** — sans cela, ni CFO ni gaz ni CFA ne peuvent être tracés (R-02/03/04/05).
2. **Trancher le profil anesthésique du Bloc Césarienne** (N₂O/AGSS + CVC classée) — impacte gaz, CVC et électricité (R-07/R-10).
3. **Définir la gestion des déchets/utilités sales** — conformité hygiène (R-01).
4. **Bilan de puissance + sources de secours** (groupe + onduleurs) (R-08).

> Ce document constitue la **base de conception**. Les quantités de prises issues des fiches FIOG sont reprises fidèlement ; toutes les valeurs marquées 🟨/🟥 doivent être confirmées et dimensionnées par les bureaux d'études compétents avant établissement des plans d'exécution.
