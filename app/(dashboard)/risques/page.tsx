"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Plus,
  Filter,
  Shield,
  TrendingUp,
  ChevronRight,
  X,
  CheckCircle,
} from "lucide-react";

type Statut = "Actif" | "Mitigé" | "Clôturé";
type Niveau = "critique" | "élevé" | "moyen" | "faible";
type Categorie =
  | "Délai"
  | "Technique"
  | "Documentation"
  | "Coût"
  | "Administratif";

interface Risk {
  id: number;
  title: string;
  categorie: Categorie;
  probabilite: number;
  impact: number;
  score: number;
  responsable: string;
  action: string;
  statut: Statut;
  niveau: Niveau;
}

const initialRisks: Risk[] = [
  {
    id: 1,
    title: "Retard livraison CTA (CVC)",
    categorie: "Délai",
    probabilite: 4,
    impact: 5,
    score: 20,
    responsable: "Chef projet",
    action: "Relance fournisseur hebdomadaire. Identifier source alternative.",
    statut: "Actif",
    niveau: "critique",
  },
  {
    id: 2,
    title: "Fermeture faux plafond avant validation MEP",
    categorie: "Technique",
    probabilite: 3,
    impact: 5,
    score: 15,
    responsable: "MOE",
    action:
      "Check-list validation MEP obligatoire avant fermeture. Procédure de levée interdiction.",
    statut: "Actif",
    niveau: "critique",
  },
  {
    id: 3,
    title: "Absence plans exec fluides médicaux",
    categorie: "Technique",
    probabilite: 3,
    impact: 4,
    score: 12,
    responsable: "MedFluides",
    action: "Mise en demeure contractuelle. Date butoir 20/06/2026.",
    statut: "Actif",
    niveau: "élevé",
  },
  {
    id: 4,
    title: "Essais réalisés trop tard pour réception",
    categorie: "Délai",
    probabilite: 4,
    impact: 4,
    score: 16,
    responsable: "Chef projet",
    action:
      "Planning essais détaillé. Réunion coordination essais bi-mensuelle.",
    statut: "Actif",
    niveau: "critique",
  },
  {
    id: 5,
    title: "DOE incomplet à la réception",
    categorie: "Documentation",
    probabilite: 3,
    impact: 3,
    score: 9,
    responsable: "MOE",
    action:
      "Suivi DOE mensuel. Check-list partagée avec toutes les entreprises.",
    statut: "Actif",
    niveau: "moyen",
  },
  {
    id: 6,
    title: "Paiement sans preuve avancement réel",
    categorie: "Coût",
    probabilite: 2,
    impact: 4,
    score: 8,
    responsable: "MOA",
    action: "Contrôle contradictoire avant visa situations de travaux.",
    statut: "Mitigé",
    niveau: "moyen",
  },
  {
    id: 7,
    title: "Réception équip. biomédical sans prérequis",
    categorie: "Technique",
    probabilite: 4,
    impact: 4,
    score: 16,
    responsable: "MOA",
    action:
      "Planning prérequis biomédicaux intégré au planning général.",
    statut: "Actif",
    niveau: "critique",
  },
  {
    id: 8,
    title: "Retard approbation plans exécution",
    categorie: "Administratif",
    probabilite: 3,
    impact: 3,
    score: 9,
    responsable: "MOE",
    action:
      "Suivi hebdo des soumissions. Relance automatique J+7 sans réponse.",
    statut: "Mitigé",
    niveau: "moyen",
  },
];

const getCellColor = (prob: number, impact: number) => {
  const score = prob * impact;
  if (score >= 15) return "bg-red-100 border-red-300";
  if (score >= 9) return "bg-orange-100 border-orange-300";
  if (score >= 5) return "bg-yellow-100 border-yellow-300";
  return "bg-green-100 border-green-300";
};

const getCellTextColor = (prob: number, impact: number) => {
  const score = prob * impact;
  if (score >= 15) return "text-red-700";
  if (score >= 9) return "text-orange-700";
  if (score >= 5) return "text-yellow-700";
  return "text-green-700";
};

const getRiskDotColor = (niveau: Niveau) => {
  switch (niveau) {
    case "critique":
      return "bg-red-500 text-white";
    case "élevé":
      return "bg-orange-500 text-white";
    case "moyen":
      return "bg-yellow-500 text-white";
    case "faible":
      return "bg-green-500 text-white";
  }
};

const getNiveauBadge = (niveau: Niveau) => {
  switch (niveau) {
    case "critique":
      return "bg-red-100 text-red-800 border-red-200";
    case "élevé":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "moyen":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "faible":
      return "bg-green-100 text-green-800 border-green-200";
  }
};

const getCategorieBadge = (categorie: Categorie) => {
  switch (categorie) {
    case "Délai":
      return "bg-red-50 text-red-700 border-red-200";
    case "Technique":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Documentation":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Coût":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Administratif":
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatutBadge = (statut: Statut) => {
  switch (statut) {
    case "Actif":
      return "bg-red-50 text-red-700 border-red-200";
    case "Mitigé":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Clôturé":
      return "bg-green-50 text-green-700 border-green-200";
  }
};

const impactLabels = ["Négligeable", "Mineur", "Modéré", "Majeur", "Catastrophique"];
const probabiliteLabels = ["Rare", "Peu probable", "Possible", "Probable", "Très probable"];

const categories: Array<Categorie | "Tous"> = [
  "Tous",
  "Délai",
  "Technique",
  "Documentation",
  "Coût",
  "Administratif",
];
const statuts: Array<Statut | "Tous"> = ["Tous", "Actif", "Mitigé", "Clôturé"];

export default function RisquesPage() {
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [filterCategorie, setFilterCategorie] = useState<Categorie | "Tous">("Tous");
  const [filterStatut, setFilterStatut] = useState<Statut | "Tous">("Tous");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRisk, setNewRisk] = useState({
    title: "",
    categorie: "Délai" as Categorie,
    probabilite: "3",
    impact: "3",
    responsable: "",
    action: "",
    statut: "Actif" as Statut,
  });

  const filteredRisks = risks.filter((r) => {
    const matchCat = filterCategorie === "Tous" || r.categorie === filterCategorie;
    const matchStat = filterStatut === "Tous" || r.statut === filterStatut;
    return matchCat && matchStat;
  });

  // Compute overall criticality
  const avgScore =
    risks.reduce((sum, r) => sum + r.score, 0) / risks.length;
  const maxPossible = 25;
  const gaugePercent = Math.round((avgScore / maxPossible) * 100);
  const gaugeColor =
    avgScore >= 15
      ? "bg-red-500"
      : avgScore >= 9
      ? "bg-orange-500"
      : avgScore >= 5
      ? "bg-yellow-500"
      : "bg-green-500";
  const gaugeLabel =
    avgScore >= 15
      ? "Critique"
      : avgScore >= 9
      ? "Élevé"
      : avgScore >= 5
      ? "Moyen"
      : "Faible";

  const handleAddRisk = () => {
    const prob = parseInt(newRisk.probabilite);
    const imp = parseInt(newRisk.impact);
    const score = prob * imp;
    const niveau: Niveau =
      score >= 15 ? "critique" : score >= 9 ? "élevé" : score >= 5 ? "moyen" : "faible";
    const risk: Risk = {
      id: risks.length + 1,
      title: newRisk.title,
      categorie: newRisk.categorie,
      probabilite: prob,
      impact: imp,
      score,
      responsable: newRisk.responsable,
      action: newRisk.action,
      statut: newRisk.statut,
      niveau,
    };
    setRisks([...risks, risk]);
    setDialogOpen(false);
    setNewRisk({
      title: "",
      categorie: "Délai",
      probabilite: "3",
      impact: "3",
      responsable: "",
      action: "",
      statut: "Actif",
    });
  };

  // Build matrix: grid[prob][impact] = list of risks
  const matrix: Record<number, Record<number, Risk[]>> = {};
  for (let p = 1; p <= 5; p++) {
    matrix[p] = {};
    for (let i = 1; i <= 5; i++) {
      matrix[p][i] = [];
    }
  }
  risks.forEach((r) => {
    if (r.probabilite >= 1 && r.probabilite <= 5 && r.impact >= 1 && r.impact <= 5) {
      matrix[r.probabilite][r.impact].push(r);
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registre des Risques</h1>
            <p className="text-sm text-gray-500">
              Polyclinique Nador — Suivi et maîtrise des risques projet
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Risque
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Nouveau Risque
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>Titre</Label>
                <Input
                  placeholder="Titre du risque"
                  value={newRisk.title}
                  onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Catégorie</Label>
                <Select
                  value={newRisk.categorie}
                  onValueChange={(v) =>
                    setNewRisk({ ...newRisk, categorie: v as Categorie })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Délai", "Technique", "Documentation", "Coût", "Administratif"] as Categorie[]).map(
                      (c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Probabilité (1–5)</Label>
                  <Select
                    value={newRisk.probabilite}
                    onValueChange={(v) => setNewRisk({ ...newRisk, probabilite: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} — {probabiliteLabels[n - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Impact (1–5)</Label>
                  <Select
                    value={newRisk.impact}
                    onValueChange={(v) => setNewRisk({ ...newRisk, impact: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} — {impactLabels[n - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Responsable</Label>
                <Input
                  placeholder="Nom / rôle"
                  value={newRisk.responsable}
                  onChange={(e) =>
                    setNewRisk({ ...newRisk, responsable: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Plan d&apos;action</Label>
                <Textarea
                  placeholder="Décrire les mesures de mitigation..."
                  rows={3}
                  value={newRisk.action}
                  onChange={(e) =>
                    setNewRisk({ ...newRisk, action: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Statut</Label>
                <Select
                  value={newRisk.statut}
                  onValueChange={(v) =>
                    setNewRisk({ ...newRisk, statut: v as Statut })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Actif", "Mitigé", "Clôturé"] as Statut[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleAddRisk}
                  disabled={!newRisk.title || !newRisk.responsable}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total risques</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{risks.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Critiques</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {risks.filter((r) => r.niveau === "critique").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Actifs</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">
              {risks.filter((r) => r.statut === "Actif").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Mitigés / Clôturés</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {risks.filter((r) => r.statut === "Mitigé" || r.statut === "Clôturé").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Criticality Gauge */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            Criticité globale du projet
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${gaugeColor}`}
                  style={{ width: `${gaugePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Faible</span>
                <span>Moyen</span>
                <span>Élevé</span>
                <span>Critique</span>
              </div>
            </div>
            <div className="text-right min-w-[80px]">
              <p className="text-lg font-bold text-gray-900">{avgScore.toFixed(1)}</p>
              <p className={`text-xs font-semibold ${
                gaugeLabel === "Critique" ? "text-red-600" :
                gaugeLabel === "Élevé" ? "text-orange-600" :
                gaugeLabel === "Moyen" ? "text-yellow-600" : "text-green-600"
              }`}>
                {gaugeLabel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Matrix */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Matrice des Risques — Probabilité × Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {/* Y-axis label */}
            <div className="flex items-center justify-center w-6">
              <span
                className="text-xs text-gray-500 font-medium"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Probabilité
              </span>
            </div>
            {/* Y-axis labels */}
            <div className="flex flex-col-reverse justify-between" style={{ minWidth: 80 }}>
              {probabiliteLabels.map((label, idx) => (
                <div key={idx} className="flex items-center justify-end pr-2 h-16">
                  <div className="text-right">
                    <span className="text-xs text-gray-600 font-medium block">{idx + 1}</span>
                    <span className="text-xs text-gray-400 block leading-tight" style={{ fontSize: 9 }}>
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid + X-axis */}
            <div className="flex-1">
              {/* Grid rows: prob 5 at top, prob 1 at bottom */}
              <div className="grid" style={{ gridTemplateRows: "repeat(5, 4rem)" }}>
                {[5, 4, 3, 2, 1].map((prob) => (
                  <div
                    key={prob}
                    className="grid"
                    style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                  >
                    {[1, 2, 3, 4, 5].map((impact) => {
                      const color = getCellColor(prob, impact);
                      const textColor = getCellTextColor(prob, impact);
                      const cellRisks = matrix[prob]?.[impact] ?? [];
                      const score = prob * impact;
                      return (
                        <div
                          key={impact}
                          className={`border ${color} flex flex-col items-center justify-center relative p-1`}
                          style={{ minHeight: "4rem" }}
                        >
                          <span className={`text-xs font-bold ${textColor} mb-1`}>
                            {score}
                          </span>
                          <div className="flex flex-wrap gap-0.5 justify-center">
                            {cellRisks.map((r) => (
                              <span
                                key={r.id}
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${getRiskDotColor(r.niveau)} shadow-sm`}
                                title={r.title}
                              >
                                {r.id}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div
                className="grid mt-1"
                style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
              >
                {impactLabels.map((label, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs text-gray-600 font-medium">{idx + 1}</span>
                    <span
                      className="text-center text-gray-400 leading-tight"
                      style={{ fontSize: 9 }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500 font-medium">Impact</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-300" />
              <span className="text-xs text-gray-600">Faible (1–4)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-300" />
              <span className="text-xs text-gray-600">Moyen (5–8)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-300" />
              <span className="text-xs text-gray-600">Élevé (9–12)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-300" />
              <span className="text-xs text-gray-600">Critique (≥15)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">Catégorie :</span>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategorie(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  filterCategorie === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Statut :</span>
          <div className="flex flex-wrap gap-1">
            {statuts.map((stat) => (
              <button
                key={stat}
                onClick={() => setFilterStatut(stat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  filterStatut === stat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            {filteredRisks.length} risque{filteredRisks.length !== 1 ? "s" : ""} affiché
            {filteredRisks.length !== 1 ? "s" : ""}
          </h2>
        </div>
        {filteredRisks.map((risk) => (
          <Card
            key={risk.id}
            className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                {/* Left: number badge */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRiskDotColor(risk.niveau)}`}
                >
                  {risk.id}
                </div>

                {/* Center: details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{risk.title}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategorieBadge(
                        risk.categorie
                      )}`}
                    >
                      {risk.categorie}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getNiveauBadge(
                        risk.niveau
                      )}`}
                    >
                      {risk.niveau.charAt(0).toUpperCase() + risk.niveau.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatutBadge(
                        risk.statut
                      )}`}
                    >
                      {risk.statut === "Actif" ? (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      ) : risk.statut === "Mitigé" ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {risk.statut}
                    </span>
                  </div>

                  {/* Score line */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span>
                      <span className="text-gray-400">Probabilité</span>{" "}
                      <span className="font-semibold text-gray-800">{risk.probabilite}</span>
                      <span className="text-gray-400 mx-1">×</span>
                      <span className="text-gray-400">Impact</span>{" "}
                      <span className="font-semibold text-gray-800">{risk.impact}</span>
                      <span className="text-gray-400 mx-1">=</span>
                      <span
                        className={`font-bold ${
                          risk.score >= 15
                            ? "text-red-600"
                            : risk.score >= 9
                            ? "text-orange-600"
                            : risk.score >= 5
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        Score {risk.score}
                      </span>
                    </span>
                    <span>
                      <span className="text-gray-400">Responsable :</span>{" "}
                      <span className="font-medium text-gray-800">{risk.responsable}</span>
                    </span>
                  </div>

                  {/* Action plan */}
                  <p className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1.5">
                    <span className="font-medium text-gray-600">Plan d&apos;action :</span>{" "}
                    {risk.action}
                  </p>
                </div>

                {/* Right: actions */}
                <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-gray-200 text-gray-600 hover:text-gray-900"
                  >
                    Voir détail
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-gray-200 text-gray-600 hover:text-gray-900"
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredRisks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun risque ne correspond aux filtres sélectionnés.</p>
          </div>
        )}
      </div>
    </div>
  );
}
