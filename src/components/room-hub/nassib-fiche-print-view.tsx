"use client";

import { useCallback, useEffect } from "react";
import type { NassibFichePrintData } from "@/lib/room-sheet/nassib-fiche-print";
import "./nassib-fiche-print.css";

function Cb({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className="nf-cb">
      <span className="nf-box" aria-hidden>
        {on ? "☑" : "☐"}
      </span>
      {children}
    </span>
  );
}

function Cell({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={`nf-cell ${className}`}>
      <span className="nf-label">{label}</span>
      <span className="nf-value">{value}</span>
    </div>
  );
}

function QtyRow({
  label,
  total,
  bras,
  mur,
  gtl,
}: {
  label: string;
  total: number;
  bras: number;
  mur: number;
  gtl: number;
}) {
  return (
    <tr>
      <td>{label}</td>
      <td className="nf-num">{total || "—"}</td>
      <td className="nf-num">{bras || "—"}</td>
      <td className="nf-num">{mur || "—"}</td>
      <td className="nf-num">{gtl || "—"}</td>
    </tr>
  );
}

export function NassibFichePrintView({
  data,
  autoPrint = false,
  embedded = false,
}: {
  data: NassibFichePrintData;
  autoPrint?: boolean;
  embedded?: boolean;
}) {
  const print = useCallback(() => {
    window.print();
  }, []);

  useEffect(() => {
    if (!autoPrint) return;
    const t = window.setTimeout(() => window.print(), 500);
    return () => window.clearTimeout(t);
  }, [autoPrint]);

  const d = data;
  const natLight =
    d.sols.eclairageNaturel === "obligatoire"
      ? "Obligatoire"
      : d.sols.eclairageNaturel === "souhaite"
        ? "Souhaité"
        : d.sols.eclairageNaturel === "proscrire"
          ? "À proscrire"
          : "—";

  return (
    <div className={`nf-root ${embedded ? "nf-embedded" : ""}`}>
      {!embedded && (
      <div className="nf-toolbar no-print">
        <button type="button" className="nf-print-btn" onClick={print}>
          Imprimer la fiche local
        </button>
        <p className="nf-toolbar-hint">
          Aperçu au format IOG · une fiche A4 par local · utilisez « Imprimer » ou Ctrl+P
        </p>
      </div>
      )}

      <article className="nf-sheet">
        <header className="nf-header">
          <div>
            <p className="nf-brand">K&apos;BIO — Construction Clinique Djibouti</p>
            <p className="nf-sub">Fiche local — Polyclinique Nassib</p>
          </div>
          <div className="nf-header-right">
            <p>
              <strong>Groupe :</strong> {d.header.groupe}
            </p>
            <p>
              <strong>Plan :</strong> {d.header.planRef} · {d.header.level}
            </p>
          </div>
        </header>

        <section className="nf-grid nf-grid-3">
          <div className="nf-block">
            <h2>Électricité courants forts et faibles</h2>
            <table className="nf-table">
              <tbody>
                <QtyRow label="PC 16A normale" total={d.electricite.pc16Normale} bras={0} mur={0} gtl={0} />
                <QtyRow label="PC 16A ondulée" total={d.electricite.pc16Ondulee} bras={d.electricite.pc16Ondulee} mur={0} gtl={0} />
                <QtyRow label="PC 20A normale" total={d.electricite.pc20Normale} bras={0} mur={0} gtl={0} />
              </tbody>
            </table>
            <Cell label="Charge au sol (daN/m²)" value={d.electricite.chargeSolDanM2} />
            <Cell label="Pack 1 (3 PCN, 3 PCO, 2 RJ45)" value={d.electricite.pack1 || "—"} />
            <Cell label="Pack 2 (1 PCN, 1 PCO, 1 RJ45)" value={d.electricite.pack2 || "—"} />
            <Cell label="Pack 3 (1 PCN, 1 RJ45)" value={d.electricite.pack3 || "—"} />
            <Cell label="RJ45" value={d.electricite.rj45} />
            <Cell label="Linéaire de paillasse" value={d.electricite.linéairePaillasse} />
            <Cell label="Nb bacs par paillasse" value={d.electricite.nbBacsPaillasse} />
          </div>

          <div className="nf-block">
            <h2>Plomberie sanitaire</h2>
            <div className="nf-check-grid">
              <Cb on={d.plomberie.lavabo}>Lavabo</Cb>
              <Cb on={d.plomberie.laveMains}>Lave-mains</Cb>
              <Cb on={d.plomberie.vasque}>Vasque + plan vasque</Cb>
              <Cb on={d.plomberie.evier}>Évier</Cb>
              <Cb on={d.plomberie.vidoir}>Vidoir</Cb>
              <Cb on={d.plomberie.bacLaver}>Bac à laver (EF+ECS)</Cb>
              <Cb on={d.plomberie.douche}>Douche</Cb>
              <Cb on={d.plomberie.siegeDouche}>Siège de douche clipsable</Cb>
              <Cb on={d.plomberie.wcSuspendu}>WC suspendu</Cb>
              <Cb on={d.plomberie.siphonSol > 0}>Siphon de sol ({d.plomberie.siphonSol})</Cb>
              <Cb on={d.plomberie.baignoire}>Baignoire à hauteur variable</Cb>
              <Cb on={d.plomberie.posteDesinfection}>Poste de désinfection</Cb>
              <Cb on={d.plomberie.fontaineEau}>Fontaine à eau</Cb>
              <Cb on={d.plomberie.robinetPuisage}>Robinet puisage</Cb>
              <Cb on={d.plomberie.augeChirurgicale}>Auge chirurgicale</Cb>
              <Cb on={d.plomberie.laveBassin}>Lave bassin</Cb>
            </div>
            <Cell label="À la charge" value={d.plomberie.aLaCharge} />
          </div>

          <div className="nf-block">
            <h2>Fluides médicaux</h2>
            <table className="nf-table">
              <thead>
                <tr>
                  <th />
                  <th>Qté totale</th>
                  <th>Bras</th>
                  <th>Mur</th>
                  <th>GTL</th>
                </tr>
              </thead>
              <tbody>
                <QtyRow label="Oxygène" {...d.fluides.oxygene} />
                <QtyRow label="Vide" {...d.fluides.vide} />
                <QtyRow label="Air médical 3,5 bars" {...d.fluides.airMedical} />
                <QtyRow label="Protoxyde d'azote" {...d.fluides.protoxyde} />
              </tbody>
            </table>
            <Cell label="Attentes spécifiques" value={d.fluides.attentes || "—"} />
            <div className="nf-surface-box">
              <Cell label="Surface utile (m²)" value={d.surfaces.utileM2} />
              <Cell label="Hauteur libre mini (m)" value={d.surfaces.hauteurLibreM} />
              <Cell label="Autres" value={d.surfaces.autres} />
            </div>
          </div>
        </section>

        <section className="nf-grid nf-grid-3">
          <div className="nf-block">
            <h2>Sols</h2>
            <div className="nf-check-grid">
              <Cb on={d.sols.solSouple}>Sol souple</Cb>
              <Cb on={d.sols.antistatique}>Antistatique</Cb>
              <Cb on={d.sols.carrelage}>Carrelage</Cb>
              <Cb on={d.sols.antiderapant}>Antidérapant</Cb>
              <Cb on={d.sols.peintureResine}>Peinture / Résine</Cb>
              <Cb on={d.sols.lavageFrequent}>Lavage fréquent</Cb>
            </div>
            <Cell label="Autre" value={d.sols.autre || "—"} />
            <Cell label="Charge roulante" value={d.sols.chargeRoulante} />
            <Cell label="Éclairage naturel" value={natLight} />
          </div>

          <div className="nf-block">
            <h2>Murs</h2>
            <div className="nf-check-grid">
              <Cb on={d.murs.peinture}>Peinture</Cb>
              <Cb on={d.murs.faience}>Faïence</Cb>
              <Cb on={d.murs.toileVerre}>Toile de verre + peinture</Cb>
              <Cb on={d.murs.revetementPlastique}>Revêtement plastique</Cb>
              <Cb on={d.murs.initiativeConcepteur}>Initiative concepteur</Cb>
              <Cb on={d.murs.protection120}>Protection 1,20 m</Cb>
              <Cb on={d.murs.lisseBasse}>Lisse basse</Cb>
              <Cb on={d.murs.lisseHaute}>Lisse haute</Cb>
              <Cb on={d.murs.mainCourante}>Main-courante</Cb>
            </div>
            <Cell label="UPEC" value={d.murs.upec} />
            <Cell label="Plinthes" value={d.murs.plintheAutre || "Standard (Bois/Carrelage)"} />
            <Cb on={d.murs.protectionChocs}>Protection chocs</Cb>
            <Cell label="Hauteur protection" value={d.murs.hauteurProtection} />
          </div>

          <div className="nf-block">
            <h2>Menuiseries / occultation</h2>
            <div className="nf-check-grid">
              <Cb on={d.menuiseries.ouvrable}>Ouvrable</Cb>
              <Cb on={d.menuiseries.fixe}>Fixe</Cb>
              <Cb on={d.menuiseries.oscilloBattant}>Oscillo-battant</Cb>
              <Cb on={d.menuiseries.coulissant}>Coulissant</Cb>
              <Cb on={d.menuiseries.limiteurOuverture}>Limiteur d&apos;ouverture</Cb>
              <Cb on={d.menuiseries.motorisation}>Motorisation</Cb>
              <Cb on={d.menuiseries.antiIntrusion}>Anti-intrusion</Cb>
              <Cb on={d.menuiseries.noirComplet}>Noir complet</Cb>
              <Cb on={d.menuiseries.solaireExterieur}>Solaire extérieur</Cb>
              <Cb on={d.menuiseries.solaireInterieur}>Solaire intérieur</Cb>
            </div>
            <div className="nf-check-grid nf-mt">
              <Cb on={d.cfa.appelInfirmiere > 0}>Appel infirmière ({d.cfa.appelInfirmiere})</Cb>
              <Cb on={d.cfa.interphone > 0}>Interphone / Visiophone ({d.cfa.interphone})</Cb>
              <Cb on={d.cfa.videosurveillance > 0}>Vidéosurveillance ({d.cfa.videosurveillance})</Cb>
              <Cb on={d.cfa.monitoring}>Monitoring</Cb>
            </div>
          </div>
        </section>

        <section className="nf-grid nf-grid-2">
          <div className="nf-block">
            <h2>Plafonds</h2>
            <div className="nf-check-grid">
              <Cb on={d.plafonds.peinture}>Peinture</Cb>
              <Cb on={d.plafonds.demontable}>Démontable</Cb>
              <Cb on={d.plafonds.plaquePlatre}>Plaque de plâtre</Cb>
              <Cb on={d.plafonds.lessivable}>Lessivable</Cb>
              <Cb on={d.plafonds.acoustique}>Acoustique</Cb>
              <Cb on={d.plafonds.etancheAir}>Étanche à l&apos;air</Cb>
            </div>
            <Cell label="Hauteur utile sous faux-plafond mini" value={d.plafonds.hauteurUtileMini} />
          </div>
          <div className="nf-block">
            <h2>Meubles menuisés / équipements</h2>
            <ul className="nf-list">
              {d.meubles.length ? d.meubles.map((m) => <li key={m}>{m}</li>) : <li>—</li>}
            </ul>
          </div>
        </section>

        <section className="nf-block">
          <h2>Portes</h2>
          <table className="nf-table nf-table-doors">
            <thead>
              <tr>
                <th>Vers</th>
                <th>Larg.</th>
                <th>Pleine</th>
                <th>Vitrée</th>
                <th>Occulus</th>
                <th>Coulissante</th>
                <th>Auto</th>
              </tr>
            </thead>
            <tbody>
              {d.portes.map((p, i) => (
                <tr key={i}>
                  <td>{p.vers}</td>
                  <td className="nf-num">{p.largMm}</td>
                  <td>{p.pleine ? "☑" : "☐"}</td>
                  <td>{p.vitree ? "☑" : "☐"}</td>
                  <td>{p.occulus ? "☑" : "☐"}</td>
                  <td>{p.coulissante ? "☑" : "☐"}</td>
                  <td>{p.auto ? "☑" : "☐"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {d.portes[0] && (
            <p className="nf-small">
              Confidentialité : {d.portes[0].confidentialite} · Occulus : {d.portes[0].occulusDim} · Accès :{" "}
              {d.portes[0].accesLibre ? "Libre" : "Contrôlé"} ({d.portes[0].accesType})
            </p>
          )}
        </section>

        <section className="nf-grid nf-grid-2">
          <div className="nf-block">
            <h2>Chauffage / ventilation / climatisation</h2>
            <div className="nf-check-grid">
              <Cb on={d.cvc.normal}>Normal</Cb>
              <Cb on={d.cvc.localRafraichi}>Local rafraîchi</Cb>
              <Cb on={d.cvc.localRefroidi}>Local refroidi</Cb>
              <Cb on={d.cvc.localChauffe}>Local chauffé</Cb>
              <Cb on={d.cvc.extractionRenforcee}>Extraction renforcée</Cb>
              <Cb on={d.cvc.rejetAirSpecifique}>Rejet d&apos;air spécifique</Cb>
              <Cb on={d.cvc.gestionPression}>Gestion de la pression</Cb>
            </div>
            <Cell label="Température hiver / été" value={`${d.cvc.temperatureHiver} / ${d.cvc.temperatureEte}`} />
            <Cell label="Spécificités" value={d.cvc.specificites} />
          </div>
          <div className="nf-block">
            <h2>Éclairage</h2>
            <div className="nf-check-grid">
              <Cb on={d.eclairage.sa}>SA</Cb>
              <Cb on={d.eclairage.vv}>VV</Cb>
              <Cb on={d.eclairage.detecteur}>Détecteur</Cb>
              <Cb on={d.eclairage.posteTravail}>Poste travail</Cb>
              <Cb on={d.eclairage.lectureSoins}>Lecture / Soins</Cb>
              <Cb on={d.eclairage.plafonnier}>Plafonnier</Cb>
              <Cb on={d.eclairage.applique}>Applique</Cb>
              <Cb on={d.eclairage.veilleuse}>Veilleuse</Cb>
              <Cb on={d.eclairage.localise}>Localisé</Cb>
            </div>
            <Cell label="Niveau" value={d.eclairage.niveau} />
            <Cell label="Type" value={d.eclairage.type} />
            <Cell label="Fréquence d'utilisation" value={d.eclairage.frequenceUtilisation} />
          </div>
        </section>

        <section className="nf-block">
          <h2>Observations / équipements compris dans l&apos;opération</h2>
          <p className="nf-obs">{d.equipements}</p>
          {d.observations && <p className="nf-obs nf-mt">{d.observations}</p>}
          <div className="nf-footer-meta">
            <Cell label="Ouverture sans contact" value={d.ouvertureSansContact} />
            <Cell label="Second jour toléré" value={d.secondJourTolere} />
          </div>
        </section>

        <footer className="nf-footer">
          <div>
            <span className="nf-label">Intitulé du local</span>
            <p className="nf-footer-title">{d.header.intitule}</p>
          </div>
          <div>
            <span className="nf-label">Code local</span>
            <p className="nf-footer-code">{d.header.code}</p>
          </div>
        </footer>
      </article>
    </div>
  );
}
