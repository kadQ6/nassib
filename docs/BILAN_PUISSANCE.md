# Bilan de puissance prévisionnel — Polyclinique Nassib (FIOG)

> **Avant-projet.** Bilan estimatif établi à partir des charges par local (76 locaux) et
> d'hypothèses unitaires (voir feuille « Hypothèses » du classeur). **À recalculer par le
> bureau d'études électricité** (note de calcul) avec la liste d'équipements définitive.
> Départ : TGBT au local technique extérieur arrière ; colonne montante à l'escalier central.

## Synthèse

| Grandeur | Valeur | Commentaire |
|---|---|---|
| Puissance installée (Pi) | **477 kW** | somme des charges installées |
| Puissance d'utilisation (Pu) | **249 kW** | après ku/ks (ks TD=0.85, ks global=0.9) |
| — dont Normal | 52 kW | réseau normal |
| — dont Secouru (groupe) | **161 kW** | continuité — actes à risque vital |
| — dont Ondulé (ASI) | **36 kW** | informatique, monitorage, têtes de bloc |
| Puissance apparente | 277 kVA | S = Pu / cos φ (0.9) |
| + réserve extension 20 % | 332 kVA | |
| **Transformateur / TGBT** | **400 kVA** | calibre normalisé ≥ S+extension |
| **Groupe électrogène** | **250 kVA** | (≈ 223 kVA calculé) Pu secouru ×1.25 |
| **Onduleur central (ASI)** | **≈ 52 kVA** | Pu ondulé ×1.3, autonomie 10–30 min |

## Répartition par tableau de zone (TD)

| TD | Crit | Pi kW | Pu kW | Secouru kW | Ondulé kW |
|---|---|---|---|---|---|
| RDC · TD-ACCUEIL/ADMIN | F | 11.7 | 6.6 | 1.3 | 0.8 |
| RDC · TD-BLOC/SSPI/STÉRIL | C | 78.9 | 42.8 | 31.8 | 10.1 |
| RDC · TD-CONSULT/GYN | M | 19.8 | 11.1 | 3.5 | 0.7 |
| RDC · TD-IMAGERIE/LABO | E | 92.7 | 49.4 | 33.3 | 12.6 |
| RDC · TD-MATERNITÉ (plateau) | E | 32.1 | 17.6 | 10.9 | 2.6 |
| RDC · TD-PHARMACIE/SUPPORT | F | 7.1 | 3.8 | 1.6 | 0.2 |
| RDC · TD-URGENCES (IT médical) | E | 45.5 | 26.2 | 16.6 | 4.9 |
| R1 · TD-ADMIN | F | 8.7 | 5.0 | 1.0 | 0.6 |
| R1 · TD-BUREAUX | M | 13.2 | 7.4 | 2.1 | 0.5 |
| R1 · TD-HOSPI MATERNITÉ | E | 30.2 | 18.3 | 10.9 | 3.4 |
| R1 · TD-HOSPI MÉDECINE | E | 20.4 | 12.4 | 7.5 | 2.2 |
| R1 · TD-NÉONAT/INFIRMERIE | E | 9.3 | 5.5 | 3.5 | 1.1 |
| TEC-01 — Local technique | C | 107.0 | 70.8 | 54.8 | 0.0 |
| **TOTAL** (ks global 0.9) | | **477** | **249** | **161** | **36** |

## Méthode
1. **Charges par local** : éclairage (W/m²), petite force (kW/prise), équipement biomédical
   (kW/type), CVC (kW froid / EER), informatique (kW/RJ45).
2. **ku** (utilisation) par type de charge, puis somme par TD × **ks TD**, puis × **ks global** au TGBT.
3. **Répartition Normal / Secouru / Ondulé** selon le type de charge et la criticité du local
   (locaux critiques et vitaux → secouru ; monitorage/têtes de bloc/informatique → ondulé).
4. **Dimensionnement** : transformateur ≥ S+extension ; groupe = Pu secouru ×1,25 ; ASI = Pu ondulé ×1,30.

## Réserves
- Les puissances d'équipements lourds (RX, autoclave, centrales fluides) sont des **ordres de
  grandeur** — à remplacer par les fiches techniques réelles (R-14, R-08).
- Démarrages moteurs (ascenseur, compresseurs, groupes froid) : vérifier le **régime transitoire**
  du groupe (à-coups de démarrage).
- cos φ et compensation d'énergie réactive à étudier (batterie de condensateurs).
- Sélectivité, chutes de tension et bilan par départ : note de calcul BE.
