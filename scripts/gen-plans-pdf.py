#!/usr/bin/env python3
"""
Assemble les 8 plans techniques (principe + implantation, CFO/CFA & gaz) en un
dossier PDF A3 paysage — 1 plan par page + page de garde.
Sortie : docs/plans/plans-techniques-nassib-A3.pdf
"""
import os, base64
from weasyprint import HTML

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(BASE, "public", "plans", "generated")
OUTDIR = os.path.join(BASE, "docs", "plans")
os.makedirs(OUTDIR, exist_ok=True)

# (fichier, titre, sous-titre)
PAGES = [
    ("RDC_CFO_CFA.png", "Plan de principe CFO / CFA", "Niveau RDC — A-01 · Zonage par criticité + distribution"),
    ("R1_CFO_CFA.png", "Plan de principe CFO / CFA", "Niveau R+1 — A-02 · Zonage par criticité + distribution"),
    ("RDC_GAZ.png", "Plan de principe Gaz médicaux", "Niveau RDC — A-01 · Sources, colonnes, vannes & alarmes de zone"),
    ("R1_GAZ.png", "Plan de principe Gaz médicaux", "Niveau R+1 — A-02 · Sources, colonnes, vannes & alarmes de zone"),
    ("RDC_IMPLANTATION_CFO_CFA.png", "Implantation des prises CFO / CFA", "Niveau RDC — A-01 · Repère par local"),
    ("R1_IMPLANTATION_CFO_CFA.png", "Implantation des prises CFO / CFA", "Niveau R+1 — A-02 · Repère par local"),
    ("RDC_IMPLANTATION_GAZ.png", "Implantation des prises Gaz médicaux", "Niveau RDC — A-01 · Repère par local"),
    ("R1_IMPLANTATION_GAZ.png", "Implantation des prises Gaz médicaux", "Niveau R+1 — A-02 · Repère par local"),
]


def b64(path):
    with open(path, "rb") as fh:
        return "data:image/png;base64," + base64.b64encode(fh.read()).decode()


cover = """
<section class="page cover">
  <div class="cbox">
    <div class="brand">K'BIO — Construction Polyclinique Nassib</div>
    <div class="org">Fondation Ismail Omar Guelleh — Djibouti</div>
    <h1>DOSSIER DE PLANS TECHNIQUES</h1>
    <div class="sub">CFO / CFA &amp; Gaz médicaux — principe &amp; implantation des prises</div>
    <ul class="toc">
      <li>Plans de principe CFO/CFA — RDC &amp; R+1</li>
      <li>Plans de principe gaz médicaux — RDC &amp; R+1</li>
      <li>Implantation des prises CFO/CFA — RDC &amp; R+1</li>
      <li>Implantation des prises gaz médicaux — RDC &amp; R+1</li>
    </ul>
    <div class="foot">Indice 180526 · Avant-projet — document de conception.<br>
    Ne vaut pas plan d'exécution ni note de calcul réglementaire.<br>
    Source : plans architecte A-01/A-02 + fiches d'équipement FIOG.</div>
  </div>
</section>
"""

pages_html = ""
for fn, titre, sub in PAGES:
    img = b64(os.path.join(GEN, fn))
    pages_html += f"""
<section class="page">
  <div class="plan"><img src="{img}"></div>
  <div class="tb">
    <span class="t1">POLYCLINIQUE NASSIB — FIOG</span>
    <span class="t2">{titre}</span>
    <span class="t3">{sub}</span>
    <span class="t4">Indice 180526 · conception — ne vaut pas plan d'exécution</span>
  </div>
</section>"""

CSS = """
@page { size: A3 landscape; margin: 6mm; }
* { box-sizing: border-box; }
body { margin:0; font-family:'DejaVu Sans',Arial,sans-serif; color:#1c2128; }
.page { height:283mm; page-break-after:always; display:flex; flex-direction:column; overflow:hidden; }
.page:last-child { page-break-after:auto; }
.plan { flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden; min-height:0; }
.plan img { max-width:100%; max-height:262mm; object-fit:contain; }
.tb { border-top:2px solid #1c2128; padding-top:2mm; margin-top:2mm; display:flex; gap:8mm; align-items:baseline; font-size:9pt; }
.tb .t1 { font-weight:bold; color:#003f72; }
.tb .t2 { font-weight:bold; }
.tb .t3 { color:#46566a; } .tb .t4 { margin-left:auto; color:#8a97a3; font-size:8pt; }
.cover { align-items:center; justify-content:center; text-align:center; height:283mm; }
.cbox { border:3px solid #1c2128; padding:26mm 30mm; }
.brand { color:#003f72; font-weight:bold; font-size:14pt; }
.org { color:#46566a; margin-top:2mm; }
h1 { font-size:34pt; margin:10mm 0 4mm; letter-spacing:.5px; }
.sub { font-size:14pt; color:#33424f; }
.toc { text-align:left; display:inline-block; margin:12mm auto; font-size:12pt; line-height:1.9; }
.foot { margin-top:8mm; font-size:9.5pt; color:#8a97a3; }
"""

html = f"<!doctype html><html lang='fr'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cover}{pages_html}</body></html>"
out = os.path.join(OUTDIR, "plans-techniques-nassib-A3.pdf")
HTML(string=html).write_pdf(out)
print("PDF A3 écrit :", out)
