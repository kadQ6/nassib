"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Download,
  Plus,
  FlaskConical,
  ClipboardList,
  FolderOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseStatus = "completed" | "in_progress" | "not_started";

interface Phase {
  label: string;
  status: PhaseStatus;
  progress: number;
}

type EssaiStatut = "réalisé" | "planifié" | "non_planifié";
type EssaiResultat = "conforme" | "non_conforme" | "";

interface Essai {
  id: number;
  système: string;
  zone: string;
  type: string;
  datePrevue: string;
  dateReelle: string;
  responsable: string;
  resultat: EssaiResultat;
  pv: string;
  statut: EssaiStatut;
}

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
}

type DOEStatut = "remis" | "en_cours" | "non_remis";

interface DOEDocument {
  doc: string;
  lot: string;
  statut: DOEStatut;
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PHASES: Phase[] = [
  { label: "Essais Intermédiaires", status: "in_progress", progress: 40 },
  { label: "Essais Finaux", status: "not_started", progress: 0 },
  { label: "OPR", status: "not_started", progress: 0 },
  { label: "Réception Provisoire", status: "not_started", progress: 0 },
  { label: "Levée Réserves", status: "not_started", progress: 0 },
  { label: "DOE Remis", status: "not_started", progress: 0 },
  { label: "Mise en Exploitation", status: "not_started", progress: 0 },
];

const ESSAIS_MOCK: Essai[] = [
  {
    id: 1,
    système: "EF/EC",
    zone: "RDC Général",
    type: "Pression réseau",
    datePrevue: "20/06/2026",
    dateReelle: "20/06/2026",
    responsable: "R. Meziane",
    resultat: "conforme",
    pv: "PV-001",
    statut: "réalisé",
  },
  {
    id: 2,
    système: "Plomberie",
    zone: "Bloc obstétrique",
    type: "Étanchéité",
    datePrevue: "22/06/2026",
    dateReelle: "22/06/2026",
    responsable: "R. Meziane",
    resultat: "conforme",
    pv: "PV-002",
    statut: "réalisé",
  },
  {
    id: 3,
    système: "Électricité CF",
    zone: "TGBT RDC",
    type: "Continuité/terre",
    datePrevue: "25/06/2026",
    dateReelle: "25/06/2026",
    responsable: "K. Aïssaoui",
    resultat: "non_conforme",
    pv: "PV-003",
    statut: "réalisé",
  },
  {
    id: 4,
    système: "SSI",
    zone: "RDC + R+1",
    type: "Détection incendie",
    datePrevue: "01/07/2026",
    dateReelle: "",
    responsable: "N. Ouali",
    resultat: "",
    pv: "",
    statut: "planifié",
  },
  {
    id: 5,
    système: "CVC",
    zone: "Bloc opératoire",
    type: "Débit/température",
    datePrevue: "05/07/2026",
    dateReelle: "",
    responsable: "A. Hamdani",
    resultat: "",
    pv: "",
    statut: "planifié",
  },
  {
    id: 6,
    système: "Fluides O2",
    zone: "Bloc opératoire",
    type: "Pression/débit O2",
    datePrevue: "10/07/2026",
    dateReelle: "",
    responsable: "S. Benali",
    resultat: "",
    pv: "",
    statut: "non_planifié",
  },
  {
    id: 7,
    système: "Fluides Vide",
    zone: "Bloc opératoire",
    type: "Vide médical",
    datePrevue: "10/07/2026",
    dateReelle: "",
    responsable: "S. Benali",
    resultat: "",
    pv: "",
    statut: "non_planifié",
  },
  {
    id: 8,
    système: "Groupe élec.",
    zone: "Local technique",
    type: "Démarrage auto",
    datePrevue: "15/07/2026",
    dateReelle: "03/07/2026",
    responsable: "K. Aïssaoui",
    resultat: "conforme",
    pv: "PV-004",
    statut: "réalisé",
  },
];

const LOCAL_LIST: string[] = [
  "Salle de naissance 01",
  "Salle de naissance 02",
  "Bloc opératoire 01",
  "Bloc opératoire 02",
  "Salle de réveil",
  "Urgences adultes",
  "Urgences pédiatriques",
  "Laboratoire",
  "Pharmacie",
  "Bureau médecin 01",
];

const CHECKLIST_LABELS: string[] = [
  "Local nettoyé",
  "Sol terminé et conforme",
  "Murs terminés",
  "Plafond terminé",
  "Portes/fenêtres posées et fonctionnelles",
  "Éclairage fonctionnel",
  "Prises fonctionnelles",
  "CVC fonctionnel",
  "Plomberie fonctionnelle",
  "SSI conforme",
  "VDI conforme",
  "Fluides médicaux conformes",
  "Équipements installés",
  "Réserves levées",
  "DOE disponible",
];

function buildChecklist(localName: string): ChecklistItem[] {
  const checkedCount = localName === "Bloc opératoire 01" ? 5 : 3;
  return CHECKLIST_LABELS.map((label, idx) => ({
    id: idx + 1,
    label,
    checked: idx < checkedCount,
  }));
}

const INITIAL_CHECKLISTS: Record<string, ChecklistItem[]> = Object.fromEntries(
  LOCAL_LIST.map((name) => [name, buildChecklist(name)])
);

const DOE_DOCUMENTS: DOEDocument[] = [
  { doc: "Plans architecturaux finaux", lot: "Architecture", statut: "remis", date: "15/05/2026" },
  { doc: "Plans structure béton", lot: "GC", statut: "remis", date: "20/05/2026" },
  { doc: "Plans CVC exécution", lot: "CVC", statut: "en_cours", date: "" },
  { doc: "Plans électricité CFO", lot: "CFO", statut: "en_cours", date: "" },
  { doc: "Plans fluides médicaux", lot: "Fluides", statut: "non_remis", date: "" },
  { doc: "PV essais plomberie", lot: "Plomberie", statut: "remis", date: "22/06/2026" },
  { doc: "Notices équipements CVC", lot: "CVC", statut: "non_remis", date: "" },
  { doc: "Schémas électriques TGBT", lot: "CFO", statut: "non_remis", date: "" },
  { doc: "Fiches techniques matériaux", lot: "GC", statut: "en_cours", date: "" },
  { doc: "Plans courants faibles SSI/GTB", lot: "CFA", statut: "non_remis", date: "" },
  { doc: "PV essais électricité", lot: "CFO", statut: "non_remis", date: "" },
  { doc: "Rapport géotechnique final", lot: "GC", statut: "remis", date: "10/03/2026" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhaseStepper() {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">Avancement des phases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start overflow-x-auto pb-2">
          {PHASES.map((phase, idx) => (
            <div key={phase.label} className="flex items-start">
              {/* Step node */}
              <div className="flex flex-col items-center min-w-[100px] px-1">
                {/* Circle */}
                <div className="relative">
                  {phase.status === "completed" && (
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {phase.status === "in_progress" && (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-sm ring-4 ring-blue-100">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {phase.status === "not_started" && (
                    <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`mt-2 text-[11px] font-medium text-center leading-tight max-w-[90px] ${
                    phase.status === "in_progress"
                      ? "text-blue-700"
                      : phase.status === "completed"
                      ? "text-green-700"
                      : "text-slate-400"
                  }`}
                >
                  {phase.label}
                </span>
                {/* Progress mini bar for in_progress */}
                {phase.status === "in_progress" && (
                  <div className="mt-1 w-16">
                    <div className="w-full bg-blue-100 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold">{phase.progress}%</span>
                  </div>
                )}
              </div>
              {/* Connector line */}
              {idx < PHASES.length - 1 && (
                <div
                  className={`h-0.5 min-w-[24px] flex-1 mt-[18px] ${
                    PHASES[idx + 1].status === "completed" || phase.status === "completed"
                      ? "bg-green-300"
                      : phase.status === "in_progress"
                      ? "bg-gradient-to-r from-blue-300 to-slate-200"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCards() {
  const réalisés = ESSAIS_MOCK.filter((e) => e.statut === "réalisé").length;
  const conformes = ESSAIS_MOCK.filter((e) => e.resultat === "conforme").length;
  const nonConformes = ESSAIS_MOCK.filter((e) => e.resultat === "non_conforme").length;
  const nonRéalisés = ESSAIS_MOCK.filter(
    (e) => e.statut === "planifié" || e.statut === "non_planifié"
  ).length;
  const doeRemis = DOE_DOCUMENTS.filter((d) => d.statut === "remis").length;
  const doeTotal = DOE_DOCUMENTS.length;

  const stats = [
    {
      label: "Essais planifiés",
      value: ESSAIS_MOCK.length,
      sub: `${réalisés} réalisés`,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Conformes",
      value: conformes,
      sub: "résultats OK",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      label: "Non conformes",
      value: nonConformes,
      sub: "à reprendre",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      label: "Non réalisés",
      value: nonRéalisés,
      sub: "en attente",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      label: "Checklists locaux",
      value: "48 locaux",
      sub: "à valider",
      color: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
    },
    {
      label: "DOE",
      value: `${doeRemis}/${doeTotal}`,
      sub: "documents remis",
      color: "text-slate-700",
      bg: "bg-slate-50",
      border: "border-slate-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className={`bg-white border ${s.border} shadow-sm`}>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EssaiStatutBadge({ statut }: { statut: EssaiStatut }) {
  if (statut === "réalisé") return <Badge variant="success">Réalisé</Badge>;
  if (statut === "planifié") return <Badge variant="info">Planifié</Badge>;
  return <Badge variant="secondary">Non planifié</Badge>;
}

function EssaiResultatBadge({ resultat }: { resultat: EssaiResultat }) {
  if (resultat === "conforme") return <Badge variant="success">Conforme</Badge>;
  if (resultat === "non_conforme") return <Badge variant="destructive">Non conforme</Badge>;
  return <span className="text-slate-400 text-xs">—</span>;
}

function DOEStatutBadge({ statut }: { statut: DOEStatut }) {
  if (statut === "remis") return <Badge variant="success">Remis</Badge>;
  if (statut === "en_cours") return <Badge variant="warning">En cours</Badge>;
  return <Badge variant="outline">Non remis</Badge>;
}

interface EssaisTabProps {
  essais: Essai[];
  onAdd: (e: Essai) => void;
}

function EssaisTab({ essais, onAdd }: EssaisTabProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    système: string;
    zone: string;
    type: string;
    datePrevue: string;
    responsable: string;
  }>({ système: "", zone: "", type: "", datePrevue: "", responsable: "" });

  function handleSubmit() {
    if (!form.système.trim()) return;
    const newEntry: Essai = {
      id: essais.length + 1,
      système: form.système,
      zone: form.zone,
      type: form.type,
      datePrevue: form.datePrevue,
      dateReelle: "",
      responsable: form.responsable,
      resultat: "",
      pv: "",
      statut: "planifié",
    };
    onAdd(newEntry);
    setForm({ système: "", zone: "", type: "", datePrevue: "", responsable: "" });
    setOpen(false);
  }

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-600" />
            Liste des essais techniques
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Nouvel essai
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un essai</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="système">Système</Label>
                  <Input
                    id="système"
                    value={form.système}
                    onChange={(e) => setForm((f) => ({ ...f, système: e.target.value }))}
                    placeholder="Ex: EF/EC"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    value={form.zone}
                    onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
                    placeholder="Ex: RDC Général"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="type">Type d'essai</Label>
                  <Input
                    id="type"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    placeholder="Ex: Pression réseau"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="datePrevue">Date prévue</Label>
                  <Input
                    id="datePrevue"
                    value={form.datePrevue}
                    onChange={(e) => setForm((f) => ({ ...f, datePrevue: e.target.value }))}
                    placeholder="JJ/MM/AAAA"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input
                    id="responsable"
                    value={form.responsable}
                    onChange={(e) => setForm((f) => ({ ...f, responsable: e.target.value }))}
                    placeholder="Ex: R. Meziane"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                    Annuler
                  </Button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="text-xs font-semibold text-slate-600 py-3">Système</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Zone</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Type</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 whitespace-nowrap">Date Prévue</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 whitespace-nowrap">Date Réelle</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Responsable</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Résultat</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">PV</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {essais.map((e) => (
                <TableRow key={e.id} className="hover:bg-slate-50 border-b border-slate-100">
                  <TableCell className="text-sm font-medium text-slate-800">{e.système}</TableCell>
                  <TableCell className="text-sm text-slate-600">{e.zone}</TableCell>
                  <TableCell className="text-sm text-slate-600">{e.type}</TableCell>
                  <TableCell className="text-sm text-slate-600 whitespace-nowrap">{e.datePrevue}</TableCell>
                  <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                    {e.dateReelle || <span className="text-slate-300">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{e.responsable}</TableCell>
                  <TableCell>
                    <EssaiResultatBadge resultat={e.resultat} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {e.pv ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-medium text-xs">
                        <FileText className="w-3 h-3" />
                        {e.pv}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <EssaiStatutBadge statut={e.statut} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChecklistsTabProps {
  checklists: Record<string, ChecklistItem[]>;
  selectedLocal: string;
  onSelectLocal: (l: string) => void;
  onToggle: (local: string, id: number) => void;
}

function ChecklistsTab({ checklists, selectedLocal, onSelectLocal, onToggle }: ChecklistsTabProps) {
  const items = checklists[selectedLocal] ?? [];
  const checkedCount = items.filter((i) => i.checked).length;
  const progressPct = Math.round((checkedCount / items.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Local selector panel */}
      <Card className="bg-white border border-slate-200 shadow-sm lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Sélectionner un local</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-3">
          <div className="mb-3 px-2">
            <Select value={selectedLocal} onValueChange={onSelectLocal}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Choisir un local" />
              </SelectTrigger>
              <SelectContent>
                {LOCAL_LIST.map((name) => (
                  <SelectItem key={name} value={name} className="text-sm">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-0.5">
            {LOCAL_LIST.map((name) => {
              const localItems = checklists[name] ?? [];
              const count = localItems.filter((i) => i.checked).length;
              const pct = Math.round((count / localItems.length) * 100);
              const isSelected = selectedLocal === name;
              return (
                <button
                  key={name}
                  onClick={() => onSelectLocal(name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="truncate text-xs font-medium">{name}</span>
                  <span
                    className={`ml-2 shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : pct === 100
                        ? "bg-green-100 text-green-700"
                        : pct > 0
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}/{localItems.length}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Checklist panel */}
      <Card className="bg-white border border-slate-200 shadow-sm lg:col-span-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              {selectedLocal}
            </CardTitle>
            <span className="text-xs text-slate-500 font-medium">
              {checkedCount}/{items.length} validés
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <Progress value={progressPct} className="h-2" />
            <p className="text-[11px] text-slate-500">{progressPct}% complété</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  item.checked
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Checkbox
                  id={`item-${selectedLocal}-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={() => onToggle(selectedLocal, item.id)}
                  className={item.checked ? "border-green-500 data-[state=checked]:bg-green-500" : ""}
                />
                <label
                  htmlFor={`item-${selectedLocal}-${item.id}`}
                  className={`text-sm cursor-pointer select-none flex-1 ${
                    item.checked ? "text-green-800 line-through decoration-green-400" : "text-slate-700"
                  }`}
                >
                  <span className="text-slate-400 text-xs mr-2 font-mono">
                    {String(item.id).padStart(2, "0")}
                  </span>
                  {item.label}
                </label>
                {item.checked && (
                  <Badge variant="success" className="text-[10px] px-1.5 py-0">
                    OK
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DOETab() {
  const remis = DOE_DOCUMENTS.filter((d) => d.statut === "remis").length;
  const total = DOE_DOCUMENTS.length;
  const pct = Math.round((remis / total) * 100);

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-600" />
            Dossier des Ouvrages Exécutés (DOE)
          </CardTitle>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Documents remis</span>
            <span className="font-semibold text-slate-700">{remis} / {total}</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {(
            [
              { label: "Remis", statut: "remis", variant: "success" },
              { label: "En cours", statut: "en_cours", variant: "warning" },
              { label: "Non remis", statut: "non_remis", variant: "outline" },
            ] as { label: string; statut: DOEStatut; variant: "success" | "warning" | "outline" }[]
          ).map(({ label, statut, variant }) => (
            <div key={statut} className="flex items-center gap-1.5">
              <Badge variant={variant} className="text-xs">
                {label}
              </Badge>
              <span className="text-xs text-slate-500 font-semibold">
                {DOE_DOCUMENTS.filter((d) => d.statut === statut).length}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="text-xs font-semibold text-slate-600 py-3">Document</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Lot</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">Statut</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 whitespace-nowrap">Date remise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOE_DOCUMENTS.map((d, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50 border-b border-slate-100">
                  <TableCell className="text-sm font-medium text-slate-800">{d.doc}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {d.lot}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DOEStatutBadge statut={d.statut} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                    {d.date || <span className="text-slate-300">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ReceptionPage() {
  const [essais, setEssais] = useState<Essai[]>(ESSAIS_MOCK);
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>(INITIAL_CHECKLISTS);
  const [selectedLocal, setSelectedLocal] = useState<string>("Bloc opératoire 01");

  function handleAddEssai(e: Essai) {
    setEssais((prev) => [...prev, e]);
  }

  function handleToggleItem(local: string, id: number) {
    setChecklists((prev) => ({
      ...prev,
      [local]: prev[local].map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Essais &amp; Réception OPR</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Suivi des essais techniques, checklists locaux et dossier des ouvrages exécutés
        </p>
      </div>

      {/* Phase stepper */}
      <PhaseStepper />

      {/* Stat cards */}
      <StatCards />

      {/* Main tabs */}
      <Tabs defaultValue="essais">
        <TabsList className="bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="essais" className="text-sm font-medium">
            Essais
          </TabsTrigger>
          <TabsTrigger value="checklists" className="text-sm font-medium">
            Checklists Locaux
          </TabsTrigger>
          <TabsTrigger value="doe" className="text-sm font-medium">
            DOE
          </TabsTrigger>
        </TabsList>

        <TabsContent value="essais" className="mt-4">
          <EssaisTab essais={essais} onAdd={handleAddEssai} />
        </TabsContent>

        <TabsContent value="checklists" className="mt-4">
          <ChecklistsTab
            checklists={checklists}
            selectedLocal={selectedLocal}
            onSelectLocal={setSelectedLocal}
            onToggle={handleToggleItem}
          />
        </TabsContent>

        <TabsContent value="doe" className="mt-4">
          <DOETab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
