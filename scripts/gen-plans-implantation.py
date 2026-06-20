#!/usr/bin/env python3
"""
Plans d'IMPLANTATION DES PRISES TERMINALES (repères par local) — niveau de détail
supérieur au zonage de principe. Place, à l'emplacement de chaque local sur le
plan 2D réel, un repère compact des prises :
  - gaz médicaux : O₂ / Air / Vide (+ N₂O/AGSS) par local desservi ;
  - CFO/CFA : PC normale, PC ondulée/secourue, RJ45, appel malade.

Coordonnées des locaux relevées sur les plans A-01 (RDC) / A-02 (R+1).
Valeurs lues depuis docs/fiches-locaux/rooms-data.json (généré par gen-fiches-locaux.mjs).

Sortie : public/plans/generated/{RDC,R1}_IMPLANTATION_{GAZ,CFO_CFA}.png
"""
import os, json
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("PLANS_SRC", "/tmp/plans")
OUT = os.path.join(BASE, "public", "plans", "generated")
os.makedirs(OUT, exist_ok=True)
DATA = json.load(open(os.path.join(BASE, "docs", "fiches-locaux", "rooms-data.json")))
BY = {r["code"]: r for r in DATA}

FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def f(sz, b=True): return ImageFont.truetype(FB if b else FR, sz)

CRITCOL = {"C": (220, 40, 40), "E": (240, 140, 20), "M": (235, 205, 30), "F": (70, 170, 90)}
CROP = (30, 360, 1980, 1560)

# ── Coordonnées (fraction du crop bâtiment 1950×1200) ────────────────────────
RDC_XY = {
    "STE-01": (.28, .13), "BLC-01": (.225, .16), "SAS-BLC": (.305, .24), "REV-01": (.345, .205),
    "VES-F": (.37, .30), "LAB-01": (.46, .30),
    "PRE-01": (.225, .50), "PRE-02": (.225, .60), "PRE-03": (.225, .70),
    "TRV-01": (.305, .40), "TRV-02": (.305, .53), "TRV-03": (.305, .61), "INF-MAT": (.305, .67),
    "BMAT-01": (.16, .30), "BMAT-02": (.16, .43),
    "MAG-01": (.53, .295), "VES-H": (.60, .295), "PHA-01": (.645, .295),
    "IMG-01": (.72, .30), "SAS-IMG": (.785, .23), "STK-URG": (.81, .25),
    "BUR-URG1": (.805, .31), "INF-URG": (.805, .39), "MLAB-01": (.805, .46), "BUR-URG2": (.805, .505),
    "SAS-URG": (.805, .585),
    "PCH-01": (.885, .18), "DECH-01": (.885, .27), "BOX-04": (.885, .345),
    "BOX-03": (.885, .41), "BOX-02": (.885, .505), "BOX-01": (.885, .58),
    "DEN-01": (.63, .47),
    "BCS-01": (.39, .505), "BCS-02": (.43, .505), "BCS-03": (.47, .505), "BCS-04": (.51, .505),
    "BGYN-01": (.55, .505), "BGYN-02": (.58, .51),
    "ACC-01": (.665, .555), "CAI-01": (.625, .585), "ADM-01": (.625, .64), "ATT-01": (.72, .61),
}
# Plan architecte : chambres maternité 1-14 toutes au R+1 (écart R-13 vs catalogue)
R1_XY = {
    "MAT-11": (.22, .22), "MAT-10": (.305, .22), "MAT-09": (.24, .33),
    "MAT-08": (.235, .49), "MAT-07": (.235, .555), "MAT-05": (.235, .615),
    "MAT-03": (.235, .70), "MAT-01": (.235, .775),
    "MAT-06": (.305, .615), "MAT-04": (.305, .70), "MAT-02": (.305, .775),
    "MAT-12": (.50, .49), "MAT-13": (.47, .49), "MAT-14": (.525, .49),
    "BIB-01": (.375, .49),
    "BUR-R1-1": (.16, .38), "BUR-R1-2": (.16, .48),
    "BUR-R1-3": (.52, .34), "BUR-R1-4": (.58, .34), "BUR-R1-5": (.64, .34),
    "HDJ-01": (.78, .345), "ACC-R1": (.72, .405), "INF-R1": (.885, .33),
    "HOS-07": (.885, .22), "HOS-06": (.755, .45), "HOS-05": (.885, .45),
    "HOS-04": (.755, .55), "HOS-03": (.885, .55), "HOS-01": (.755, .62), "HOS-02": (.885, .62),
    "ATT-R1": (.62, .52), "ADM-R1": (.60, .645),
}


def base_building(level):
    src = os.path.join(SRC, "RDC-1.png" if level == "RDC" else "R1-1.png")
    im = Image.open(src).convert("RGB").crop(CROP)
    return Image.blend(im, Image.new("RGB", im.size, (255, 255, 255)), 0.55)


def chip(d, x, y, text, fill, w=None):
    fnt = f(13)
    tw = d.textlength(text, font=fnt)
    w = w or int(tw + 8)
    d.rectangle((x, y, x + w, y + 17), fill=fill, outline=(20, 20, 20), width=1)
    lum = 0.299 * fill[0] + 0.587 * fill[1] + 0.114 * fill[2]
    d.text((x + 4, y + 1), text, fill=(255, 255, 255) if lum < 150 else (20, 20, 20), font=fnt)
    return w


def marker_gaz(d, px, py, r):
    chips = []
    if r["o2"]: chips.append((f"O₂ {r['o2']}", (0, 150, 70)))
    if r["air"]: chips.append((f"Air {r['air']}", (0, 140, 200)))
    if r["vide"]: chips.append((f"Vide {r['vide']}", (90, 100, 110)))
    if r["n2o"]: chips.append(("N₂O?", (150, 80, 160)))
    if r["agss"]: chips.append(("AGSS?", (150, 80, 160)))
    if not chips: return
    total = 0
    widths = []
    for t, c in chips:
        w = int(d.textlength(t, font=f(13)) + 8); widths.append(w); total += w + 2
    x0 = int(px - total / 2); y0 = int(py - 8)
    # fond + leader
    d.rectangle((x0 - 2, y0 - 2, x0 + total, y0 + 19), fill=(255, 255, 255, 235), outline=CRITCOL[r["crit"]], width=2)
    x = x0
    for (t, c), w in zip(chips, widths):
        chip(d, x, y0, t, c, w); x += w + 2


def marker_elec(d, px, py, r):
    chips = [(f"PC {r['pc16']}", (40, 60, 90))]
    if r["ondule"]: chips.append((f"Ond {r['ondule']}", (200, 60, 60)))
    if r["rj45"]: chips.append((f"RJ {r['rj45']}", (0, 110, 150)))
    if r["nurse"]: chips.append(("☎AM", (210, 120, 0)))
    if r["ded"]: chips.append((f"Déd {r['ded']}", (90, 40, 120)))
    total = 0; widths = []
    for t, c in chips:
        w = int(d.textlength(t, font=f(13)) + 8); widths.append(w); total += w + 2
    x0 = int(px - total / 2); y0 = int(py - 8)
    d.rectangle((x0 - 2, y0 - 2, x0 + total, y0 + 19), fill=(255, 255, 255, 235), outline=CRITCOL[r["crit"]], width=2)
    x = x0
    for (t, c), w in zip(chips, widths):
        chip(d, x, y0, t, c, w); x += w + 2


def compose(level, mode):
    bld = base_building(level)
    W, H = bld.size
    PANEL, HEAD = 540, 96
    canvas = Image.new("RGB", (W + PANEL, H + HEAD), (255, 255, 255))
    canvas.paste(bld, (0, HEAD))
    d = ImageDraw.Draw(canvas, "RGBA")

    head_col = (0, 120, 90) if mode == "gaz" else (0, 63, 114)
    d.rectangle((0, 0, W + PANEL, HEAD), fill=head_col)
    title = ("IMPLANTATION DES PRISES — GAZ MÉDICAUX" if mode == "gaz"
             else "IMPLANTATION DES PRISES — CFO / CFA")
    d.text((20, 14), title, fill=(255, 255, 255), font=f(30))
    d.text((20, 56), f"Polyclinique Nassib (FIOG) | Niveau {'RDC (A-01)' if level=='RDC' else 'R+1 (A-02)'} | "
                     f"repères par local — implantation indicative à caler sur fond DWG",
            fill=(220, 230, 240), font=f(17, False))

    XY = RDC_XY if level == "RDC" else R1_XY
    sub = canvas.crop((0, HEAD, W, H + HEAD))
    sd = ImageDraw.Draw(sub, "RGBA")
    drawn = 0
    for code, (fx, fy) in XY.items():
        r = BY.get(code)
        if not r: continue
        px, py = fx * W, fy * H
        if mode == "gaz":
            if r["o2"] + r["air"] + r["vide"] + r["n2o"] + r["agss"] == 0:
                continue
            marker_gaz(sd, px, py, r); drawn += 1
        else:
            marker_elec(sd, px, py, r); drawn += 1
    canvas.paste(sub, (0, HEAD))

    # panneau légende
    px = W + 14
    dd = ImageDraw.Draw(canvas)
    dd.text((px, HEAD + 12), "LÉGENDE", fill=(0, 0, 0), font=f(23))
    y = HEAD + 48
    if mode == "gaz":
        legend = [("O₂ n", (0, 150, 70), "Oxygène — n prises terminales"),
                  ("Air n", (0, 140, 200), "Air médical 3,5 bar"),
                  ("Vide n", (90, 100, 110), "Vide / aspiration"),
                  ("N₂O?", (150, 80, 160), "Protoxyde / AGSS — à confirmer (R-07)")]
        notes = ["Chaque repère = prises au bandeau de tête",
                 "(lit/box) ou bras/panneau (bloc, SSPI).",
                 "Hauteur : 1,40 m bandeau / 1,60 m mural.",
                 "Locaux sans gaz (admin, attente, stock,",
                 "vestiaires, imagerie) non repérés.",
                 "Vannes + alarmes de zone : voir plan",
                 "général gaz (principe).",
                 "",
                 "Sommes prises projet → centrale TEC-01",
                 "(local technique fluides — VRD arrière)."]
    else:
        legend = [("PC n", (40, 60, 90), "Prises de courant normales (16A)"),
                  ("Ond n", (200, 60, 60), "Prises ondulées / secourues"),
                  ("RJ n", (0, 110, 150), "Prises RJ45 (VDI)"),
                  ("☎AM", (210, 120, 0), "Appel malade / infirmière"),
                  ("Déd n", (90, 40, 120), "Alimentations dédiées (RX, autoclave…)")]
        notes = ["Bordure du repère = criticité électrique.",
                 "PC 20A, BAES, terre, Wi-Fi, vidéo, contrôle",
                 "d'accès : détaillés dans les fiches locaux.",
                 "Bandeaux de lit (BTDL) : PC + ondulé + RJ45",
                 "+ appel malade intégrés à la tête de lit.",
                 "IT médical : Bloc, SSPI, Déchocage, Petit chir.",
                 "",
                 "Implantation indicative (avant-projet) —",
                 "positions exactes à figer par le BE sur DWG."]
    for t, c, desc in legend:
        dd.rectangle((px, y, px + 52, y + 17), fill=c, outline=(20, 20, 20))
        dd.text((px + 6, y + 1), t, fill=(255, 255, 255), font=f(12))
        dd.text((px + 60, y), desc, fill=(0, 0, 0), font=f(13, False)); y += 25
    y += 8
    dd.text((px, y), "Criticité (bordure) :", fill=(0, 0, 0), font=f(14)); y += 24
    for k, lab in [("C", "Critique"), ("E", "Élevé"), ("M", "Moyen"), ("F", "Faible")]:
        dd.rectangle((px, y, px + 22, y + 16), outline=CRITCOL[k], width=3)
        dd.text((px + 30, y), lab, fill=(0, 0, 0), font=f(13, False)); y += 23
    y += 8
    dd.text((px, y), "Notes :", fill=(0, 0, 0), font=f(15)); y += 24
    for n in notes:
        dd.text((px, y), n, fill=(40, 40, 40), font=f(13, False)); y += 19
    # locaux non localisés sur ce plan
    placed = set(XY.keys())
    miss = [r["code"] for r in DATA if r["level"] == level and r["code"] not in placed
            and not r["code"].startswith("MAT") and r["code"] != "TEC-01"]
    if level == "RDC":
        miss = [c for c in miss]  # MAT chambres reportées au R+1 (R-13)
    dd.text((px, H + HEAD - 56), "Non localisés ici : " + (", ".join(miss) if miss else "—"),
            fill=(120, 60, 60), font=f(11, False))
    dd.text((px, H + HEAD - 38), "Chambres maternité 1-14 : reportées au R+1 (plan architecte — R-13).",
            fill=(120, 60, 60), font=f(11, False))
    dd.text((px, H + HEAD - 20), "Source : plans A-01/A-02 + fiches FIOG. Ne vaut pas plan d'exécution.",
            fill=(120, 120, 120), font=f(11, False))

    name = f"{level}_IMPLANTATION_{'GAZ' if mode=='gaz' else 'CFO_CFA'}.png"
    canvas.save(os.path.join(OUT, name))
    print("écrit", name, "| repères:", drawn)


for level in ["RDC", "R1"]:
    for mode in ["gaz", "elec"]:
        compose(level, mode)
print("OK")
