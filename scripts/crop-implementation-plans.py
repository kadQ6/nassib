#!/usr/bin/env python3
"""Découpe les captures plans K'BIO 180526 en PNG par local."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "public" / "plans" / "_sources"
OUT = ROOT / "public" / "plans" / "implantation"

# (source, layout, panels) — layout: full | grid_3x2 | row | row_bounds
MANIFEST: list[tuple[str, str, list[tuple[str, str, int | None]]]] = [
    (
        "KBIO-DJI-SRC-URGENCES-BOXES.png",
        "grid_3x2",
        [
            ("BOX-01", "Box 1", 0),
            ("BOX-02", "Box 2", 1),
            ("BOX-03", "Box 3", 2),
            ("BOX-04", "Box 4", 3),
            ("DECH-01", "Déchocage", 4),
            ("PCH-01", "Petit Chir", 5),
        ],
    ),
    (
        "KBIO-DJI-SRC-URGENCES-SUPPORT.png",
        "row",
        [
            ("BUR-URG1", "Bureau URG 1", 0),
            ("MLAB-01", "Mini-Labo", 1),
            ("INF-URG", "Infirmerie urgences", 2),
            ("BUR-URG2", "Bureau URG 2", 3),
            ("STK-URG", "Stock urgences", 4),
        ],
    ),
    (
        "KBIO-DJI-SRC-SAS-URG.png",
        "full",
        [("SAS-URG", "Sas Accueil urgences", None)],
    ),
    (
        "KBIO-DJI-SRC-IMAGERIE.png",
        "row",
        [
            ("SAS-IMG", "Sas Patient", 0),
            ("IMG-01", "Salle de radiologie", 1),
        ],
    ),
    (
        "KBIO-DJI-SRC-CONSULTATIONS-SUPPORT.png",
        "row",
        [
            ("BCS-01", "Bureau CS 1", 0),
            ("VES-H", "Vestiaire H", 1),
            ("MAG-01", "Magasin", 2),
            ("PHA-01", "Pharmacie", 3),
            ("VES-F", "Vestiaire F", 4),
        ],
    ),
    (
        "KBIO-DJI-SRC-CONSULTATIONS-CS-GYN.png",
        "row",
        [
            ("BCS-02", "Bureau CS 2", 0),
            ("DEN-01", "Dentaire", 1),
            ("BCS-03", "Bureau CS 3", 2),
            ("BGYN-01", "Bureau GYN 1", 3),
            ("BGYN-02", "Bureau GYN 2", 4),
            ("BCS-04", "Bureau CS 4", 5),
        ],
    ),
    (
        "KBIO-DJI-SRC-MATERNITE-TRAVAIL.png",
        "row",
        [
            ("PRE-01", "Pré-travail", 0),
            ("TRV-01", "Salle travail", 1),
            ("INF-MAT", "Infirmerie maternité", 2),
        ],
    ),
    (
        "KBIO-DJI-SRC-BUREAU-MAT.png",
        "row",
        [
            ("BMAT-01", "Bureau Mat 1", 0),
            ("BMAT-02", "Bureau Mat 2", 1),
        ],
    ),
    (
        "KBIO-DJI-SRC-BLOC-REVEIL.png",
        "row",
        [
            ("BLC-01", "Bloc césarienne", 0),
            ("REV-01", "Salle réveil", 1),
        ],
    ),
    (
        "KBIO-DJI-SRC-MATERNITE-CHAMBRES-A.png",
        "row",
        [
            ("MAT-01", "Chambre maternité type 1-8", 0),
            ("BIB-01", "Biberonnerie & soin bébé", 1),
            ("MAT-09", "Chambre maternité 9", 2),
            ("MAT-11", "Chambre maternité 11", 3),
            ("MAT-10", "Chambre maternité 10", 4),
        ],
    ),
    (
        "KBIO-DJI-SRC-MATERNITE-ADMIN-R1.png",
        "row_bounds",
        [
            ("MAT-12", "Chambre maternité 12", 0),
            ("MAT-13", "Chambre maternité 13", 1),
            ("MAT-14", "Chambre maternité 14", 2),
            ("BUR-R1-1", "Bureau adm 1", 3),
            ("ATT-R1", "Salle d'attente / Bureau Direct", 4),
            ("ADM-R1", "Bureau admin 2", 5),
        ],
    ),
    (
        "KBIO-DJI-SRC-HOSPITALISATION-R1.png",
        "row",
        [
            ("HOS-01", "Chambre Med type A", 0),
            ("HOS-02", "Chambre Med type B", 1),
            ("HOS-07", "Chambre Med 7", 2),
            ("HDJ-01", "Hospitalisation de jour", 3),
        ],
    ),
]

# Limites pixel validées (planches à panneaux inégaux)
ROW_BOUNDS: dict[str, list[tuple[int, int]]] = {
    "KBIO-DJI-SRC-URGENCES-SUPPORT.png": [
        (18, 227),
        (227, 390),
        (390, 662),
        (662, 814),
        (846, 1024),
    ],
    "KBIO-DJI-SRC-IMAGERIE.png": [
        (40, 390),
        (390, 960),
    ],
    "KBIO-DJI-SRC-CONSULTATIONS-SUPPORT.png": [
        (36, 128),
        (128, 201),
        (201, 366),
        (366, 611),
        (708, 1024),
    ],
    "KBIO-DJI-SRC-CONSULTATIONS-CS-GYN.png": [
        (34, 130),
        (130, 368),
        (384, 518),
        (518, 642),
        (642, 767),
        (885, 1024),
    ],
    "KBIO-DJI-SRC-MATERNITE-TRAVAIL.png": [
        (40, 295),
        (359, 591),
        (678, 1024),
    ],
    "KBIO-DJI-SRC-BUREAU-MAT.png": [
        (60, 478),
        (478, 1024),
    ],
    "KBIO-DJI-SRC-BLOC-REVEIL.png": [
        (136, 676),
        (676, 1024),
    ],
    "KBIO-DJI-SRC-MATERNITE-CHAMBRES-A.png": [
        (29, 197),
        (197, 593),
        (593, 835),
        (835, 932),
        (932, 1024),
    ],
    "KBIO-DJI-SRC-MATERNITE-ADMIN-R1.png": [
        (38, 165),
        (168, 288),
        (296, 420),
        (424, 536),
        (544, 683),
        (773, 936),
    ],
    "KBIO-DJI-SRC-HOSPITALISATION-R1.png": [
        (30, 201),
        (236, 406),
        (465, 686),
        (816, 1024),
    ],
}

ALIASES: dict[str, str] = {
    **{f"PRE-{n:02d}": "PRE-01" for n in range(2, 4)},
    **{f"TRV-{n:02d}": "TRV-01" for n in range(2, 4)},
    **{f"MAT-{n:02d}": "MAT-01" for n in range(2, 9)},
    "HOS-04": "HOS-01",
    "HOS-06": "HOS-01",
    "HOS-03": "HOS-02",
    "HOS-05": "HOS-02",
    # Validés session Kader — lot 1 admin RDC
    "ADM-01": "BUR-R1-1",
    "ATT-01": "ATT-R1",
    # Lot 2 — admin & bureaux R+1
    "INF-R1": "INF-MAT",
    "BUR-R1-2": "BUR-R1-1",
    "BUR-R1-3": "BUR-R1-1",
    "BUR-R1-4": "BUR-R1-1",
    "BUR-R1-5": "BUR-R1-1",
}


def column_density(img: Image.Image) -> np.ndarray:
    arr = np.array(img.convert("L"))
    return (arr < 240).mean(axis=0)


def smooth(values: np.ndarray, window: int = 15) -> np.ndarray:
    kernel = np.ones(window) / window
    return np.convolve(values, kernel, mode="same")


def split_range(
    density: np.ndarray,
    left: int,
    right: int,
    parts: int,
    min_width: int,
) -> list[tuple[int, int]]:
    if parts <= 1:
        return [(left, right)]

    best_score = float("inf")
    best_split = left + (right - left) // 2

    for x in range(left + min_width, right - min_width):
        score = float(smooth(density)[x])
        if score < best_score:
            best_score = score
            best_split = x

    left_parts = parts // 2
    right_parts = parts - left_parts
    left_width = best_split - left
    right_width = right - best_split
    left_min = max(min_width, left_width // (left_parts * 2))
    right_min = max(min_width, right_width // (right_parts * 2))

    return split_range(density, left, best_split, left_parts, left_min) + split_range(
        density, best_split, right, right_parts, right_min
    )


def detect_row_bounds(img: Image.Image, panel_count: int) -> list[tuple[int, int]]:
    w, _ = img.size
    density = column_density(img)
    margin = max(20, w // 40)
    min_width = max(40, w // (panel_count * 3))
    return split_range(density, margin, w - margin, panel_count, min_width)


def crop_bounds(img: Image.Image, left: int, right: int) -> Image.Image:
    return img.crop((left, 0, right, img.size[1]))


def crop_grid_3x2(img: Image.Image, index: int) -> Image.Image:
    w, h = img.size
    cols, rows = 3, 2
    col = index % cols
    row = index // cols
    col_w = w // cols
    row_h = h // rows
    left = col * col_w
    right = w if col == cols - 1 else (col + 1) * col_w
    top = row * row_h
    bottom = h if row == rows - 1 else (row + 1) * row_h
    return img.crop((left, top, right, bottom))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    registry: dict[str, tuple[str, str]] = {}

    for filename, layout, panels in MANIFEST:
        src_path = SOURCES / filename
        if not src_path.exists():
            print(f"SKIP missing: {filename}")
            continue

        img = Image.open(src_path)

        if layout == "full":
            bounds = [(0, img.size[0])]
        elif layout == "grid_3x2":
            bounds = []
        elif layout in ("row", "row_bounds"):
            bounds = ROW_BOUNDS.get(filename) or detect_row_bounds(img, len(panels))
        else:
            raise ValueError(layout)

        for room_code, title, idx in panels:
            if layout == "full":
                crop = img.copy()
            elif layout == "grid_3x2":
                crop = crop_grid_3x2(img, int(idx))
            else:
                slot = int(idx) if idx is not None else 0
                left, right = bounds[slot]
                crop = crop_bounds(img, left, right)

            out_name = f"KBIO-DJI-PLAN-{room_code}.png"
            crop.save(OUT / out_name)
            registry[room_code] = (out_name, title)
            b = bounds[int(idx)] if layout in ("row", "row_bounds") and idx is not None else "-"
            print(f"OK {room_code} <- {filename} {crop.size} bounds={b}")

    for alias, target in ALIASES.items():
        if target in registry:
            src = OUT / registry[target][0]
            dst_name = f"KBIO-DJI-PLAN-{alias}.png"
            Image.open(src).save(OUT / dst_name)
            registry[alias] = (dst_name, registry[target][1])
            print(f"ALIAS {alias} <- {target}")

    ts_path = ROOT / "src" / "lib" / "room-sheet" / "implementation-plan-images.ts"
    lines = [
        "/** Référence visuelle K'BIO — plans équipements 180526 (12 planches source). */",
        "",
        "export type ImplementationPlanImage = {",
        "  src: string;",
        "  alt: string;",
        "  title: string;",
        "};",
        "",
        "const ROOM_PLAN_FILES: Record<string, { file: string; title: string }> = {",
    ]
    for code in sorted(registry.keys()):
        fname, title = registry[code]
        lines.append(f'  "{code}": {{ file: "{fname}", title: "{title}" }},')
    lines += [
        "};",
        "",
        "export function resolveImplementationPlanImage(",
        "  roomCode: string,",
        "): ImplementationPlanImage | null {",
        "  const entry = ROOM_PLAN_FILES[roomCode];",
        "  if (!entry) return null;",
        "",
        "  return {",
        "    src: `/plans/implantation/${entry.file}`,",
        "    alt: `Plan d'implantation ${entry.title} — Polyclinique Nassib`,",
        "    title: entry.title,",
        "  };",
        "}",
        "",
        "export function countImplementationPlans(): number {",
        "  return Object.keys(ROOM_PLAN_FILES).length;",
        "}",
        "",
        "export const IMPLEMENTATION_PLAN_SOURCE_SHEETS = [",
        '  "URGENCES-BOXES",',
        '  "URGENCES-SUPPORT",',
        '  "SAS-URG",',
        '  "IMAGERIE",',
        '  "CONSULTATIONS-SUPPORT",',
        '  "CONSULTATIONS-CS-GYN",',
        '  "MATERNITE-TRAVAIL",',
        '  "BUREAU-MAT",',
        '  "BLOC-REVEIL",',
        '  "MATERNITE-ADMIN-R1",',
        '  "HOSPITALISATION-R1",',
        "] as const;",
        "",
    ]
    ts_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n{len(registry)} plans -> {ts_path}")


if __name__ == "__main__":
    main()
