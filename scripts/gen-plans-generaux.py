#!/usr/bin/env python3
"""
Génère les plans généraux CFO/CFA et Gaz médicaux en overlay sur le plan 2D réel.
Source : rendus PNG des plans architecte RDC (A-01) et R+1 (A-02), Polyclinique Nassib.
Sortie : public/plans/generated/{RDC,R1}_{CFO_CFA,GAZ}.png

Zonage indicatif de principe (avant-projet). Le détail terminal local-par-local
est porté par les fiches locaux. Positions exactes à figer par les BE en exécution.
"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("PLANS_SRC", "/tmp/plans")
OUT = os.path.join(BASE, "public", "plans", "generated")
os.makedirs(OUT, exist_ok=True)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz, bold=False): return ImageFont.truetype(FONTB if bold else FONT, sz)

# Couleurs criticité (RGBA fill, outline)
CRIT = {
    "C": ((220, 40, 40), "Critique"),
    "E": ((240, 140, 20), "Élevé"),
    "M": ((235, 205, 30), "Moyen"),
    "F": ((70, 170, 90), "Faible"),
}

# Zones par niveau : (x0,y0,x1,y1 en fraction du crop bâtiment, label, criticité)
ZONES = {
    "RDC": [
        (.10, .11, .33, .30, "BLOC CÉSARIENNE\nSTÉRILISATION · SSPI", "C"),
        (.10, .30, .33, .92, "MATERNITÉ\nPré-travail · Travail · Infirmerie · Accueil", "E"),
        (.34, .16, .49, .55, "IMAGERIE\nLABORATOIRE", "E"),
        (.34, .56, .49, .92, "CONSULTATIONS · GYN\nDentaire", "E"),
        (.50, .16, .66, .55, "PHARMACIE · MAGASIN\nVestiaires", "M"),
        (.50, .56, .66, .92, "ACCUEIL · ADMIN\nCaisse · Salle d'attente", "F"),
        (.68, .12, .96, .88, "URGENCES\nBox 1-4 · Déchocage · Petit chir · Mini-labo", "C"),
    ],
    "R1": [
        (.10, .11, .40, .92, "HOSPITALISATION MATERNITÉ\nChambres 1-14 (post-partum)", "E"),
        (.40, .11, .52, .55, "BIBONNERIE · NÉONAT\nInfirmerie", "E"),
        (.52, .11, .66, .55, "BUREAUX MÉDICAUX", "M"),
        (.40, .56, .66, .92, "ADMINISTRATION · DIRECTION\nSalle d'attente", "F"),
        (.68, .11, .96, .92, "HOSPITALISATION MÉDECINE\nChambres 1-7 · Hôpital de jour · Infirmerie", "E"),
    ],
}

# Tableaux divisionnaires (elec) : noeud (fx,fy,label) par zone
TD = {
    "RDC": [
        (.215, .205, "TD-BLOC\nIT médical"),
        (.215, .60, "TD-MAT"),
        (.415, .35, "TD-IMG/LAB"),
        (.415, .74, "TD-CONS"),
        (.58, .35, "TD-PHAR"),
        (.58, .74, "TD-ADM"),
        (.82, .50, "TD-URG\n+ TD-IT"),
    ],
    "R1": [
        (.25, .50, "TD-HOSPI MAT"),
        (.46, .33, "TD-NÉO/INF"),
        (.59, .33, "TD-BUR"),
        (.53, .74, "TD-ADMIN"),
        (.82, .50, "TD-HOSPI MED"),
    ],
}

# Vannes de zone gaz : (fx,fy,label, gaz) — seulement zones desservies
GAZ_ZONES = {
    "RDC": [
        (.215, .205, "Vanne Bloc/SSPI", "O₂·Air·Vide (+N₂O/AGSS ?)"),
        (.215, .58, "Vanne Maternité", "O₂·Air·Vide"),
        (.40, .70, "Vanne GYN", "O₂·Vide"),
        (.70, .50, "Vanne Urgences", "O₂·Air·Vide"),
    ],
    "R1": [
        (.25, .50, "Vanne Hospi Mat.", "O₂·Vide"),
        (.46, .33, "Vanne Néonat", "O₂·Air·Vide"),
        (.82, .50, "Vanne Hospi Méd.", "O₂·Vide"),
    ],
}

CROP = (30, 360, 1980, 1560)  # emprise bâtiment dans le rendu 150 dpi


def base_building(level):
    # base nette 300 dpi ramenée à l'échelle des coordonnées (≈1950 px) → texte net
    src = os.path.join(SRC, "RDC300-1.png" if level == "RDC" else "R1300-1.png")
    im = Image.open(src).convert("RGB").crop((60, 720, 3960, 3120))
    im = im.resize((1950, 1200), Image.LANCZOS)
    white = Image.new("RGB", im.size, (255, 255, 255))
    im = Image.blend(im, white, 0.42)
    return im


def draw_zones(draw, W, H, zones, mode):
    for (x0, y0, x1, y1, label, crit) in zones:
        col, _ = CRIT[crit]
        bx = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
        # remplissage translucide
        overlay = Image.new("RGBA", (bx[2] - bx[0], bx[3] - bx[1]), col + (55,))
        draw._image.paste(overlay, (bx[0], bx[1]), overlay)
        draw.rectangle(bx, outline=col, width=4)
        # étiquette
        lines = label.split("\n")
        ty = bx[1] + 6
        for i, ln in enumerate(lines):
            fnt = f(20, bold=(i == 0))
            draw.text((bx[0] + 8, ty), ln, fill=(20, 20, 20), font=fnt)
            ty += 24 if i == 0 else 20


def node(draw, x, y, label, color, shape="box"):
    r = 9
    if shape == "box":
        draw.rectangle((x - r, y - r, x + r, y + r), fill=color, outline=(0, 0, 0), width=2)
    elif shape == "tri":
        draw.polygon([(x, y - r - 2), (x - r, y + r), (x + r, y + r)], fill=color, outline=(0, 0, 0))
    else:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=color, outline=(0, 0, 0), width=2)
    for i, ln in enumerate(label.split("\n")):
        draw.text((x + r + 4, y - r + i * 16), ln, fill=(0, 0, 0), font=f(15, bold=(i == 0)))


def compose(level, mode):
    bld = base_building(level)
    W, H = bld.size
    PANEL = 560
    HEAD = 96
    canvas = Image.new("RGB", (W + PANEL, H + HEAD), (255, 255, 255))
    canvas.paste(bld, (0, HEAD))
    draw = ImageDraw.Draw(canvas, "RGBA")
    draw._image = canvas

    # bandeau titre
    head_col = (0, 63, 114) if mode == "elec" else (0, 120, 90)
    draw.rectangle((0, 0, W + PANEL, HEAD), fill=head_col)
    title = ("PLAN GÉNÉRAL CFO / CFA — PRINCIPE DE DISTRIBUTION"
             if mode == "elec" else
             "PLAN GÉNÉRAL GAZ MÉDICAUX — PRINCIPE DE DISTRIBUTION")
    draw.text((20, 16), title, fill=(255, 255, 255), font=f(30, bold=True))
    draw.text((20, 58), f"Polyclinique Nassib — Fondation Ismail Omar Guelleh | "
                        f"Niveau {'RDC (A-01)' if level=='RDC' else 'R+1 (A-02)'} | "
                        f"Zonage indicatif de principe — avant-projet",
              fill=(220, 230, 240), font=f(17))

    # zones criticité
    draw2 = ImageDraw.Draw(canvas, "RGBA"); draw2._image = canvas
    # on doit redessiner avec offset vertical HEAD : on translate via image partielle
    sub = canvas.crop((0, HEAD, W, H + HEAD))
    sd = ImageDraw.Draw(sub, "RGBA"); sd._image = sub
    draw_zones(sd, W, H, ZONES[level], mode)

    # noeud source/colonne montante (au niveau bâtiment)
    stair = (int(.605 * W), int(.66 * H))  # cage escalier/ascenseur centrale
    if mode == "elec":
        # TGBT (rear) -> colonne -> TD
        tgbt = (int(.50 * W), int(.04 * H))
        node(sd, *tgbt, "TGBT · Groupe · ASI\n(local technique — R-02/R-08)", (255, 230, 0), "box")
        node(sd, *stair, "Colonne montante\nCFO/CFA", (0, 63, 114), "circle")
        sd.line([tgbt, stair], fill=(0, 63, 114), width=4)
        for (fx, fy, lab) in TD[level]:
            p = (int(fx * W), int(fy * H))
            sd.line([stair, p], fill=(0, 63, 114), width=3)
            node(sd, *p, lab, (120, 180, 255), "box")
    else:
        src = (int(.50 * W), int(.04 * H))
        node(sd, *src, "CENTRALE GAZ MÉDICAUX\nO₂ (prod.+secours) · Vide · Air\n(local technique — R-05)",
             (0, 170, 120), "box")
        node(sd, *stair, "Colonne montante\ngaz médicaux", (0, 120, 90), "circle")
        sd.line([src, stair], fill=(0, 120, 90), width=5)
        for (fx, fy, lab, gaz) in GAZ_ZONES[level]:
            p = (int(fx * W), int(fy * H))
            sd.line([stair, p], fill=(0, 120, 90), width=3)
            node(sd, *p, lab + "\n" + gaz, (140, 235, 200), "box")
            # alarme de zone
            sd.polygon([(p[0], p[1] - 22), (p[0] - 9, p[1] - 6), (p[0] + 9, p[1] - 6)],
                       fill=(255, 80, 80), outline=(0, 0, 0))
    canvas.paste(sub, (0, HEAD))

    # panneau légende à droite
    px = W + 16
    d = ImageDraw.Draw(canvas)
    d.text((px, HEAD + 14), "LÉGENDE", fill=(0, 0, 0), font=f(24, bold=True))
    y = HEAD + 54
    d.text((px, y), "Criticité électrique des zones :", fill=(0, 0, 0), font=f(17, bold=True)); y += 28
    for k in ["C", "E", "M", "F"]:
        col, name = CRIT[k]
        d.rectangle((px, y, px + 26, y + 18), fill=col + (90,) if False else col, outline=(0, 0, 0))
        d.text((px + 34, y), {"C": "Critique — IT médical + secouru + ondulé",
                              "E": "Élevé — secouru groupe + ondulé partiel",
                              "M": "Moyen — normal + secours ponctuel",
                              "F": "Faible — réseau normal"}[k], fill=(0, 0, 0), font=f(15)); y += 30
    y += 10
    if mode == "elec":
        items = [
            ((255, 230, 0), "box", "TGBT / Groupe électrogène / Onduleur (ASI)"),
            ((0, 63, 114), "circle", "Colonne montante CFO/CFA (gaine technique)"),
            ((120, 180, 255), "box", "Tableau divisionnaire de zone (TD)"),
        ]
        notes = [
            "Trois réseaux terminaux : Normal (blanc),",
            "Secouru (rouge), Ondulé (vert).",
            "IT médical (transfo isolement + CPI) :",
            "Bloc, SSPI, Déchocage, Petit chir.",
            "CFA séparé des CFO ; appel malade et SSI",
            "sur câblage/alim. indépendants.",
            "",
            "Réserves : local TGBT (R-02), gaine",
            "verticale (R-03), baie CFA (R-04),",
            "groupe + ASI (R-08), SSI (R-09).",
        ]
    else:
        items = [
            ((0, 170, 120), "box", "Centrale gaz : O₂ (prod.+secours+réserve),"),
            ((0, 170, 120), "none", "    centrale vide, centrale air médical"),
            ((0, 120, 90), "circle", "Colonne montante gaz médicaux"),
            ((140, 235, 200), "box", "Coffret vanne de sectionnement de zone"),
            ((255, 80, 80), "tri", "Alarme de zone (report poste de soins)"),
        ]
        notes = [
            "Prises terminales par local (O₂/Air/Vide) :",
            "voir fiches locaux room-by-room.",
            "N₂O + AGSS au Bloc : à confirmer selon",
            "protocole anesthésique (R-07).",
            "Pas de gaz dans admin / attente / stock /",
            "vestiaires (anti-suréquipement).",
            "",
            "Réserves : local technique gaz (R-05),",
            "distance source↔consommateurs (R-06),",
            "gaine verticale (R-03).",
        ]
    for it in items:
        col, shape, txt = it
        if shape == "box":
            d.rectangle((px, y, px + 18, y + 18), fill=col, outline=(0, 0, 0), width=2)
        elif shape == "circle":
            d.ellipse((px, y, px + 18, y + 18), fill=col, outline=(0, 0, 0), width=2)
        elif shape == "tri":
            d.polygon([(px + 9, y), (px, y + 18), (px + 18, y + 18)], fill=col, outline=(0, 0, 0))
        d.text((px + 26, y), txt, fill=(0, 0, 0), font=f(15)); y += 28
    y += 8
    d.text((px, y), "Notes :", fill=(0, 0, 0), font=f(17, bold=True)); y += 26
    for n in notes:
        d.text((px, y), n, fill=(40, 40, 40), font=f(14)); y += 20

    # cartouche bas panneau
    d.text((px, H + HEAD - 70), "Source : plans A-01/A-02 (180526) + fiches FIOG.",
           fill=(90, 90, 90), font=f(13))
    d.text((px, H + HEAD - 52), "Document de conception — ne vaut pas plan d'exécution.",
           fill=(90, 90, 90), font=f(13))
    d.text((px, H + HEAD - 34), "K'BIO / FIOG — Polyclinique Nassib, Djibouti.",
           fill=(90, 90, 90), font=f(13))

    name = f"{level}_{'CFO_CFA' if mode=='elec' else 'GAZ'}.png"
    canvas.save(os.path.join(OUT, name))
    print("écrit", os.path.join(OUT, name))


for level in ["RDC", "R1"]:
    for mode in ["elec", "gaz"]:
        compose(level, mode)
print("OK")
