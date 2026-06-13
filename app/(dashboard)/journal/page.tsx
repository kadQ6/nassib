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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Meteo = "Ensoleillé" | "Nuageux" | "Pluvieux" | "Orageux";

interface Effectif {
  entreprise: string;
  role: string;
  count: number;
}

interface DailyReport {
  date: string;
  meteo: Meteo;
  temperature: number;
  effectifs: Effectif[];
  travaux: string;
  zones: string[];
  incidents: string;
  visites: string;
  instructions: string;
  blocages: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_REPORTS: DailyReport[] = [
  {
    date: "2026-06-10",
    meteo: "Ensoleillé",
    temperature: 34,
    effectifs: [
      { entreprise: "SETAB", role: "Ouvriers maçonnerie", count: 15 },
      { entreprise: "ElecPro", role: "Électriciens", count: 8 },
      { entreprise: "ClimaMed", role: "Techniciens CVC", count: 4 },
    ],
    travaux:
      "Coulage dalle R+1 bloc obstétrique terminé. Installation câblage CFO RDC en cours. Pose CTA sous-sol démarrée.",
    zones: ["R+1", "RDC", "Sous-sol"],
    incidents:
      "Chute de matériel mineure (sans blessés), signalée au chef de chantier. Périmètre de sécurité renforcé.",
    visites:
      "Visite du bureau de contrôle CTC pour inspection fondations. M. Benali (CTC) - 10h00 à 12h00.",
    instructions:
      "Accélérer coulage dalle R+2 pour rattraper retard planning. Respecter temps de cure 48h.",
    blocages:
      "Livraison armatures R+2 prévue le 12/06/2026 retardée au 14/06/2026.",
  },
  {
    date: "2026-06-09",
    meteo: "Nuageux",
    temperature: 28,
    effectifs: [
      { entreprise: "SETAB", role: "Ouvriers maçonnerie", count: 12 },
      { entreprise: "ElecPro", role: "Électriciens", count: 6 },
    ],
    travaux:
      "Ferraillage dalle R+1 terminé. Mise en place coffrages périphériques. Tirage câbles électriques RDC 60% avancement.",
    zones: ["R+1", "RDC"],
    incidents: "Aucun incident.",
    visites:
      "Réunion de chantier hebdomadaire N°24. Présence de 8 participants dont MOE, entreprises.",
    instructions:
      "Vérifier étanchéité coffrages avant coulage. Préparer bon de commande béton.",
    blocages: "Manque de personnel ElecPro (2 absents maladie).",
  },
  {
    date: "2026-06-05",
    meteo: "Pluvieux",
    temperature: 22,
    effectifs: [
      { entreprise: "SETAB", role: "Ouvriers maçonnerie", count: 8 },
      { entreprise: "ClimaMed", role: "Techniciens CVC", count: 6 },
      { entreprise: "MedFluides", role: "Plombiers", count: 4 },
    ],
    travaux:
      "Arrêt maçonnerie cause pluie. Travaux intérieurs: Installation gaines CVC sous-sol. Pose tuyauterie eau froide RDC.",
    zones: ["Sous-sol", "RDC"],
    incidents:
      "Infiltration eau dans sous-sol local technique. Pompage effectué. Investigation cause en cours.",
    visites:
      "Coordination CVC + Fluides médicaux. Présence bureau d'études ClimaMed.",
    instructions:
      "Traiter infiltration avant reprise travaux sous-sol. Contacter étanchéiste.",
    blocages:
      "Travaux extérieurs arrêtés cause pluie. Retard estimé: 0.5 jour.",
  },
];

const ALL_ZONES = ["RDC", "R+1", "R+2", "Sous-sol", "Extérieur"];

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getMeteoIcon(meteo: Meteo) {
  switch (meteo) {
    case "Ensoleillé":
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case "Nuageux":
      return <Cloud className="h-4 w-4 text-gray-400" />;
    case "Pluvieux":
      return <CloudRain className="h-4 w-4 text-blue-400" />;
    case "Orageux":
      return <Zap className="h-4 w-4 text-purple-500" />;
  }
}

function getMeteoEmoji(meteo: Meteo) {
  switch (meteo) {
    case "Ensoleillé": return "☀️";
    case "Nuageux": return "☁️";
    case "Pluvieux": return "🌧️";
    case "Orageux": return "⛈️";
  }
}

function totalEffectifs(effectifs: Effectif[]): number {
  return effectifs.reduce((s, e) => s + e.count, 0);
}

// ─── Weekly Summary ───────────────────────────────────────────────────────────

function WeeklySummary({ reports }: { reports: DailyReport[] }) {
  // Group by ISO week
  const weeks: Record<string, DailyReport[]> = {};
  reports.forEach((r) => {
    const d = parseDate(r.date);
    // Monday of that week
    const day = d.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1 - day);
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    const key = formatDate(mon);
    if (!weeks[key]) weeks[key] = [];
    weeks[key].push(r);
  });

  const sortedWeeks = Object.entries(weeks).sort(([a], [b]) =>
    a < b ? 1 : -1
  );

  if (sortedWeeks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun rapport disponible pour la synthèse.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedWeeks.map(([monStr, weekReports]) => {
        const mon = parseDate(monStr);
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        const allEffectifs = weekReports.flatMap((r) => r.effectifs);
        const companies = Array.from(
          new Set(allEffectifs.map((e) => e.entreprise))
        );
        const totalWorkers = weekReports.reduce(
          (s, r) => s + totalEffectifs(r.effectifs),
          0
        );
        const allZones = Array.from(
          new Set(weekReports.flatMap((r) => r.zones))
        );
        const hasIncidents = weekReports.some(
          (r) => r.incidents && r.incidents.toLowerCase() !== "aucun incident."
        );

        return (
          <Card key={monStr}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Semaine du{" "}
                {mon.getDate()} au {sun.getDate()}{" "}
                {MONTH_NAMES[sun.getMonth()]} {sun.getFullYear()}
                <Badge variant="secondary" className="ml-auto">
                  {weekReports.length} rapport{weekReports.length > 1 ? "s" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {weekReports.length}
                  </div>
                  <div className="text-xs text-blue-600">Jours travaillés</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {totalWorkers}
                  </div>
                  <div className="text-xs text-green-600">Effectifs cumulés</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {companies.length}
                  </div>
                  <div className="text-xs text-purple-600">Entreprises</div>
                </div>
                <div className={`rounded-lg p-3 text-center ${hasIncidents ? "bg-red-50" : "bg-gray-50"}`}>
                  <div className={`text-2xl font-bold ${hasIncidents ? "text-red-700" : "text-gray-500"}`}>
                    {hasIncidents ? "⚠️" : "✓"}
                  </div>
                  <div className={`text-xs ${hasIncidents ? "text-red-600" : "text-gray-500"}`}>
                    {hasIncidents ? "Incidents" : "Sans incident"}
                  </div>
                </div>
              </div>

              {/* Daily breakdown */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Récapitulatif journalier
                </h4>
                <div className="space-y-2">
                  {weekReports
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((r) => {
                      const d = parseDate(r.date);
                      return (
                        <div
                          key={r.date}
                          className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-1 min-w-[90px]">
                            {getMeteoIcon(r.meteo)}
                            <span className="font-medium text-gray-700">
                              {DAY_NAMES[(d.getDay() + 6) % 7]}{" "}
                              {String(d.getDate()).padStart(2, "0")}/{String(d.getMonth() + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="flex-1 text-gray-600 line-clamp-2">
                            {r.travaux}
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {totalEffectifs(r.effectifs)} pers.
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Zones */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Zones travaillées
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allZones.map((z) => (
                    <Badge key={z} className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {z}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Report Detail Panel ──────────────────────────────────────────────────────

function ReportDetail({ report }: { report: DailyReport }) {
  const d = parseDate(report.date);
  const dayName = DAY_NAMES[(d.getDay() + 6) % 7];
  const displayDate = `${dayName} ${String(d.getDate()).padStart(2, "0")} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {getMeteoIcon(report.meteo)}
        </div>
        <div>
          <div className="font-semibold text-gray-800">{displayDate}</div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>
              {getMeteoEmoji(report.meteo)} {report.meteo}
            </span>
            <span>·</span>
            <span>🌡️ {report.temperature}°C</span>
            <span>·</span>
            <span>👷 {totalEffectifs(report.effectifs)} personnes</span>
          </div>
        </div>
      </div>

      {/* Effectifs */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Users className="h-4 w-4 text-blue-500" />
          Effectifs par entreprise
        </h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600">
                  Entreprise
                </th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">
                  Rôle
                </th>
                <th className="text-right px-3 py-2 font-medium text-gray-600">
                  Nb
                </th>
              </tr>
            </thead>
            <tbody>
              {report.effectifs.map((e, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {e.entreprise}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{e.role}</td>
                  <td className="px-3 py-2 text-right">
                    <Badge variant="secondary">{e.count}</Badge>
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-semibold">
                <td className="px-3 py-2 text-blue-800" colSpan={2}>
                  Total
                </td>
                <td className="px-3 py-2 text-right">
                  <Badge className="bg-blue-600 hover:bg-blue-600">
                    {totalEffectifs(report.effectifs)}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Zones */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Zones travaillées
        </h4>
        <div className="flex flex-wrap gap-2">
          {report.zones.map((z) => (
            <Badge key={z} className="bg-green-100 text-green-800 hover:bg-green-100">
              {z}
            </Badge>
          ))}
        </div>
      </div>

      {/* Travaux */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FileText className="h-4 w-4 text-indigo-500" />
          Travaux réalisés
        </h4>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
          {report.travaux}
        </p>
      </div>

      {/* Incidents */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Incidents
        </h4>
        <p className="text-sm text-gray-700 bg-orange-50 rounded-lg p-3 leading-relaxed">
          {report.incidents}
        </p>
      </div>

      {/* Visites */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Eye className="h-4 w-4 text-purple-500" />
          Visites / Intervenants
        </h4>
        <p className="text-sm text-gray-700 bg-purple-50 rounded-lg p-3 leading-relaxed">
          {report.visites}
        </p>
      </div>

      {/* Instructions */}
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <CheckCircle className="h-4 w-4 text-blue-500" />
          Instructions données
        </h4>
        <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 leading-relaxed">
          {report.instructions}
        </p>
      </div>

      {/* Blocages */}
      {report.blocages && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Blocages
          </h4>
          <p className="text-sm text-gray-700 bg-red-50 rounded-lg p-3 leading-relaxed">
            {report.blocages}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── New Report Form ──────────────────────────────────────────────────────────

interface NewReportFormProps {
  onSave: (report: DailyReport) => void;
  onClose: () => void;
}

function NewReportForm({ onSave, onClose }: NewReportFormProps) {
  const today = formatDate(new Date());
  const [date, setDate] = useState(today);
  const [meteo, setMeteo] = useState<Meteo>("Ensoleillé");
  const [temperature, setTemperature] = useState("");
  const [effectifsText, setEffectifsText] = useState("");
  const [travaux, setTravaux] = useState("");
  const [zones, setZones] = useState<string[]>([]);
  const [incidents, setIncidents] = useState("");
  const [visites, setVisites] = useState("");
  const [instructions, setInstructions] = useState("");
  const [blocages, setBlocages] = useState("");

  function toggleZone(zone: string) {
    setZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Parse effectifs from textarea (one per line: "Entreprise, Rôle, N")
    const parsedEffectifs: Effectif[] = effectifsText
      .split("\n")
      .filter((l) => l.trim())
      .map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        return {
          entreprise: parts[0] || "",
          role: parts[1] || "",
          count: parseInt(parts[2] || "0", 10) || 0,
        };
      })
      .filter((e) => e.entreprise);

    onSave({
      date,
      meteo,
      temperature: parseFloat(temperature) || 0,
      effectifs: parsedEffectifs,
      travaux,
      zones,
      incidents: incidents || "Aucun incident.",
      visites,
      instructions,
      blocages,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date */}
        <div className="space-y-1">
          <Label htmlFor="date" className="text-sm font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Météo */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">Météo</Label>
          <Select
            value={meteo}
            onValueChange={(v) => setMeteo(v as Meteo)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ensoleillé">☀️ Ensoleillé</SelectItem>
              <SelectItem value="Nuageux">☁️ Nuageux</SelectItem>
              <SelectItem value="Pluvieux">🌧️ Pluvieux</SelectItem>
              <SelectItem value="Orageux">⛈️ Orageux</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Température */}
        <div className="space-y-1">
          <Label htmlFor="temp" className="text-sm font-medium">
            Température (°C)
          </Label>
          <Input
            id="temp"
            type="number"
            placeholder="ex: 28"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>
      </div>

      {/* Effectifs */}
      <div className="space-y-1">
        <Label htmlFor="effectifs" className="text-sm font-medium">
          Effectifs par entreprise{" "}
          <span className="text-gray-400 font-normal">
            (format: Entreprise, Rôle, Nombre — une ligne par entrée)
          </span>
        </Label>
        <Textarea
          id="effectifs"
          placeholder={"SETAB, Ouvriers maçonnerie, 15\nElecPro, Électriciens, 8"}
          value={effectifsText}
          onChange={(e) => setEffectifsText(e.target.value)}
          rows={3}
        />
      </div>

      {/* Travaux */}
      <div className="space-y-1">
        <Label htmlFor="travaux" className="text-sm font-medium">
          Travaux réalisés
        </Label>
        <Textarea
          id="travaux"
          placeholder="Décrire les travaux effectués aujourd'hui..."
          value={travaux}
          onChange={(e) => setTravaux(e.target.value)}
          rows={3}
          required
        />
      </div>

      {/* Zones */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Zones travaillées</Label>
        <div className="flex flex-wrap gap-3">
          {ALL_ZONES.map((zone) => (
            <label
              key={zone}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={zones.includes(zone)}
                onChange={() => toggleZone(zone)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{zone}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Incidents */}
      <div className="space-y-1">
        <Label htmlFor="incidents" className="text-sm font-medium">
          Incidents
        </Label>
        <Textarea
          id="incidents"
          placeholder="Décrire tout incident ou écrire « Aucun incident. »"
          value={incidents}
          onChange={(e) => setIncidents(e.target.value)}
          rows={2}
        />
      </div>

      {/* Visites */}
      <div className="space-y-1">
        <Label htmlFor="visites" className="text-sm font-medium">
          Visites / Intervenants
        </Label>
        <Textarea
          id="visites"
          placeholder="Visites, réunions, intervenants extérieurs..."
          value={visites}
          onChange={(e) => setVisites(e.target.value)}
          rows={2}
        />
      </div>

      {/* Instructions */}
      <div className="space-y-1">
        <Label htmlFor="instructions" className="text-sm font-medium">
          Instructions données
        </Label>
        <Textarea
          id="instructions"
          placeholder="Instructions transmises aux équipes..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
        />
      </div>

      {/* Blocages */}
      <div className="space-y-1">
        <Label htmlFor="blocages" className="text-sm font-medium">
          Blocages
        </Label>
        <Textarea
          id="blocages"
          placeholder="Blocages, retards, points bloquants..."
          value={blocages}
          onChange={(e) => setBlocages(e.target.value)}
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Enregistrer le rapport
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [reports, setReports] = useState<DailyReport[]>(INITIAL_REPORTS);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed → June
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isSynthesisOpen, setIsSynthesisOpen] = useState(false);

  // Build a set for O(1) lookup
  const reportDates = new Set(reports.map((r) => r.date));

  const selectedReport = selectedDate
    ? reports.find((r) => r.date === selectedDate) ?? null
    : null;

  // ── Calendar helpers ──

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  // First day of month (0=Sun, adjusted for Mon-first)
  const firstDayDate = new Date(currentYear, currentMonth, 1);
  const firstWeekday = (firstDayDate.getDay() + 6) % 7; // 0=Mon
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Total cells (always fill to complete weeks)
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  function handleDayClick(day: number) {
    const d = new Date(currentYear, currentMonth, day);
    const str = formatDate(d);
    setSelectedDate((prev) => (prev === str ? null : str));
  }

  function handleSaveReport(report: DailyReport) {
    setReports((prev) => {
      const idx = prev.findIndex((r) => r.date === report.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = report;
        return updated;
      }
      return [...prev, report];
    });
    setIsNewReportOpen(false);
  }

  const today = formatDate(new Date());

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Journal de Chantier
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Polyclinique — suivi quotidien des activités
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Weekly synthesis */}
          <Dialog open={isSynthesisOpen} onOpenChange={setIsSynthesisOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Synthèse hebdomadaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Synthèse hebdomadaire
                </DialogTitle>
              </DialogHeader>
              <WeeklySummary reports={reports} />
            </DialogContent>
          </Dialog>

          {/* New report */}
          <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Saisir rapport du jour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Nouveau rapport journalier
                </DialogTitle>
              </DialogHeader>
              <NewReportForm
                onSave={handleSaveReport}
                onClose={() => setIsNewReportOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Calendar ── */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              {/* Month navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                  Rapport saisi
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                  Aujourd&apos;hui
                </span>
              </div>
            </CardHeader>

            <CardContent>
              {/* Day names header */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-gray-500 py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalCells }).map((_, idx) => {
                  const dayNum = idx - firstWeekday + 1;
                  if (dayNum < 1 || dayNum > daysInMonth) {
                    return <div key={idx} className="h-12" />;
                  }

                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const hasReport = reportDates.has(dateStr);
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(dayNum)}
                      className={[
                        "h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm font-medium transition-all",
                        isSelected
                          ? "bg-blue-600 text-white shadow-md"
                          : isToday
                          ? "bg-orange-100 text-orange-700 border border-orange-300"
                          : hasReport
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                    >
                      <span>{dayNum}</span>
                      {hasReport && (
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            isSelected ? "bg-white" : "bg-blue-500",
                          ].join(" ")}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Summary footer */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                <span>
                  {
                    reports.filter((r) => {
                      const d = parseDate(r.date);
                      return (
                        d.getFullYear() === currentYear &&
                        d.getMonth() === currentMonth
                      );
                    }).length
                  }{" "}
                  rapport(s) ce mois
                </span>
                <span>
                  {reports.length} rapport(s) au total
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Side Panel ── */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <Card className="sticky top-6">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Rapport du jour
                  </span>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                    aria-label="Fermer"
                  >
                    ×
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                <ReportDetail report={selectedReport} />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                <Calendar className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium text-sm">
                  Sélectionnez un jour
                </p>
                <p className="text-xs mt-1">
                  Les jours avec un point bleu ont un rapport saisi.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Recent Reports List ── */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400" />
          Derniers rapports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...reports]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 3)
            .map((r) => {
              const d = parseDate(r.date);
              const displayDate = `${String(d.getDate()).padStart(2, "0")} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
              return (
                <button
                  key={r.date}
                  onClick={() => setSelectedDate(r.date)}
                  className={[
                    "text-left p-4 rounded-xl border transition-all hover:shadow-md",
                    selectedDate === r.date
                      ? "border-blue-400 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-200",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {displayDate}
                    </span>
                    <div className="flex items-center gap-1">
                      {getMeteoIcon(r.meteo)}
                      <span className="text-xs text-gray-500">
                        {r.temperature}°C
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {r.travaux}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {r.zones.map((z) => (
                        <Badge
                          key={z}
                          variant="secondary"
                          className="text-xs py-0"
                        >
                          {z}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {totalEffectifs(r.effectifs)}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
