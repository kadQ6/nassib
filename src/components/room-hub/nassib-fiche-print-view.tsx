"use client";

import { useCallback, useEffect } from "react";
import { ImplementationPlanImage } from "@/components/room-hub/room-implementation-plan";
import { resolveImplementationPlanImage } from "@/lib/room-sheet/implementation-plan-images";
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

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="nf-cell">
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

function Block({ title, children, compact }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={`nf-block ${compact ? "nf-block-compact" : ""}`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function NassibFichePrintView({
  data,
  roomCode,
  roomName,
  autoPrint = false,
  embedded = false,
}: {
  data: NassibFichePrintData;
  roomCode: string;
  roomName: string;
  autoPrint?: boolean;
  embedded?: boolean;
}) {
  const print = useCallback(() => window.print(), []);

  useEffect(() => {
    if (!autoPrint) return;
    const t = window.setTimeout(() => window.print(), 500);
    return () => window.clearTimeout(t);
  }, [autoPrint]);

  const d = data;
  const plan = resolveImplementationPlanImage(roomCode);
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
            Format A4 paysage · gabarit IOG · plan d&apos;implantation K&apos;BIO 180526
          </p>
        </div>
      )}

      <article className="nf-sheet">
        <header className="nf-header">
          <div>
            <p className="nf-brand">K&apos;BIO — Polyclinique Nassib</p>
            <p className="nf-sub">Fiche local — Polyclinique Nassib · Fondation IOG</p>
          </div>
          <div className="nf-header-id">
            <p>
              <strong>Groupe :</strong> {d.header.groupe}
            </p>
            <p>
              <strong>Plan :</strong> {d.header.planRef} · {d.header.level}
            </p>
          </div>
          <div className="nf-header-code">
            <span className="nf-label">Code local</span>
            <span className="nf-header-code-value">{d.header.code}</span>
          </div>
        </header>

        <div className="nf-body-landscape">
          {/* Colonne plan + équipements */}
          <aside className="nf-plan-col">
            <h2>Plan d&apos;implantation — {plan?.title ?? roomName}</h2>
            <p className="nf-plan-ref">Réf. K&apos;BIO plans équipements 180526 · {roomCode}</p>
            <div className="nf-plan-frame">
              {plan ? (
                <ImplementationPlanImage
                  roomCode={roomCode}
                  printMode
                  className="!border-0 !p-0 !bg-transparent !rounded-none"
                />
              ) : (
                <p className="nf-plan-placeholder">Plan d&apos;implantation non disponible pour ce code</p>
              )}
            </div>
            <div className="nf-kpi-strip">
              <div className="nf-kpi">
                <span className="nf-kpi-label">Surface</span>
                <span className="nf-kpi-value">{d.surfaces.utileM2} m²</span>
              </div>
              <div className="nf-kpi">
                <span className="nf-kpi-label">Hauteur</span>
                <span className="nf-kpi-value">{d.surfaces.hauteurLibreM} m</span>
              </div>
              <div className="nf-kpi">
                <span className="nf-kpi-label">O₂ / Asp.</span>
                <span className="nf-kpi-value">
                  {d.fluides.oxygene.total} / {d.fluides.vide.total}
                </span>
              </div>
            </div>
            <h2>Équipements implantés</h2>
            <ul className="nf-equip-list">
              {d.meubles.length ? d.meubles.map((m) => <li key={m}>{m}</li>) : <li>—</li>}
            </ul>
          </aside>

          {/* Colonne formulaire technique */}
          <div className="nf-form-col">
            <div className="nf-form-row nf-form-row-3">
              <Block title="Électricité CFO / CFA">
                <table className="nf-table">
                  <tbody>
                    <QtyRow label="PC 16A N" total={d.electricite.pc16Normale} bras={0} mur={0} gtl={0} />
                    <QtyRow label="PC 16A O" total={d.electricite.pc16Ondulee} bras={d.electricite.pc16Ondulee} mur={0} gtl={0} />
                    <QtyRow label="PC 20A N" total={d.electricite.pc20Normale} bras={0} mur={0} gtl={0} />
                  </tbody>
                </table>
                <Cell label="Pack 1 (bandeaux)" value={d.electricite.pack1 || "—"} />
                <Cell label="RJ45" value={d.electricite.rj45} />
                <Cell label="Charge sol daN/m²" value={d.electricite.chargeSolDanM2} />
                <div className="nf-check-grid nf-mt">
                  <Cb on={d.cfa.appelInfirmiere > 0}>Appel inf. ({d.cfa.appelInfirmiere})</Cb>
                  <Cb on={d.cfa.videosurveillance > 0}>Vidéo ({d.cfa.videosurveillance})</Cb>
                  <Cb on={d.cfa.interphone > 0}>Interphone ({d.cfa.interphone})</Cb>
                </div>
              </Block>

              <Block title="Fluides médicaux">
                <table className="nf-table">
                  <thead>
                    <tr>
                      <th />
                      <th>Qté</th>
                      <th>Bras</th>
                      <th>Mur</th>
                      <th>GTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <QtyRow label="Oxygène" {...d.fluides.oxygene} />
                    <QtyRow label="Vide" {...d.fluides.vide} />
                    <QtyRow label="Air méd." {...d.fluides.airMedical} />
                    <QtyRow label="N₂O" {...d.fluides.protoxyde} />
                  </tbody>
                </table>
              </Block>

              <Block title="Plomberie sanitaire" compact>
                <div className="nf-check-grid">
                  <Cb on={d.plomberie.lavabo}>Lavabo</Cb>
                  <Cb on={d.plomberie.laveMains}>Lave-mains</Cb>
                  <Cb on={d.plomberie.wcSuspendu}>WC suspendu</Cb>
                  <Cb on={d.plomberie.douche}>Douche</Cb>
                  <Cb on={d.plomberie.evier}>Évier</Cb>
                  <Cb on={d.plomberie.bacLaver}>Bac à laver</Cb>
                  <Cb on={d.plomberie.siphonSol > 0}>Siphon sol ({d.plomberie.siphonSol})</Cb>
                </div>
              </Block>
            </div>

            <div className="nf-form-row nf-form-row-3">
              <Block title="Sols & éclairage naturel" compact>
                <div className="nf-check-grid">
                  <Cb on={d.sols.carrelage}>Carrelage</Cb>
                  <Cb on={d.sols.antiderapant}>Antidérapant</Cb>
                  <Cb on={d.sols.solSouple}>Sol souple</Cb>
                  <Cb on={d.sols.peintureResine}>Résine</Cb>
                </div>
                <Cell label="Éclairage naturel" value={natLight} />
              </Block>

              <Block title="Murs & plafonds" compact>
                <div className="nf-check-grid">
                  <Cb on={d.murs.peinture}>Peinture</Cb>
                  <Cb on={d.murs.faience}>Faïence</Cb>
                  <Cb on={d.plafonds.demontable}>Faux-plafond</Cb>
                  <Cb on={d.plafonds.lessivable}>Lessivable</Cb>
                </div>
                <Cell label="UPEC" value={d.murs.upec} />
                <Cell label="Ht. sous plafond" value={d.plafonds.hauteurUtileMini} />
              </Block>

              <Block title="Menuiseries" compact>
                <div className="nf-check-grid">
                  <Cb on={d.menuiseries.ouvrable}>Ouvrable</Cb>
                  <Cb on={d.menuiseries.oscilloBattant}>Oscillo-battant</Cb>
                  <Cb on={d.menuiseries.coulissant}>Coulissant</Cb>
                  <Cb on={d.menuiseries.fixe}>Fixe</Cb>
                </div>
              </Block>
            </div>

            <div className="nf-form-row nf-form-row-2">
              <Block title="CVC & ventilation">
                <div className="nf-check-grid">
                  <Cb on={d.cvc.localRafraichi}>Local rafraîchi</Cb>
                  <Cb on={d.cvc.localRefroidi}>Local refroidi</Cb>
                  <Cb on={d.cvc.extractionRenforcee}>Extraction renforcée</Cb>
                  <Cb on={d.cvc.gestionPression}>Gestion pression</Cb>
                </div>
                <Cell label="Temp. été" value={d.cvc.temperatureEte} />
                <Cell label="Débit / norme" value={d.cvc.specificites} />
              </Block>

              <Block title="Éclairage & portes">
                <div className="nf-check-grid">
                  <Cb on={d.eclairage.plafonnier}>Plafonnier</Cb>
                  <Cb on={d.eclairage.localise}>Localisé (bandeaux)</Cb>
                  <Cb on={d.eclairage.sa}>SA</Cb>
                  <Cb on={d.eclairage.detecteur}>Détecteur</Cb>
                </div>
                {d.portes[0] && (
                  <p className="nf-small">
                    Porte {d.portes[0].largMm} mm · {d.portes[0].vitree ? "Vitrée" : "Pleine"}
                    {d.portes[0].occulus ? " · Occulus" : ""}
                  </p>
                )}
              </Block>
            </div>

            <Block title="Observations / équipements compris dans l&apos;opération">
              <p className="nf-obs">{d.equipements}</p>
              {d.observations && (
                <p className="nf-obs nf-mt" style={{ fontSize: "6pt", color: "#64748b" }}>
                  {d.observations.slice(0, 280)}
                  {d.observations.length > 280 ? "…" : ""}
                </p>
              )}
            </Block>
          </div>
        </div>

        <footer className="nf-footer">
          <div>
            <span className="nf-label">Intitulé du local</span>
            <p className="nf-footer-title">{d.header.intitule}</p>
          </div>
          <div className="nf-header-code">
            <span className="nf-label">Code</span>
            <span className="nf-header-code-value">{d.header.code}</span>
          </div>
        </footer>
      </article>
    </div>
  );
}
