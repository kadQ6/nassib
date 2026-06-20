#!/usr/bin/env python3
"""
Plans d'IMPLANTATION DES PRISES TERMINALES par local — rendu architectural propre.
Sur fond de plan 2D net (300 dpi), une étiquette claire par local indique le code
local + les prises :
  - gaz médicaux : O₂ / Air / Vide (+ N₂O/AGSS) ;
  - CFO/CFA : PC normale, PC ondulée/secourue, RJ45, appel malade, alim. dédiées.

Le RDC n'accueille AUCUNE chambre maternité (plateau obstétrical uniquement) ;
les 14 chambres maternité sont au R+1 (plan architecte).

Valeurs : docs/fiches-locaux/rooms-data.json (gen-fiches-locaux.mjs).
Sortie  : public/plans/generated/{RDC,R1}_IMPLANTATION_{GAZ,CFO_CFA}.png
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

INK = (28, 33, 40)
CRITCOL = {"C": (210, 45, 45), "E": (235, 140, 25), "M": (225, 195, 30), "F": (70, 165, 90)}
CRITNAME = {"C": "Critique", "E": "Élevé", "M": "Moyen", "F": "Faible"}
GAS = {"o2": ("O₂", (0, 150, 70)), "air": ("Air", (0, 135, 200)), "vide": ("V", (95, 105, 120))}

# Fond 300 dpi (4961×3508) ; emprise bâtiment = CROP 150dpi ×2
CROP = (60, 720, 3960, 3120)

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
R1_XY = {
    "MAT-11": (.22, .22), "MAT-10": (.305, .22), "MAT-09": (.24, .33),
    "MAT-08": (.235, .49), "MAT-07": (.235, .555), "MAT-05": (.235, .615),
    "MAT-03": (.235, .70), "MAT-01": (.235, .775),
    "MAT-06": (.305, .615), "MAT-04": (.305, .70), "MAT-02": (.305, .775),
    "MAT-13": (.47, .49), "MAT-12": (.505, .49), "MAT-14": (.535, .49),
    "BIB-01": (.375, .49),
    "BUR-R1-1": (.16, .38), "BUR-R1-2": (.16, .48),
    "BUR-R1-3": (.52, .34), "BUR-R1-4": (.58, .34), "BUR-R1-5": (.64, .34),
    "HDJ-01": (.78, .345), "ACC-R1": (.72, .405), "INF-R1": (.885, .33),
    "HOS-07": (.885, .22), "HOS-06": (.755, .45), "HOS-05": (.885, .45),
    "HOS-04": (.755, .55), "HOS-03": (.885, .55), "HOS-01": (.755, .62), "HOS-02": (.885, .62),
    "ATT-R1": (.62, .52), "ADM-R1": (.60, .645),
}


def base_building(level):
    src = os.path.join(SRC, "RDC300-1.png" if level == "RDC" else "R1300-1.png")
    im = Image.open(src).convert("RGB").crop(CROP)
    return Image.blend(im, Image.new("RGB", im.size, (255, 255, 255)), 0.30)


def tag(d, px, py, code, segments, crit):
    """Étiquette blanche : liseré criticité + code + segments [(texte, couleur_point)]."""
    fc, fs = f(21), f(20)
    pad, dot, gap = 8, 7, 12
    # mesure
    w_code = d.textlength(code, font=fc)
    seg_w = []
    for t, _ in segments:
        seg_w.append(dot * 2 + 4 + d.textlength(t, font=fs))
    body_w = sum(seg_w) + gap * (len(segments) - 1) if segments else 0
    W = int(max(w_code, body_w) + pad * 2 + 8)
    H = 58
    x0 = int(px - W / 2); y0 = int(py - H / 2)
    # leader (point exact -> centre tag)
    d.ellipse((px - 5, py - 5, px + 5, py + 5), fill=crit, outline=(255, 255, 255))
    # boîte
    d.rounded_rectangle((x0, y0, x0 + W, y0 + H), radius=7, fill=(255, 255, 255), outline=(70, 78, 88), width=2)
    d.rectangle((x0, y0, x0 + 8, y0 + H), fill=crit)
    # code
    d.text((x0 + 14, y0 + 5), code, fill=INK, font=fc)
    # segments
    x = x0 + 14
    yy = y0 + 32
    for (t, col), sw in zip(segments, seg_w):
        d.ellipse((x, yy + 3, x + dot * 2, yy + 3 + dot * 2), fill=col, outline=(60, 60, 60))
        d.text((x + dot * 2 + 4, yy), t, fill=INK, font=fs)
        x += sw + gap


def cartouche(d, x, y, w, h, level, mode):
    d.rectangle((x, y, x + w, y + h), fill=(255, 255, 255), outline=INK, width=3)
    d.line((x, y + 64, x + w, y + 64), fill=INK, width=2)
    d.line((x, y + 110, x + w, y + 110), fill=INK, width=2)
    d.text((x + 14, y + 12), "POLYCLINIQUE NASSIB", fill=INK, font=f(26))
    d.text((x + 14, y + 40), "Fondation Ismail Omar Guelleh — Djibouti", fill=(90, 95, 102), font=f(16, False))
    titre = "IMPLANTATION PRISES — GAZ MÉDICAUX" if mode == "gaz" else "IMPLANTATION PRISES — CFO / CFA"
    d.text((x + 14, y + 72), titre, fill=(0, 90, 70) if mode == "gaz" else (0, 60, 110), font=f(20))
    d.text((x + 14, y + 120), f"Niveau : {'RDC — A-01' if level=='RDC' else 'R+1 — A-02'}", fill=INK, font=f(17, False))
    d.text((x + 14, y + 144), "Indice : 180526  ·  Avant-projet — conception", fill=INK, font=f(17, False))
    d.text((x + 14, y + 168), "Ne vaut pas plan d'exécution.", fill=(150, 60, 60), font=f(15, False))


def north(d, x, y):
    d.polygon([(x, y - 26), (x - 11, y + 14), (x, y + 4), (x + 11, y + 14)], fill=INK)
    d.text((x - 6, y + 16), "N", fill=INK, font=f(22))


def compose(level, mode):
    bld = base_building(level)
    W, H = bld.size
    PANEL, HEAD = 880, 150
    canvas = Image.new("RGB", (W + PANEL, H + HEAD), (255, 255, 255))
    canvas.paste(bld, (0, HEAD))
    d = ImageDraw.Draw(canvas, "RGBA")

    # bandeau titre sobre
    accent = (0, 120, 90) if mode == "gaz" else (0, 63, 114)
    d.rectangle((0, 0, W + PANEL, HEAD), fill=(247, 249, 251))
    d.rectangle((0, HEAD - 6, W + PANEL, HEAD), fill=accent)
    d.text((28, 26), "PLAN D'IMPLANTATION DES PRISES TERMINALES", fill=INK, font=f(40))
    d.text((28, 80), ("Fluides médicaux (O₂ / Air / Vide)" if mode == "gaz"
                      else "Courants forts & faibles (CFO / CFA)") +
           "  ·  un repère par local  ·  implantation indicative à caler sur fond DWG",
           fill=(90, 95, 102), font=f(22, False))

    XY = RDC_XY if level == "RDC" else R1_XY
    sub = canvas.crop((0, HEAD, W, H + HEAD))
    sd = ImageDraw.Draw(sub, "RGBA")
    drawn = 0
    for code, (fx, fy) in XY.items():
        r = BY.get(code)
        if not r:
            continue
        px, py = fx * W, fy * H
        if mode == "gaz":
            segs = []
            for k in ("o2", "air", "vide"):
                if r[k]:
                    lab, col = GAS[k]; segs.append((f"{lab} {r[k]}", col))
            if r["n2o"]: segs.append(("N₂O?", (150, 80, 160)))
            if r["agss"]: segs.append(("AGSS?", (150, 80, 160)))
            if not segs:
                continue
            tag(sd, px, py, code, segs, CRITCOL[r["crit"]]); drawn += 1
        else:
            segs = [(f"PC {r['pc16']}", (45, 65, 95))]
            if r["ondule"]: segs.append((f"Ond {r['ondule']}", (205, 60, 60)))
            if r["rj45"]: segs.append((f"RJ {r['rj45']}", (0, 110, 150)))
            if r["nurse"]: segs.append(("AM", (210, 120, 0)))
            if r["ded"]: segs.append((f"Déd {r['ded']}", (95, 45, 125)))
            tag(sd, px, py, code, segs, CRITCOL[r["crit"]]); drawn += 1
    canvas.paste(sub, (0, HEAD))

    # ── panneau droit ──
    d = ImageDraw.Draw(canvas, "RGBA")
    px0 = W + 28
    north(d, px0 + 30, HEAD + 40)
    d.text((px0 + 70, HEAD + 18), "LÉGENDE", fill=INK, font=f(30))
    y = HEAD + 90
    if mode == "gaz":
        items = [("Oxygène (O₂)", (0, 150, 70)), ("Air médical 3,5 bar", (0, 135, 200)),
                 ("Vide / aspiration", (95, 105, 120)), ("N₂O / AGSS — à confirmer (R-07)", (150, 80, 160))]
        notes = ["Repère = prises au bandeau de tête (lit / box)",
                 "ou bras-panneau (bloc, SSPI). H. 1,40 m bandeau.",
                 "Locaux sans gaz (admin, attente, imagerie, stock,",
                 "vestiaires) volontairement non repérés.",
                 "Vannes & alarmes de zone : voir plan de principe."]
    else:
        items = [("PC — prises normales 16A", (45, 65, 95)), ("PC ondulées / secourues", (205, 60, 60)),
                 ("RJ45 (VDI)", (0, 110, 150)), ("AM — appel malade / infirmière", (210, 120, 0)),
                 ("Déd — alim. dédiée (RX, autoclave…)", (95, 45, 125))]
        notes = ["PC 20A, BAES, terre, Wi-Fi, vidéo, contrôle d'accès :",
                 "détail dans les fiches locaux.",
                 "Bandeaux de lit (BTDL) : PC + ondulé + RJ45 + appel",
                 "malade intégrés à la tête de lit.",
                 "IT médical : Bloc, SSPI, Déchocage, Petit chir."]
    for lab, col in items:
        d.ellipse((px0, y + 2, px0 + 22, y + 24), fill=col, outline=(60, 60, 60))
        d.text((px0 + 34, y), lab, fill=INK, font=f(20, False)); y += 34
    y += 14
    d.text((px0, y), "Liseré de l'étiquette = criticité électrique", fill=INK, font=f(20)); y += 32
    for k in ("C", "E", "M", "F"):
        d.rectangle((px0, y, px0 + 30, y + 22), fill=CRITCOL[k]);
        d.text((px0 + 42, y), CRITNAME[k], fill=INK, font=f(19, False)); y += 30
    y += 16
    d.text((px0, y), "Notes", fill=INK, font=f(22)); y += 32
    for n in notes:
        d.text((px0, y), n, fill=(70, 75, 82), font=f(18, False)); y += 26
    if level == "RDC":
        y += 8
        d.text((px0, y), "Le RDC ne comporte aucune chambre maternité.", fill=(150, 60, 60), font=f(18)); y += 26
        d.text((px0, y), "Les 14 chambres sont au R+1 (plan A-02).", fill=(150, 60, 60), font=f(18, False)); y += 26

    cartouche(d, px0, H + HEAD - 215, PANEL - 56, 195, level, mode)
    d.text((px0, H + HEAD - 245), "Source : plans A-01/A-02 (180526) + fiches d'équipement FIOG.",
           fill=(120, 125, 132), font=f(15, False))

    name = f"{level}_IMPLANTATION_{'GAZ' if mode=='gaz' else 'CFO_CFA'}.png"
    canvas.save(os.path.join(OUT, name))
    print("écrit", name, "| repères:", drawn)


for level in ["RDC", "R1"]:
    for mode in ["gaz", "elec"]:
        compose(level, mode)
print("OK")
