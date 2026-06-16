"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Plus,
  X,
  ShieldAlert,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Types ────────────────────────────────────────────────────────────────────

type Categorie =
  | "Délai"
  | "Technique"
  | "Coût"
  | "Documentation"
  | "Administratif"
  | "Sécurité";

type Statut = "identifié" | "en_cours" | "atténué" | "clos";

type Niveau = "Faible" | "Moyen" | "Élevé" | "Critique";

interface Risque {
  id: string;
  title: string;
  categorie: Categorie;
  proba: number;
  impact: number;
  score: number;
  responsable: string;
  statut: Statut;
  planAction: string;
  description: string;
}

interface NewRisqueForm {
  title: string;
  categorie: Categorie | "";
  proba: string;
  impact: string;
  description: string;
  responsable: string;
  planAction: string;
  statut: Statut | "";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RISQUES: Risque[] = [
  {
    id: "R1",
    title: "Retard livraison CTA (CVC)",
    categorie: "Délai",
    proba: 4,
    impact: 5,
    score: 20,
    responsable: "A. Hamdani",
    statut: "en_cours",
    planAction:
      "Relance urgente fournisseur. Alternative fournisseur identifiée. Commande de substitution en attente.",
    description:
      "La centrale de traitement d'air (CTA) du bloc opératoire est en retard de 6 semaines. Impact direct sur la réception.",
  },
  {
    id: "R2",
    title: "Fermeture faux plafond avant validation MEP",
    categorie: "Technique",
    proba: 3,
    impact: 5,
    score: 15,
    responsable: "M. Farid",
    statut: "identifié",
    planAction:
      "Interdiction de fermeture sans validation écrite du coordinateur MEP et validation PV essais.",
    description:
      "Risque de fermer les faux plafonds avant validation des réseaux intégrés (CVC, CFO, fluides).",
  },
  {
    id: "R3",
    title: "Absence plans exec fluides médicaux",
    categorie: "Technique",
    proba: 3,
    impact: 4,
    score: 12,
    responsable: "S. Benali",
    statut: "en_cours",
    planAction:
      "Mise en demeure transmise. Réunion technique prévue le 20/06/2026.",
    description:
      "Les plans d'exécution des fluides médicaux (O2, vide, air médical) n'ont pas été soumis pour approbation.",
  },
  {
    id: "R4",
    title: "Essais réalisés trop tard pour réception",
    categorie: "Délai",
    proba: 4,
    impact: 4,
    score: 16,
    responsable: "M. Farid",
    statut: "en_cours",
    planAction:
      "Planning essais intégré au planning général. Jalons essais ajoutés comme points bloquants.",
    description:
      "Les essais et vérifications des systèmes (CVC, fluides, électricité) risquent d'être repoussés et de bloquer la réception.",
  },
  {
    id: "R5",
    title: "DOE incomplet à la réception",
    categorie: "Documentation",
    proba: 3,
    impact: 3,
    score: 9,
    responsable: "M. Benali",
    statut: "identifié",
    planAction:
      "Check-list DOE mise en place. Relances mensuelles aux entreprises.",
    description:
      "Le dossier des ouvrages exécutés (DOE) risque d'être incomplet lors de la réception provisoire.",
  },
  {
    id: "R6",
    title: "Paiement sans preuve d'avancement",
    categorie: "Coût",
    proba: 2,
    impact: 4,
    score: 8,
    responsable: "M. Benali",
    statut: "atténué",
    planAction:
      "Système de validation avancement par constat contradictoire mis en place. Paiements conditionnés à PV.",
    description:
      "Risque de valider des situations de travaux sans vérification réelle de l'avancement sur chantier.",
  },
  {
    id: "R7",
    title: "Réception équip. bioméd sans prérequis",
    categorie: "Technique",
    proba: 4,
    impact: 4,
    score: 16,
    responsable: "M. Farid",
    statut: "identifié",
    planAction:
      "Check-list prérequis biomédicaux établie. Coordination avec fournisseurs biomédicaux.",
    description:
      "Les équipements biomédicaux risquent d'être réceptionnés avant que les prérequis techniques soient en place (fluides, électricité, CVC).",
  },
  {
    id: "R8",
    title: "Retard approbation plans exécution",
    categorie: "Administratif",
    proba: 3,
    impact: 3,
    score: 9,
    responsable: "Mme Ouali",
    statut: "en_cours",
    planAction:
      "Circuit d'approbation digitalisé. Délai max 10 jours ouvrés. Relance automatique.",
    description:
      "Les délais d'approbation des plans d'exécution par l'architecte et le BET sont trop longs.",
  },
];

const CATEGORIES: Categorie[] = [
  "Délai",
  "Technique",
  "Coût",
  "Documentation",
  "Administratif",
  "Sécurité",
];
const STATUTS: Statut[] = ["identifié", "en_cours", "atténué", "clos"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNiveau(score: number): Niveau {
  if (score <= 4) return "Faible";
  if (score <= 9) return "Moyen";
  if (score <= 14) return "Élevé";
  return "Critique";
}

function getCellColorClass(score: number): string {
  if (score <= 4) return "bg-green-100 text-green-800";
  if (score <= 9) return "bg-yellow-100 text-yellow-800";
  if (score <= 14) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

function getNiveauBadgeVariant(
  niveau: Niveau
): "success" | "warning" | "default" | "destructive" {
  if (niveau === "Faible") return "success";
  if (niveau === "Moyen") return "warning";
  if (niveau === "Élevé") return "default";
  return "destructive";
}

function getStatutBadgeVariant(
  statut: Statut
): "info" | "default" | "success" | "secondary" {
  if (statut === "identifié") return "info";
  if (statut === "en_cours") return "default";
  if (statut === "atténué") return "success";
  return "secondary";
}

function getStatutLabel(statut: Statut): string {
  const map: Record<Statut, string> = {
    identifié: "Identifié",
    en_cours: "En cours",
    atténué: "Atténué",
    clos: "Clos",
  };
  return map[statut];
}

function getCategorieBadgeVariant(
  cat: Categorie
): "default" | "secondary" | "info" | "warning" | "destructive" | "outline" {
  const map: Record<
    Categorie,
    "default" | "secondary" | "info" | "warning" | "destructive" | "outline"
  > = {
    Délai: "destructive",
    Technique: "default",
    Coût: "warning",
    Documentation: "secondary",
    Administratif: "outline",
    Sécurité: "info",
  };
  return map[cat];
}

function getRiskDotColor(score: number): string {
  if (score <= 4) return "bg-green-500";
  if (score <= 9) return "bg-yellow-500";
  if (score <= 14) return "bg-orange-500";
  return "bg-red-500";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

function StatCard({
  title,
  value,
  icon,
  colorClass,
  bgClass,
}: StatCardProps) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RiskMatrixProps {
  risques: Risque[];
}

function RiskMatrix({ risques }: RiskMatrixProps) {
  const impactLevels = [5, 4, 3, 2, 1];
  const probaLevels = [1, 2, 3, 4, 5];

  const impactLabels: Record<number, string> = {
    5: "Très fort (5)",
    4: "Fort (4)",
    3: "Modéré (3)",
    2: "Faible (2)",
    1: "Très faible (1)",
  };

  const probaLabels: Record<number, string> = {
    1: "Très faible (1)",
    2: "Faible (2)",
    3: "Modéré (3)",
    4: "Fort (4)",
    5: "Très probable (5)",
  };

  const getRisksAtCell = (proba: number, impact: number): Risque[] =>
    risques.filter((r) => r.proba === proba && r.impact === impact);

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          Matrice des Risques
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-2">
        <div className="flex gap-3 items-start overflow-x-auto">
          {/* Vertical Impact label */}
          <div className="flex items-center justify-center flex-shrink-0" style={{ minWidth: 20 }}>
            <span
              className="text-xs font-semibold text-slate-500 tracking-widest"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              IMPACT
            </span>
          </div>

          <div className="flex flex-col gap-1 flex-shrink-0">
            {/* Matrix rows + row labels */}
            <div className="flex gap-1">
              {/* Grid */}
              <div className="flex flex-col gap-1">
                {impactLevels.map((impact) => (
                  <div key={impact} className="flex gap-1">
                    {probaLevels.map((proba) => {
                      const score = proba * impact;
                      const cellColor = getCellColorClass(score);
                      const cellRisks = getRisksAtCell(proba, impact);
                      return (
                        <div
                          key={proba}
                          className={`w-16 h-14 rounded flex flex-col items-center justify-center gap-0.5 border border-white/60 ${cellColor}`}
                        >
                          <span className="text-xs font-bold opacity-70">
                            {score}
                          </span>
                          {cellRisks.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 justify-center">
                              {cellRisks.map((r) => (
                                <TooltipProvider
                                  key={r.id}
                                  delayDuration={100}
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center cursor-pointer text-white ${getRiskDotColor(r.score)}`}
                                        style={{
                                          fontSize: "0.45rem",
                                          fontWeight: 700,
                                        }}
                                      >
                                        {r.id}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="max-w-xs"
                                    >
                                      <p className="font-semibold">
                                        {r.id} – {r.title}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {r.responsable}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Row labels (impact level labels on right) */}
              <div className="flex flex-col gap-1 ml-2">
                {impactLevels.map((impact) => (
                  <div key={impact} className="h-14 flex items-center">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {impactLabels[impact]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column labels (proba) below matrix */}
            <div className="flex gap-1 mt-1">
              {probaLevels.map((proba) => (
                <div
                  key={proba}
                  className="w-16 flex items-center justify-center"
                >
                  <span className="text-xs text-slate-500 text-center leading-tight">
                    {probaLabels[proba]}
                  </span>
                </div>
              ))}
            </div>

            {/* Probabilité label */}
            <div className="flex justify-center mt-1">
              <span className="text-xs font-semibold text-slate-500 tracking-widest">
                PROBABILITÉ
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
          {[
            {
              label: "Faible (1–4)",
              bg: "bg-green-100",
              text: "text-green-800",
              dot: "bg-green-400",
            },
            {
              label: "Moyen (5–9)",
              bg: "bg-yellow-100",
              text: "text-yellow-800",
              dot: "bg-yellow-400",
            },
            {
              label: "Élevé (10–14)",
              bg: "bg-orange-100",
              text: "text-orange-800",
              dot: "bg-orange-400",
            },
            {
              label: "Critique (15–25)",
              bg: "bg-red-100",
              text: "text-red-800",
              dot: "bg-red-500",
            },
          ].map(({ label, bg, text, dot }) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              {label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RiskProfileGaugeProps {
  risques: Risque[];
}

function RiskProfileGauge({ risques }: RiskProfileGaugeProps) {
  const critiques = risques.filter((r) => r.score >= 15).length;
  const eleves = risques.filter((r) => r.score >= 10 && r.score <= 14).length;
  const moyens = risques.filter((r) => r.score >= 5 && r.score <= 9).length;
  const faibles = risques.filter((r) => r.score <= 4).length;
  const total = risques.length;

  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          Profil global des risques
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-2">
        <div className="flex rounded-lg overflow-hidden h-5 w-full">
          {critiques > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${pct(critiques)}%` }}
            >
              {critiques}
            </div>
          )}
          {eleves > 0 && (
            <div
              className="bg-orange-400 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${pct(eleves)}%` }}
            >
              {eleves}
            </div>
          )}
          {moyens > 0 && (
            <div
              className="bg-yellow-400 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${pct(moyens)}%` }}
            >
              {moyens}
            </div>
          )}
          {faibles > 0 && (
            <div
              className="bg-green-400 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${pct(faibles)}%` }}
            >
              {faibles}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {[
            {
              label: "Critiques",
              count: critiques,
              color: "text-red-600",
              dot: "bg-red-500",
            },
            {
              label: "Élevés",
              count: eleves,
              color: "text-orange-600",
              dot: "bg-orange-400",
            },
            {
              label: "Moyens",
              count: moyens,
              color: "text-yellow-600",
              dot: "bg-yellow-400",
            },
            {
              label: "Faibles",
              count: faibles,
              color: "text-green-600",
              dot: "bg-green-400",
            },
          ].map(({ label, count, color, dot }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              <span className={`text-sm font-semibold ${color}`}>{count}</span>
              <span className="text-sm text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RisqueCardProps {
  risque: Risque;
}

function RisqueCard({ risque }: RisqueCardProps) {
  const niveau = getNiveau(risque.score);
  const niveauVariant = getNiveauBadgeVariant(niveau);
  const statutVariant = getStatutBadgeVariant(risque.statut);
  const catVariant = getCategorieBadgeVariant(risque.categorie);

  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
              {risque.id}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-800">
                {risque.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-2 line-clamp-2">
              {risque.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge variant={catVariant}>{risque.categorie}</Badge>
              <Badge variant="outline" className="text-xs">
                P: {risque.proba}
              </Badge>
              <Badge variant="outline" className="text-xs">
                I: {risque.impact}
              </Badge>
              <Badge variant={niveauVariant}>
                Score {risque.score} – {niveau}
              </Badge>
              <Badge variant={statutVariant}>
                {getStatutLabel(risque.statut)}
              </Badge>
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Responsable :
              </span>{" "}
              {risque.responsable}
            </div>
            <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded p-2 border border-slate-100">
              <span className="font-medium text-slate-700">
                Plan d&apos;action :
              </span>{" "}
              {risque.planAction}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface NouveauRisqueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Risque, "id" | "score">) => void;
}

function NouveauRisqueModal({
  open,
  onClose,
  onSubmit,
}: NouveauRisqueModalProps) {
  const [form, setForm] = useState<NewRisqueForm>({
    title: "",
    categorie: "",
    proba: "",
    impact: "",
    description: "",
    responsable: "",
    planAction: "",
    statut: "",
  });

  const handleChange = (field: keyof NewRisqueForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.categorie ||
      !form.proba ||
      !form.impact ||
      !form.statut ||
      !form.title
    )
      return;
    onSubmit({
      title: form.title,
      categorie: form.categorie as Categorie,
      proba: parseInt(form.proba),
      impact: parseInt(form.impact),
      responsable: form.responsable,
      planAction: form.planAction,
      statut: form.statut as Statut,
      description: form.description,
    });
    setForm({
      title: "",
      categorie: "",
      proba: "",
      impact: "",
      description: "",
      responsable: "",
      planAction: "",
      statut: "",
    });
    onClose();
  };

  const inputClass =
    "w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClass = `${inputClass} bg-white`;

  const scorePreview =
    form.proba && form.impact
      ? parseInt(form.proba) * parseInt(form.impact)
      : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white border border-slate-200 shadow-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            Nouveau Risque
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* Titre */}
            <div>
              <Label className="text-xs font-medium text-slate-700 mb-1 block">
                Titre *
              </Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Intitulé du risque"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <Label className="text-xs font-medium text-slate-700 mb-1 block">
                Catégorie *
              </Label>
              <select
                className={selectClass}
                value={form.categorie}
                onChange={(e) => handleChange("categorie", e.target.value)}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Probabilité + Impact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-700 mb-1 block">
                  Probabilité (1–5) *
                </Label>
                <select
                  className={selectClass}
                  value={form.proba}
                  onChange={(e) => handleChange("proba", e.target.value)}
                  required
                >
                  <option value="">Choisir</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-700 mb-1 block">
                  Impact (1–5) *
                </Label>
                <select
                  className={selectClass}
                  value={form.impact}
                  onChange={(e) => handleChange("impact", e.target.value)}
                  required
                >
                  <option value="">Choisir</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score preview */}
            {scorePreview !== null && (
              <div
                className={`rounded-md px-3 py-2 text-sm font-medium ${getCellColorClass(scorePreview)}`}
              >
                Score calculé : {scorePreview} —{" "}
                {getNiveau(scorePreview)}
              </div>
            )}

            {/* Description */}
            <div>
              <Label className="text-xs font-medium text-slate-700 mb-1 block">
                Description
              </Label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="Description détaillée du risque..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Responsable */}
            <div>
              <Label className="text-xs font-medium text-slate-700 mb-1 block">
                Responsable
              </Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Nom du responsable"
                value={form.responsable}
                onChange={(e) => handleChange("responsable", e.target.value)}
              />
            </div>

            {/* Plan d'action */}
            <div>
              <Label className="text-xs font-medium text-slate-700 mb-1 block">
                Plan d&apos;action
              </Label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="Actions de mitigation prévues..."
                value={form.planAction}
                onChange={(e) => handleChange("planAction", e.target.value)}
              />
            </div>

            {/* Statut */}
            <div>
              <Label className="text-xs font-medium text-slate-700 mb-1 block">
                Statut *
              </Label>
              <select
                className={selectClass}
                value={form.statut}
                onChange={(e) => handleChange("statut", e.target.value)}
                required
              >
                <option value="">Sélectionner un statut</option>
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {getStatutLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-2 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer le risque
              </button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RisquesPage() {
  const [risques, setRisques] = useState<Risque[]>(MOCK_RISQUES);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterNiveau, setFilterNiveau] = useState<string>("all");

  const selectClass =
    "border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleAddRisque = (data: Omit<Risque, "id" | "score">) => {
    const newId = `R${risques.length + 1}`;
    const score = data.proba * data.impact;
    setRisques((prev) => [...prev, { ...data, id: newId, score }]);
  };

  const filteredRisques = useMemo(() => {
    return risques.filter((r) => {
      if (filterCategorie !== "all" && r.categorie !== filterCategorie)
        return false;
      if (filterStatut !== "all" && r.statut !== filterStatut) return false;
      if (filterNiveau !== "all" && getNiveau(r.score) !== filterNiveau)
        return false;
      return true;
    });
  }, [risques, filterCategorie, filterStatut, filterNiveau]);

  const totalRisques = risques.length;
  const critiques = risques.filter((r) => r.score >= 15).length;
  const eleves = risques.filter(
    (r) => r.score >= 10 && r.score <= 14
  ).length;
  const moyens = risques.filter((r) => r.score >= 5 && r.score <= 9).length;

  const hasActiveFilters =
    filterCategorie !== "all" ||
    filterStatut !== "all" ||
    filterNiveau !== "all";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            Registre des Risques
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Identification, évaluation et suivi des risques du projet
            polyclinique
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nouveau Risque
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Risques"
          value={totalRisques}
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          colorClass="text-blue-700"
          bgClass="bg-blue-50"
        />
        <StatCard
          title="Critiques (score ≥15)"
          value={critiques}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          colorClass="text-red-700"
          bgClass="bg-red-50"
        />
        <StatCard
          title="Élevés (score 10–14)"
          value={eleves}
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
          colorClass="text-orange-700"
          bgClass="bg-orange-50"
        />
        <StatCard
          title="Moyens (score 5–9)"
          value={moyens}
          icon={<CheckCircle2 className="w-5 h-5 text-yellow-600" />}
          colorClass="text-yellow-700"
          bgClass="bg-yellow-50"
        />
      </div>

      {/* Matrix + Gauge row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RiskMatrix risques={risques} />
        </div>
        <div>
          <RiskProfileGauge risques={risques} />
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-slate-700">
              Filtres :
            </span>

            {/* Catégorie */}
            <select
              className={selectClass}
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
            >
              <option value="all">Toutes catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Statut */}
            <select
              className={selectClass}
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
            >
              <option value="all">Tous statuts</option>
              {STATUTS.map((s) => (
                <option key={s} value={s}>
                  {getStatutLabel(s)}
                </option>
              ))}
            </select>

            {/* Niveau */}
            <select
              className={selectClass}
              value={filterNiveau}
              onChange={(e) => setFilterNiveau(e.target.value)}
            >
              <option value="all">Tous niveaux</option>
              {(["Critique", "Élevé", "Moyen", "Faible"] as Niveau[]).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              )}
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilterCategorie("all");
                  setFilterStatut("all");
                  setFilterNiveau("all");
                }}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                <X className="w-3 h-3" />
                Réinitialiser
              </button>
            )}

            <span className="text-xs text-slate-400 ml-auto">
              {filteredRisques.length} risque
              {filteredRisques.length !== 1 ? "s" : ""} affiché
              {filteredRisques.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Risk List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Liste des risques ({filteredRisques.length})
        </h2>
        {filteredRisques.length === 0 ? (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-8 text-center text-slate-500 text-sm">
              Aucun risque ne correspond aux filtres sélectionnés.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredRisques
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((r) => (
                <RisqueCard key={r.id} risque={r} />
              ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <NouveauRisqueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddRisque}
      />
    </div>
  );
}
