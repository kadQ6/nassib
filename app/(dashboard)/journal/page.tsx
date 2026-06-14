"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  CheckCircle2,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Users,
  MapPin,
  AlertTriangle,
  Eye,
  ClipboardList,
  CalendarDays,
  Trash2,
  FileText,
  ThumbsUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Meteo = "Ensoleillé" | "Nuageux" | "Pluvieux" | "Orageux";

type Effectif = {
  entreprise: string;
  effectif: number;
  qualification: string;
};

type DailyReport = {
  dateKey: string;
  date: string;
  meteo: Meteo;
  temperature: number;
  effectifs: Effectif[];
  totalEffectif: number;
  zones: string[];
  travauxRealises: string;
  incidents: string;
  visites: string;
  instructions: string;
  blocages: string;
  redacteur: string;
};

type FormEffectif = {
  entreprise: string;
  effectif: string;
  qualification: string;
};

type ReportForm = {
  date: string;
  meteo: Meteo | "";
  temperature: string;
  effectifs: FormEffectif[];
  travauxRealises: string;
  zones: string[];
  incidents: string;
  visites: string;
  instructions: string;
  blocages: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_REPORTS: DailyReport[] = [
  {
    dateKey: "2026-06-10",
    date: "10/06/2026",
    meteo: "Ensoleillé",
    temperature: 34,
    effectifs: [
      { entreprise: "DJI FU SARL", effectif: 15, qualification: "Ouvriers GC" },
      { entreprise: "DJI FU SARL", effectif: 8, qualification: "Électriciens" },
      { entreprise: "DJI FU SARL", effectif: 4, qualification: "Techniciens CVC" },
    ],
    totalEffectif: 27,
    zones: ["RDC", "R+1", "Pré-travail / Salle Travail"],
    travauxRealises:
      "Coulage dalle R+1 Pré-travail terminé. Installation câblage CFO RDC en cours. Pose CTA sous-sol démarrée.",
    incidents:
      "Chute de matériel mineure (sans blessés), signalée au chef de chantier. Rapport incident établi.",
    visites:
      "Visite du responsable MOA M. Benali à 14h00. Visite contrôleur technique à 16h30.",
    instructions:
      "Reprise jointures béton escalier R+1 avant jeudi. Nettoyage zone B avant coulage.",
    blocages: "Attente livraison ferraillage pour dalles R+2.",
    redacteur: "M. Farid",
  },
  {
    dateKey: "2026-06-09",
    date: "09/06/2026",
    meteo: "Nuageux",
    temperature: 28,
    effectifs: [
      { entreprise: "DJI FU SARL", effectif: 12, qualification: "Ouvriers GC" },
      { entreprise: "DJI FU SARL", effectif: 6, qualification: "Électriciens" },
    ],
    totalEffectif: 18,
    zones: ["RDC", "Sous-sol"],
    travauxRealises:
      "Ferraillage voiles RDC zone B. Tirage câbles CFO sous-sol. Essais étanchéité toiture partielle.",
    incidents: "",
    visites: "Réunion hebdomadaire de chantier N°24 à 9h00.",
    instructions: "Mise en place balisage zone décoffrage.",
    blocages: "",
    redacteur: "M. Farid",
  },
  {
    dateKey: "2026-06-08",
    date: "08/06/2026",
    meteo: "Ensoleillé",
    temperature: 32,
    effectifs: [
      { entreprise: "DJI FU SARL", effectif: 14, qualification: "Ouvriers GC" },
      { entreprise: "DJI FU SARL", effectif: 6, qualification: "Techniciens CVC" },
      {
        entreprise: "DJI FU SARL",
        effectif: 3,
        qualification: "Techniciens fluides",
      },
    ],
    totalEffectif: 23,
    zones: ["R+1", "Bloc Césarienne", "Urgences"],
    travauxRealises:
      "Pose gaines CVC niveau R+1 Bloc Césarienne. Installation centrale de traitement d'air (CTA). Réseau plomberie urgences en cours.",
    incidents: "",
    visites: "Architecte Mme Ouali - visite coordination 10h00.",
    instructions:
      "Coordination passage gaines CVC/CFO à vérifier avant fermeture faux plafonds.",
    blocages:
      "Plans d'exécution fluides médicaux non encore approuvés - travaux partiellement suspendus Bloc Césarienne.",
    redacteur: "M. Farid",
  },
];

const ALL_ZONES = [
  "RDC",
  "R+1",
  "R+2",
  "Sous-sol",
  "Bloc Césarienne",
  "Pré-travail / Salle Travail",
  "Box URG 1-4",
  "Déchocage",
  "Urgences",
  "Laboratoire",
];

const METEO_OPTIONS: { value: Meteo; emoji: string; label: string }[] = [
  { value: "Ensoleillé", emoji: "☀️", label: "Ensoleillé" },
  { value: "Nuageux", emoji: "☁️", label: "Nuageux" },
  { value: "Pluvieux", emoji: "🌧️", label: "Pluvieux" },
  { value: "Orageux", emoji: "⛈️", label: "Orageux" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function meteoEmoji(meteo: Meteo): string {
  const m = METEO_OPTIONS.find((o) => o.value === meteo);
  return m ? m.emoji : "";
}

function meteoIcon(meteo: Meteo) {
  switch (meteo) {
    case "Ensoleillé":
      return <Sun size={14} className="text-yellow-500" />;
    case "Nuageux":
      return <Cloud size={14} className="text-slate-400" />;
    case "Pluvieux":
      return <CloudRain size={14} className="text-blue-400" />;
    case "Orageux":
      return <CloudLightning size={14} className="text-purple-500" />;
  }
}

function todayIso(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReportDetail({ report }: { report: DailyReport }) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-800">
              Rapport du {report.date}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              Rédigé par {report.redacteur}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{meteoEmoji(report.meteo)}</span>
            <Badge variant="outline" className="flex items-center gap-1 text-sm">
              {meteoIcon(report.meteo)}
              {report.meteo}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {report.temperature}°C
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Effectifs */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={14} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Effectifs</span>
          </div>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs">Entreprise</TableHead>
                  <TableHead className="text-xs text-right">Effectif</TableHead>
                  <TableHead className="text-xs">Qualification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.effectifs.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{e.entreprise}</TableCell>
                    <TableCell className="text-sm text-right">{e.effectif}</TableCell>
                    <TableCell className="text-sm text-slate-500">{e.qualification}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-50 font-semibold">
                  <TableCell className="text-sm">Total</TableCell>
                  <TableCell className="text-sm text-right">{report.totalEffectif}</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Travaux */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <ClipboardList size={14} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Travaux réalisés</span>
          </div>
          <p className="text-sm text-slate-600 bg-slate-50 rounded-md px-3 py-2 border border-slate-100">
            {report.travauxRealises}
          </p>
        </div>

        {/* Zones */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={14} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Zones travaillées</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.zones.map((z) => (
              <Badge key={z} variant="info" className="text-xs">
                {z}
              </Badge>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle size={14} className="text-orange-500" />
            <span className="text-sm font-medium text-slate-700">Incidents</span>
            {report.incidents ? (
              <Badge variant="warning" className="text-xs">Signalé</Badge>
            ) : (
              <Badge variant="success" className="text-xs">Aucun</Badge>
            )}
          </div>
          {report.incidents && (
            <p className="text-sm text-slate-600 bg-orange-50 rounded-md px-3 py-2 border border-orange-100">
              {report.incidents}
            </p>
          )}
        </div>

        {/* Visites */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Eye size={14} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Visites / Intervenants</span>
          </div>
          <p className="text-sm text-slate-600 bg-slate-50 rounded-md px-3 py-2 border border-slate-100">
            {report.visites || "—"}
          </p>
        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <FileText size={14} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Instructions données</span>
          </div>
          <p className="text-sm text-slate-600 bg-slate-50 rounded-md px-3 py-2 border border-slate-100">
            {report.instructions || "—"}
          </p>
        </div>

        {/* Blocages */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-sm font-medium text-slate-700">Blocages</span>
            {report.blocages ? (
              <Badge variant="destructive" className="text-xs">Actif</Badge>
            ) : (
              <Badge variant="success" className="text-xs">Aucun</Badge>
            )}
          </div>
          {report.blocages && (
            <p className="text-sm text-slate-600 bg-red-50 rounded-md px-3 py-2 border border-red-100">
              {report.blocages}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Report Form Modal ────────────────────────────────────────────────────────

function emptyForm(): ReportForm {
  return {
    date: todayIso(),
    meteo: "",
    temperature: "",
    effectifs: [{ entreprise: "", effectif: "", qualification: "" }],
    travauxRealises: "",
    zones: [],
    incidents: "",
    visites: "",
    instructions: "",
    blocages: "",
  };
}

interface ReportFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (report: DailyReport) => void;
}

function ReportFormModal({ open, onClose, onSubmit }: ReportFormModalProps) {
  const [form, setForm] = useState<ReportForm>(emptyForm);

  function handleClose() {
    setForm(emptyForm());
    onClose();
  }

  function setField<K extends keyof ReportForm>(key: K, val: ReportForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function updateEffectif(idx: number, field: keyof FormEffectif, val: string) {
    setForm((prev) => {
      const eff = [...prev.effectifs];
      eff[idx] = { ...eff[idx], [field]: val };
      return { ...prev, effectifs: eff };
    });
  }

  function addEffectif() {
    setForm((prev) => ({
      ...prev,
      effectifs: [
        ...prev.effectifs,
        { entreprise: "", effectif: "", qualification: "" },
      ],
    }));
  }

  function removeEffectif(idx: number) {
    setForm((prev) => ({
      ...prev,
      effectifs: prev.effectifs.filter((_, i) => i !== idx),
    }));
  }

  function toggleZone(zone: string) {
    setForm((prev) => {
      const zones = prev.zones.includes(zone)
        ? prev.zones.filter((z) => z !== zone)
        : [...prev.zones, zone];
      return { ...prev, zones };
    });
  }

  function handleSubmit() {
    if (!form.date || !form.meteo) return;

    const [y, m, d] = form.date.split("-");
    const dateDisplay = `${d}/${m}/${y}`;

    const effectifs: Effectif[] = form.effectifs
      .filter((e) => e.entreprise.trim())
      .map((e) => ({
        entreprise: e.entreprise,
        effectif: parseInt(e.effectif) || 0,
        qualification: e.qualification,
      }));

    const totalEffectif = effectifs.reduce((s, e) => s + e.effectif, 0);

    const report: DailyReport = {
      dateKey: form.date,
      date: dateDisplay,
      meteo: form.meteo as Meteo,
      temperature: parseFloat(form.temperature) || 0,
      effectifs,
      totalEffectif,
      zones: form.zones,
      travauxRealises: form.travauxRealises,
      incidents: form.incidents,
      visites: form.visites,
      instructions: form.instructions,
      blocages: form.blocages,
      redacteur: "M. Farid",
    };

    onSubmit(report);
    setForm(emptyForm());
  }

  const inputCls =
    "w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-600" />
            Saisir le rapport du jour
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Date */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Date du rapport
            </Label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Météo */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Météo
            </Label>
            <div className="flex flex-wrap gap-2">
              {METEO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setField("meteo", opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition-colors ${
                    form.meteo === opt.value
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Température */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Température
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.temperature}
                onChange={(e) => setField("temperature", e.target.value)}
                placeholder="30"
                className={`${inputCls} w-28`}
              />
              <span className="text-sm text-slate-500">°C</span>
            </div>
          </div>

          {/* Effectifs */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Effectifs
            </Label>
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs">Entreprise</TableHead>
                    <TableHead className="text-xs">Effectif</TableHead>
                    <TableHead className="text-xs">Qualification</TableHead>
                    <TableHead className="text-xs w-10">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.effectifs.map((eff, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-1">
                        <input
                          type="text"
                          value={eff.entreprise}
                          onChange={(e) =>
                            updateEffectif(idx, "entreprise", e.target.value)
                          }
                          placeholder="DJI FU SARL"
                          className={inputCls}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <input
                          type="number"
                          value={eff.effectif}
                          onChange={(e) =>
                            updateEffectif(idx, "effectif", e.target.value)
                          }
                          placeholder="0"
                          className={`${inputCls} w-20`}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <input
                          type="text"
                          value={eff.qualification}
                          onChange={(e) =>
                            updateEffectif(idx, "qualification", e.target.value)
                          }
                          placeholder="Ouvriers GC"
                          className={inputCls}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <button
                          type="button"
                          onClick={() => removeEffectif(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={addEffectif}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  Ajouter une entreprise
                </button>
              </div>
            </div>
          </div>

          {/* Travaux réalisés */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Travaux réalisés
            </Label>
            <Textarea
              rows={3}
              value={form.travauxRealises}
              onChange={(e) => setField("travauxRealises", e.target.value)}
              placeholder="Décrire les travaux effectués..."
              className="text-sm resize-none"
            />
          </div>

          {/* Zones */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Zones travaillées
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_ZONES.map((zone) => (
                <div key={zone} className="flex items-center gap-2">
                  <Checkbox
                    id={`zone-${zone}`}
                    checked={form.zones.includes(zone)}
                    onCheckedChange={() => toggleZone(zone)}
                  />
                  <label
                    htmlFor={`zone-${zone}`}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {zone}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Incidents
            </Label>
            <Textarea
              rows={2}
              value={form.incidents}
              onChange={(e) => setField("incidents", e.target.value)}
              placeholder="Aucun incident si vide"
              className="text-sm resize-none"
            />
          </div>

          {/* Visites */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Visites / Intervenants
            </Label>
            <Textarea
              rows={2}
              value={form.visites}
              onChange={(e) => setField("visites", e.target.value)}
              placeholder="Visites et intervenants du jour..."
              className="text-sm resize-none"
            />
          </div>

          {/* Instructions */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Instructions données
            </Label>
            <Textarea
              rows={2}
              value={form.instructions}
              onChange={(e) => setField("instructions", e.target.value)}
              placeholder="Instructions et directives..."
              className="text-sm resize-none"
            />
          </div>

          {/* Blocages */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Blocages
            </Label>
            <Textarea
              rows={2}
              value={form.blocages}
              onChange={(e) => setField("blocages", e.target.value)}
              placeholder="Blocages et points d'attention..."
              className="text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.date || !form.meteo}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Enregistrer le rapport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

const DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

interface CalendarProps {
  reports: DailyReport[];
  selectedDateKey: string;
  onSelectDate: (key: string) => void;
}

function JuneCalendar({ reports, selectedDateKey, onSelectDate }: CalendarProps) {
  // June 2026: 1st is Monday (index 0 in Mon-first week)
  const daysInJune = 30;
  const firstDayOffset = 0; // Monday = 0

  const reportKeys = new Set(reports.map((r) => r.dateKey));

  // Build 5 rows x 7 cols grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInJune; d++) cells.push(d);
  while (cells.length < 35) cells.push(null);

  function dateKey(day: number): string {
    const dd = String(day).padStart(2, "0");
    return `2026-06-${dd}`;
  }

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <CalendarDays size={16} className="text-blue-600" />
          Juin 2026
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {DAY_HEADERS.map((h) => (
            <div
              key={h}
              className="text-center text-xs font-medium text-slate-500 py-1"
            >
              {h}
            </div>
          ))}
          {cells.map((day, idx) => {
            if (day === null) {
              return (
                <div key={`empty-${idx}`} className="h-9 rounded-md" />
              );
            }
            const key = dateKey(day);
            const hasReport = reportKeys.has(key);
            const isSelected = selectedDateKey === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDate(key)}
                className={`relative h-9 rounded-md text-sm font-medium transition-colors flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-blue-50 border border-blue-300 text-blue-700"
                    : "border border-transparent hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span>{day}</span>
                {hasReport && (
                  <CheckCircle2
                    size={8}
                    className="text-green-500 absolute bottom-1"
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <CheckCircle2 size={10} className="text-green-500" />
          Rapport disponible
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Synthèse hebdomadaire ────────────────────────────────────────────────────

function SyntheseCard({ reports }: { reports: DailyReport[] }) {
  // Stats for week June 8–14
  const weekReports = reports.filter(
    (r) => r.dateKey >= "2026-06-08" && r.dateKey <= "2026-06-14"
  );

  const totalPersonnesJours = weekReports.reduce(
    (s, r) => s + r.totalEffectif,
    0
  );
  const joursTravailes = weekReports.length;

  const meteoCounts: Record<string, number> = {};
  weekReports.forEach((r) => {
    meteoCounts[r.meteo] = (meteoCounts[r.meteo] || 0) + 1;
  });

  const nbIncidents = weekReports.filter((r) => r.incidents.trim()).length;

  const zonesSet = new Set<string>();
  weekReports.forEach((r) => r.zones.forEach((z) => zonesSet.add(z)));
  const zones = Array.from(zonesSet);

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <ThumbsUp size={16} className="text-blue-600" />
          Synthèse — Semaine du 8 au 14 juin 2026
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total effectif jours */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Total effectif jours
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {totalPersonnesJours}
            </p>
            <p className="text-xs text-blue-600">
              personnes-jours ({joursTravailes} jours travaillés)
            </p>
          </div>

          {/* Météo dominante */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Sun size={14} className="text-yellow-600" />
              <span className="text-xs font-medium text-yellow-700">
                Météo dominante
              </span>
            </div>
            <div className="space-y-0.5 mt-1">
              {Object.entries(meteoCounts).map(([meteo, count]) => (
                <p key={meteo} className="text-sm text-yellow-800">
                  {count}× {meteo}
                </p>
              ))}
            </div>
          </div>

          {/* Incidents */}
          <div
            className={`rounded-lg p-3 border ${
              nbIncidents > 0
                ? "bg-orange-50 border-orange-100"
                : "bg-green-50 border-green-100"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle
                size={14}
                className={nbIncidents > 0 ? "text-orange-500" : "text-green-600"}
              />
              <span
                className={`text-xs font-medium ${
                  nbIncidents > 0 ? "text-orange-700" : "text-green-700"
                }`}
              >
                Incidents
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                nbIncidents > 0 ? "text-orange-800" : "text-green-800"
              }`}
            >
              {nbIncidents}
            </p>
            <p
              className={`text-xs ${
                nbIncidents > 0 ? "text-orange-600" : "text-green-600"
              }`}
            >
              {nbIncidents === 0 ? "Aucun incident" : "incident(s) signalé(s)"}
            </p>
          </div>

          {/* Zones actives */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin size={14} className="text-slate-600" />
              <span className="text-xs font-medium text-slate-700">
                Zones actives
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {zones.map((z) => (
                <Badge key={z} variant="secondary" className="text-xs">
                  {z}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [reports, setReports] = useState<DailyReport[]>(INITIAL_REPORTS);
  const [selectedDateKey, setSelectedDateKey] = useState<string>("2026-06-10");
  const [modalOpen, setModalOpen] = useState(false);

  const selectedReport = reports.find((r) => r.dateKey === selectedDateKey) ?? null;

  function handleAddReport(report: DailyReport) {
    setReports((prev) => {
      const filtered = prev.filter((r) => r.dateKey !== report.dateKey);
      return [...filtered, report].sort((a, b) =>
        b.dateKey.localeCompare(a.dateKey)
      );
    });
    setSelectedDateKey(report.dateKey);
    setModalOpen(false);
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Journal de Chantier
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi quotidien des activités de construction
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Saisir rapport du jour
        </button>
      </div>

      {/* Calendar */}
      <JuneCalendar
        reports={reports}
        selectedDateKey={selectedDateKey}
        onSelectDate={setSelectedDateKey}
      />

      {/* Report detail */}
      {selectedReport ? (
        <ReportDetail report={selectedReport} />
      ) : (
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays size={36} className="text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">
              Aucun rapport pour ce jour
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus size={14} />
              Créer un rapport
            </button>
          </CardContent>
        </Card>
      )}

      {/* Synthèse hebdomadaire */}
      <SyntheseCard reports={reports} />

      {/* Form modal */}
      <ReportFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddReport}
      />
    </div>
  );
}
