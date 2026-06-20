#!/usr/bin/env python3
"""
Plans GÉNÉRAUX de principe — CFO/CFA & Gaz médicaux — Polyclinique Nassib.
Distribution dessinée correctement à partir du POINT DE DÉPART :
  - Source au LOCAL TECHNIQUE EXTÉRIEUR ARRIÈRE (TGBT/groupe/ASI ; centrale O₂/vide/air) ;
  - alimentation entrant par l'arrière → TRONC PRINCIPAL le long du couloir personnel ;
  - COLONNE MONTANTE vers le R+1 à la gaine de l'escalier central ;
  - ANTENNES ORTHOGONALES (à angle droit) vers chaque tableau de zone (TD) / vanne de zone.

Sortie : public/plans/generated/{RDC,R1}_{CFO_CFA,GAZ}.png
"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("PLANS_SRC", "/tmp/plans")
OUT = os.path.join(BASE, "public", "plans", "generated")
os.makedirs(OUT, exist_ok=True)

FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def f(sz, b=True): return ImageFont.truetype(FB if b else FR, sz)

INK = (28, 33, 40)
CRIT = {"C": (210, 45, 45), "E": (235, 140, 25), "M": (225, 195, 30), "F": (70, 165, 90)}
CRITNAME = {"C": "Critique", "E": "Élevé", "M": "Moyen", "F": "Faible"}

# Zones (fractions du crop bâtiment) : x0,y0,x1,y1,label,criticité
ZONES = {
    "RDC": [
        (.10, .11, .33, .30, "BLOC CÉSARIENNE · STÉRILISATION · SSPI", "C"),
        (.10, .30, .33, .92, "MATERNITÉ — Pré-travail · Travail · Infirmerie", "E"),
        (.34, .16, .49, .55, "IMAGERIE · LABORATOIRE", "E"),
        (.34, .56, .49, .92, "CONSULTATIONS · GYN · Dentaire", "E"),
        (.50, .16, .66, .55, "PHARMACIE · MAGASIN · Vestiaires", "M"),
        (.50, .56, .68, .92, "ACCUEIL · ADMIN · Caisse · Attente", "F"),
        (.68, .12, .96, .88, "URGENCES — Box · Déchocage · Petit chir · Mini-labo", "C"),
    ],
    "R1": [
        (.10, .11, .40, .92, "HOSPITALISATION MATERNITÉ — Chambres 1-14", "E"),
        (.40, .11, .52, .55, "BIBONNERIE · NÉONAT · Infirmerie", "E"),
        (.52, .11, .68, .55, "BUREAUX MÉDICAUX", "M"),
        (.40, .56, .68, .92, "ADMINISTRATION · DIRECTION · Attente", "F"),
        (.68, .11, .96, .92, "HOSPITALISATION MÉDECINE — Ch. 1-7 · HDJ · Infirmerie", "E"),
    ],
}

# Tableaux de zone (elec) : x, y, label  (point d'antenne pris sur le tronc à x)
TD = {
    "RDC": [(.215, .205, "TD\nBLOC/SSPI"), (.235, .60, "TD\nMATERNITÉ"),
            (.415, .40, "TD\nIMG/LAB"), (.45, .74, "TD\nCONSULT"),
            (.585, .42, "TD\nPHARMA"), (.60, .74, "TD\nADMIN"),
            (.86, .50, "TD URG\n+ TD IT")],
    "R1": [(.25, .58, "TD\nHOSPI MAT"), (.45, .42, "TD\nNÉONAT"),
           (.59, .40, "TD\nBUREAUX"), (.58, .70, "TD\nADMIN"),
           (.86, .55, "TD\nHOSPI MED")],
}
# Vannes de zone (gaz) : x, y, label, gaz
GZ = {
    "RDC": [(.215, .205, "Vanne\nBLOC/SSPI", "O₂·Air·Vide"), (.235, .60, "Vanne\nMATERNITÉ", "O₂·Air·Vide"),
            (.45, .74, "Vanne\nGYN", "O₂·Vide"), (.86, .50, "Vanne\nURGENCES", "O₂·Air·Vide")],
    "R1": [(.25, .58, "Vanne\nHOSPI MAT", "O₂·Vide"), (.45, .42, "Vanne\nNÉONAT", "O₂·Air·Vide"),
           (.86, .55, "Vanne\nHOSPI MED", "O₂·Vide")],
}

TRUNK_Y = {"RDC": .175, "R1": .52}      # axe du tronc principal
RISER_X = .73                            # gaine escalier central
RISER_Y = {"RDC": .46, "R1": .52}
CROP300 = (60, 720, 3960, 3120)


def base_building(level):
    src = os.path.join(SRC, "RDC300-1.png" if level == "RDC" else "R1300-1.png")
    im = Image.open(src).convert("RGB").crop(CROP300).resize((1950, 1200), Image.LANCZOS)
    return Image.blend(im, Image.new("RGB", im.size, (255, 255, 255)), 0.40)


def node(d, x, y, label, fill, tcol=(255, 255, 255), w=None, h=46):
    lines = label.split("\n")
    fnt = f(17)
    w = w or int(max(d.textlength(l, font=fnt) for l in lines) + 18)
    d.rounded_rectangle((x - w // 2, y - h // 2, x + w // 2, y + h // 2), radius=6, fill=fill, outline=INK, width=2)
    ty = y - len(lines) * 10
    for l in lines:
        d.text((x - d.textlength(l, font=fnt) / 2, ty), l, fill=tcol, font=fnt); ty += 20


def compose(level, mode):
    bld = base_building(level)
    W, H = bld.size
    PANEL, HEAD = 600, 150
    cv = Image.new("RGB", (W + PANEL, H + HEAD), (255, 255, 255))
    cv.paste(bld, (0, HEAD))
    d = ImageDraw.Draw(cv, "RGBA")
    accent = (0, 120, 90) if mode == "gaz" else (0, 63, 114)

    # bandeau titre
    d.rectangle((0, 0, W + PANEL, HEAD), fill=(247, 249, 251))
    d.rectangle((0, HEAD - 6, W + PANEL, HEAD), fill=accent)
    d.text((28, 24), "PLAN GÉNÉRAL " + ("GAZ MÉDICAUX" if mode == "gaz" else "CFO / CFA")
           + " — PRINCIPE DE DISTRIBUTION", fill=INK, font=f(38))
    d.text((28, 78), f"Polyclinique Nassib (FIOG) · Niveau {'RDC — A-01' if level=='RDC' else 'R+1 — A-02'}"
           "  ·  départ : local technique extérieur arrière  ·  colonne montante : escalier central",
           fill=(90, 95, 102), font=f(20, False))

    # ── couche plan (zones + réseau) ──
    sub = cv.crop((0, HEAD, W, H + HEAD))
    sd = ImageDraw.Draw(sub, "RGBA")
    sd._img = sub

    gas_zones_lbl = {"RDC": {"BLOC", "MATERNITÉ", "URGENCES", "GYN"}, "R1": {"HOSPI MAT", "NÉONAT", "HOSPI MED"}}
    for (x0, y0, x1, y1, label, crit) in ZONES[level]:
        col = CRIT[crit]
        bx = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
        ov = Image.new("RGBA", (bx[2] - bx[0], bx[3] - bx[1]), col + (38,))
        sub.paste(Image.alpha_composite(sub.crop(bx).convert("RGBA"), ov).convert("RGB"), (bx[0], bx[1]))
        sd.rectangle(bx, outline=col, width=3)
        sd.text((bx[0] + 8, bx[1] + 6), label, fill=INK, font=f(18))

    ty = int(TRUNK_Y[level] * H)
    rx = int(RISER_X * W)
    tcol = accent

    # tronc principal (couloir personnel)
    x_left, x_right = int(.12 * W), int(.94 * W)
    sd.line((x_left, ty, x_right, ty), fill=tcol, width=9)
    sd.text((x_left, ty - 30), "TRONC PRINCIPAL (couloir personnel)", fill=tcol, font=f(16))

    if level == "RDC":
        # source extérieure arrière + alimentation entrante
        sx, sy = int(.40 * W), int(.035 * H)
        sd.line((sx, sy + 28, sx, ty), fill=tcol, width=9)
        if mode == "gaz":
            node(sd, sx, sy, "CENTRALE GAZ MÉDICAUX (local technique arrière)\nO₂ prod.+secours bouteilles · Vide · Air médical",
                 (0, 150, 100), w=760, h=58)
        else:
            node(sd, sx, sy, "LOCAL TECHNIQUE EXTÉRIEUR ARRIÈRE\nTGBT · Groupe électrogène · Onduleur (ASI)",
                 (60, 90, 130), w=720, h=58)
        sd.text((sx + 12, sy + 30), "alimentation entrante (arrière)", fill=tcol, font=f(15))
    else:
        # arrivée par la colonne montante depuis le RDC
        node(sd, rx, int(.30 * H), "ARRIVÉE COLONNE MONTANTE\n(depuis local technique RDC)", accent, w=420, h=54)
        sd.line((rx, int(.30 * H) + 27, rx, ty), fill=tcol, width=9)

    # colonne montante (gaine escalier central)
    sd.line((rx, ty, rx, int(RISER_Y[level] * H), ), fill=tcol, width=6)
    for k in range(6):
        yy = ty + 10 + k * 12
        sd.line((rx - 11, yy, rx + 11, yy), fill=tcol, width=3)
    node(sd, rx, int(RISER_Y[level] * H), "COLONNE MONTANTE\n↑ R+1 (escalier central)" if level == "RDC"
         else "COLONNE MONTANTE\n↓ RDC", (245, 235, 0), tcol if False else INK, w=300, h=48)

    # antennes orthogonales vers TD / vannes
    items = TD[level] if mode != "gaz" else GZ[level]
    for it in items:
        tx, tyy = it[0], it[1]
        X, Y = int(tx * W), int(tyy * H)
        sd.ellipse((X - 6, ty - 6, X + 6, ty + 6), fill=tcol)      # piquage sur le tronc
        sd.line((X, ty, X, Y), fill=tcol, width=4)                  # descente verticale
        if mode == "gaz":
            node(sd, X, Y, it[2], (150, 230, 195), INK, w=190, h=46)
            sd.text((X - d.textlength(it[3], font=f(14)) / 2, Y + 26), it[3], fill=(0, 100, 80), font=f(14))
            # alarme de zone
            sd.polygon([(X + 96, Y - 8), (X + 84, Y + 10), (X + 108, Y + 10)], fill=(235, 70, 70), outline=INK)
        else:
            node(sd, X, Y, it[2], (170, 200, 240), INK, w=150, h=46)
    cv.paste(sub, (0, HEAD))

    # ── panneau droit : légende + cartouche ──
    d = ImageDraw.Draw(cv, "RGBA")
    px = W + 24
    d.text((px, HEAD + 14), "LÉGENDE", fill=INK, font=f(28))
    y = HEAD + 58
    # réseau
    d.line((px, y + 10, px + 46, y + 10), fill=accent, width=9); d.text((px + 58, y), "Tronc principal", fill=INK, font=f(18, False)); y += 30
    d.line((px + 20, y + 4, px + 20, y + 26), fill=accent, width=6)
    for k in range(3):
        d.line((px + 12, y + 8 + k * 7, px + 28, y + 8 + k * 7), fill=accent, width=2)
    d.text((px + 58, y + 4), "Colonne montante (escalier central)", fill=INK, font=f(18, False)); y += 34
    if mode == "gaz":
        d.rounded_rectangle((px, y, px + 40, y + 24), 5, fill=(0, 150, 100), outline=INK); d.text((px + 52, y + 2), "Centrale gaz (local arrière)", fill=INK, font=f(18, False)); y += 32
        d.rounded_rectangle((px, y, px + 40, y + 24), 5, fill=(150, 230, 195), outline=INK); d.text((px + 52, y + 2), "Coffret vanne de zone", fill=INK, font=f(18, False)); y += 32
        d.polygon([(px + 20, y), (px + 6, y + 24), (px + 34, y + 24)], fill=(235, 70, 70), outline=INK); d.text((px + 52, y + 2), "Alarme de zone (report soins)", fill=INK, font=f(18, False)); y += 36
        notes = ["Triple source O₂ : production + secours bouteilles",
                 "+ réserve. Centrales vide & air redondées sur",
                 "alimentation électrique secourue.",
                 "Prises terminales par local : voir plans",
                 "d'implantation + fiches locaux.",
                 "N₂O / AGSS au bloc : à confirmer (R-07)."]
    else:
        d.rounded_rectangle((px, y, px + 40, y + 24), 5, fill=(60, 90, 130), outline=INK); d.text((px + 52, y + 2), "TGBT / Groupe / ASI (local arrière)", fill=INK, font=f(18, False)); y += 32
        d.rounded_rectangle((px, y, px + 40, y + 24), 5, fill=(170, 200, 240), outline=INK); d.text((px + 52, y + 2), "Tableau divisionnaire de zone (TD)", fill=INK, font=f(18, False)); y += 36
        notes = ["Trois réseaux terminaux : Normal / Secouru",
                 "(groupe) / Ondulé (ASI).",
                 "IT médical (transfo + CPI) : Bloc, SSPI,",
                 "Déchocage, Petit chir.",
                 "CFA séparé des CFO ; SSI & appel malade",
                 "sur câblage et alimentation indépendants."]
    y += 6
    d.text((px, y), "Criticité des zones", fill=INK, font=f(19)); y += 28
    for k in ("C", "E", "M", "F"):
        d.rectangle((px, y, px + 30, y + 20), fill=CRIT[k]); d.text((px + 42, y), CRITNAME[k], fill=INK, font=f(17, False)); y += 26
    y += 8
    d.text((px, y), "Notes", fill=INK, font=f(20)); y += 28
    for n in notes:
        d.text((px, y), n, fill=(70, 75, 82), font=f(16, False)); y += 23

    # cartouche
    cx, cyy, cw, ch = px, H + HEAD - 168, PANEL - 48, 150
    d.rectangle((cx, cyy, cx + cw, cyy + ch), fill=(255, 255, 255), outline=INK, width=3)
    d.line((cx, cyy + 52, cx + cw, cyy + 52), fill=INK, width=2)
    d.text((cx + 12, cyy + 10), "POLYCLINIQUE NASSIB — FIOG", fill=INK, font=f(22))
    d.text((cx + 12, cyy + 34), "Djibouti · indice 180526", fill=(90, 95, 102), font=f(15, False))
    d.text((cx + 12, cyy + 60), ("Plan général gaz médicaux" if mode == "gaz" else "Plan général CFO / CFA")
           + f" — {'RDC' if level=='RDC' else 'R+1'}", fill=accent, font=f(18))
    d.text((cx + 12, cyy + 86), "Principe de distribution — avant-projet.", fill=INK, font=f(15, False))
    d.text((cx + 12, cyy + 108), "Ne vaut pas plan d'exécution.", fill=(150, 60, 60), font=f(15, False))

    name = f"{level}_{'GAZ' if mode=='gaz' else 'CFO_CFA'}.png"
    cv.save(os.path.join(OUT, name))
    print("écrit", name)


for level in ["RDC", "R1"]:
    for mode in ["elec", "gaz"]:
        compose(level, mode)
print("OK")
