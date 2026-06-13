"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  Check,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type EssaiStatut = "conforme" | "non_conforme" | "planifie" | "non_planifie";

interface Essai {
  id: number;
  systeme: string;
  zone: string;
  type: string;
  datePrevue: string;
  dateReelle: string;
  responsable: string;
  resultat: string;
  statut: EssaiStatut;
}

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
  comment: string;
}

interface DOEItem {
  document: string;
  responsable: string;
  statut: "Reçu" | "En cours" | "En attente" | "Non remis";
  dateRemise: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASES = [
  { label: "Essais Intermédiaires", progress: 40, status: "in_progress" },
  { label: "Essais Finaux", progress: 0, status: "not_started" },
  { label: "OPR", progress: 0, status: "not_started" },
  { label: "Réception Provisoire", progress: 0, status: "not_started" },
  { label: "Levée Réserves", progress: 0, status: "not_started" },
  { label: "DOE Remis", progress: 0, status: "not_started" },
  { label: "Mise en Exploitation", progress: 0, status: "not_started" },
];

const ESSAIS_MOCK: Essai[] = [
  {
    id: 1,
    systeme: "Alimentation EF/EC",
    zone: "Ensemble bâtiment",
    type: "Pression",
    datePrevue: "15/05/2026",
    dateReelle: "18/05/2026",
    responsable: "MedFluides",
    resultat: "Conforme",
    statut: "conforme",
  },
  {
    id: 2,
    systeme: "Plomberie sanitaires",
    zone: "RDC + R+1",
    type: "Pression hydraulique",
    datePrevue: "20/05/2026",
    dateReelle: "22/05/2026",
    responsable: "MedFluides",
    resultat: "Conforme",
    statut: "conforme",
  },
  {
    id: 3,
    systeme: "Électricité CF",
    zone: "Tableaux TGBT",
    type: "Vérification continuité",
    datePrevue: "25/05/2026",
    dateReelle: "28/05/2026",
    responsable: "ElecPro",
    resultat: "Non conforme - reprise nécessaire",
    statut: "non_conforme",
  },
  {
    id: 4,
    systeme: "Terre et continuité",
    zone: "Ensemble bâtiment",
    type: "Mesure résistance",
    datePrevue: "25/05/2026",
    dateReelle: "29/05/2026",
    responsable: "ElecPro",
    resultat: "Conforme",
    statut: "conforme",
  },
  {
    id: 5,
    systeme: "SSI",
    zone: "Ensemble bâtiment",
    type: "Fonctionnel complet",
    datePrevue: "10/06/2026",
    dateReelle: "-",
    responsable: "SecuFire",
    resultat: "-",
    statut: "planifie",
  },
  {
    id: 6,
    systeme: "CVC - CTA",
    zone: "Sous-sol + R+1",
    type: "Équilibrage aéraulique",
    datePrevue: "15/06/2026",
    dateReelle: "-",
    responsable: "ClimaMed",
    resultat: "-",
    statut: "planifie",
  },
  {
    id: 7,
    systeme: "Fluides O2",
    zone: "Bloc chirurgie",
    type: "Étanchéité + pression",
    datePrevue: "20/06/2026",
    dateReelle: "-",
    responsable: "MedGaz",
    resultat: "-",
    statut: "planifie",
  },
  {
    id: 8,
    systeme: "Groupe électrogène",
    zone: "Local technique",
    type: "Test coupure + bascule",
    datePrevue: "25/06/2026",
    dateReelle: "-",
    responsable: "ElecPro",
    resultat: "-",
    statut: "non_planifie",
  },
];

const CHECKLIST_LABELS = [
  "Local nettoyé",
  "Sol terminé et conforme",
  "Murs terminés et conformes",
  "Plafond terminé et conforme",
  "Portes/fenêtres posées et fonctionnelles",
  "Éclairage fonctionnel",
  "Prises électriques fonctionnelles",
  "CVC fonctionnel",
  "Plomberie fonctionnelle",
  "SSI conforme",
  "VDI conforme",
  "Fluides médicaux conformes",
  "Équipements installés",
  "Réserves levées",
  "DOE disponible",
];

const ROOMS = [
  "Salle OP 1",
  "Salle OP 2",
  "SSPI",
  "Stérilisation",
  "Pharmacie",
  "Laboratoire",
  "Urgences",
  "Consultation 1-5",
  "Radiologie",
  "Administration",
];

const ROOM_INITIAL_CHECKS: Record<string, number> = {
  "Salle OP 1": 6,
  "Salle OP 2": 3,
};

function buildChecklist(room: string): ChecklistItem[] {
  const preChecked = ROOM_INITIAL_CHECKS[room] ?? 0;
  return CHECKLIST_LABELS.map((label, idx) => ({
    id: idx + 1,
    label,
    checked: idx < preChecked,
    comment: "",
  }));
}

const DOE_ITEMS: DOEItem[] = [
  {
    document: "Plans architecturaux finaux",
    responsable: "Architecte",
    statut: "Reçu",
    dateRemise: "01/06/2026",
  },
  {
    document: "Plans exécution structure",
    responsable: "SETAB",
    statut: "Reçu",
    dateRemise: "01/06/2026",
  },
  {
    document: "Plans exécution CVC",
    responsable: "ClimaMed",
    statut: "En attente",
    dateRemise: "15/06/2026",
  },
  {
    document: "Plans fluides médicaux",
    responsable: "MedFluides",
    statut: "En attente",
    dateRemise: "20/06/2026",
  },
  {
    document: "Schémas électriques finaux",
    responsable: "ElecPro",
    statut: "En cours",
    dateRemise: "10/06/2026",
  },
  {
    document: "PV essais plomberie",
    responsable: "MedFluides",
    statut: "Reçu",
    dateRemise: "25/05/2026",
  },
  {
    document: "PV essais électricité",
    responsable: "ElecPro",
    statut: "En cours",
    dateRemise: "15/06/2026",
  },
  {
    document: "Notice SSI + PV réception SSI",
    responsable: "SecuFire",
    statut: "Non remis",
    dateRemise: "30/06/2026",
  },
  {
    document: "Certificats matériaux",
    responsable: "SETAB",
    statut: "Reçu",
    dateRemise: "01/06/2026",
  },
  {
    document: "Manuel maintenance CVC",
    responsable: "ClimaMed",
    statut: "Non remis",
    dateRemise: "30/06/2026",
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function EssaiStatutBadge({ statut }: { statut: EssaiStatut }) {
  const map: Record<EssaiStatut, { label: string; className: string }> = {
    conforme: {
      label: "Conforme",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    non_conforme: {
      label: "Non conforme",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    planifie: {
      label: "Planifié",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    non_planifie: {
      label: "Non planifié",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
  };
  const { label, className } = map[statut];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function DOEStatutBadge({ statut }: { statut: DOEItem["statut"] }) {
  const map: Record<DOEItem["statut"], string> = {
    Reçu: "bg-green-100 text-green-800 border-green-200",
    "En cours": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "En attente": "bg-blue-100 text-blue-800 border-blue-200",
    "Non remis": "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[statut]}`}
    >
      {statut}
    </span>
  );
}

function PhaseIcon({
  status,
  progress,
}: {
  status: string;
  progress: number;
}) {
  if (status === "in_progress") {
    return (
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-md">
        <Clock className="w-5 h-5" />
      </div>
    );
  }
  if (progress === 100) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white shadow-md">
        <CheckCircle className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-400">
      <Circle className="w-5 h-5" />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReceptionPage() {
  // Essais state
  const [essais, setEssais] = useState<Essai[]>(ESSAIS_MOCK);
  const [newEssaiOpen, setNewEssaiOpen] = useState(false);
  const [newEssai, setNewEssai] = useState<Partial<Essai>>({});

  // Checklist state — lazy-init per room
  const [selectedRoom, setSelectedRoom] = useState<string>(ROOMS[0]);
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>(
    () => {
      const initial: Record<string, ChecklistItem[]> = {};
      ROOMS.forEach((r) => {
        initial[r] = buildChecklist(r);
      });
      return initial;
    }
  );

  const currentChecklist = checklists[selectedRoom] ?? [];
  const checkedCount = currentChecklist.filter((i) => i.checked).length;
  const checklistProgress = Math.round((checkedCount / 15) * 100);

  function toggleChecklistItem(roomName: string, itemId: number) {
    setChecklists((prev) => ({
      ...prev,
      [roomName]: prev[roomName].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  }

  function updateChecklistComment(
    roomName: string,
    itemId: number,
    comment: string
  ) {
    setChecklists((prev) => ({
      ...prev,
      [roomName]: prev[roomName].map((item) =>
        item.id === itemId ? { ...item, comment } : item
      ),
    }));
  }

  function handleAddEssai() {
    if (!newEssai.systeme) return;
    const entry: Essai = {
      id: essais.length + 1,
      systeme: newEssai.systeme ?? "",
      zone: newEssai.zone ?? "",
      type: newEssai.type ?? "",
      datePrevue: newEssai.datePrevue ?? "-",
      dateReelle: "-",
      responsable: newEssai.responsable ?? "",
      resultat: "-",
      statut: "non_planifie",
    };
    setEssais((prev) => [...prev, entry]);
    setNewEssai({});
    setNewEssaiOpen(false);
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Essais &amp; Réception OPR
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Suivi des essais techniques, checklists locaux et dossier des ouvrages
          exécutés
        </p>
      </div>

      {/* Phase progress tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Avancement des phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {PHASES.map((phase, idx) => (
              <div key={phase.label} className="flex items-center">
                {/* Step */}
                <div className="flex flex-col items-center min-w-[110px]">
                  <PhaseIcon
                    status={phase.status}
                    progress={phase.progress}
                  />
                  <span
                    className={`mt-2 text-xs font-medium text-center leading-tight ${
                      phase.status === "in_progress"
                        ? "text-blue-700"
                        : "text-gray-500"
                    }`}
                  >
                    {phase.label}
                  </span>
                  {phase.status === "in_progress" && (
                    <div className="mt-1 w-20">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[10px] text-blue-600 font-semibold">
                          {phase.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {phase.status === "not_started" && phase.progress === 0 && (
                    <span className="mt-1 text-[10px] text-gray-400">
                      Non démarré
                    </span>
                  )}
                </div>

                {/* Connector line */}
                {idx < PHASES.length - 1 && (
                  <div className="flex-1 min-w-[16px] h-0.5 bg-gray-200 mb-10" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="essais">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="essais">Essais</TabsTrigger>
          <TabsTrigger value="checklists">Checklists Locaux</TabsTrigger>
          <TabsTrigger value="doe">DOE</TabsTrigger>
        </TabsList>

        {/* ── Tab: Essais ─────────────────────────────────────────── */}
        <TabsContent value="essais" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Essais techniques</CardTitle>
              <Dialog open={newEssaiOpen} onOpenChange={setNewEssaiOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-4 h-4" />
                    Nouvel Essai
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel essai</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm">Système</Label>
                      <Input
                        className="col-span-3"
                        value={newEssai.systeme ?? ""}
                        onChange={(e) =>
                          setNewEssai((p) => ({
                            ...p,
                            systeme: e.target.value,
                          }))
                        }
                        placeholder="Ex: Alimentation EF/EC"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm">Zone</Label>
                      <Input
                        className="col-span-3"
                        value={newEssai.zone ?? ""}
                        onChange={(e) =>
                          setNewEssai((p) => ({ ...p, zone: e.target.value }))
                        }
                        placeholder="Ex: RDC + R+1"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm">Type</Label>
                      <Input
                        className="col-span-3"
                        value={newEssai.type ?? ""}
                        onChange={(e) =>
                          setNewEssai((p) => ({ ...p, type: e.target.value }))
                        }
                        placeholder="Ex: Pression hydraulique"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm">Date prévue</Label>
                      <Input
                        className="col-span-3"
                        value={newEssai.datePrevue ?? ""}
                        onChange={(e) =>
                          setNewEssai((p) => ({
                            ...p,
                            datePrevue: e.target.value,
                          }))
                        }
                        placeholder="JJ/MM/AAAA"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm">Responsable</Label>
                      <Input
                        className="col-span-3"
                        value={newEssai.responsable ?? ""}
                        onChange={(e) =>
                          setNewEssai((p) => ({
                            ...p,
                            responsable: e.target.value,
                          }))
                        }
                        placeholder="Ex: MedFluides"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setNewEssaiOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button onClick={handleAddEssai}>Créer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-semibold">
                        Système
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Zone
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold whitespace-nowrap">
                        Date Prévue
                      </TableHead>
                      <TableHead className="text-xs font-semibold whitespace-nowrap">
                        Date Réelle
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Responsable
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Résultat
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Statut
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {essais.map((essai) => (
                      <TableRow key={essai.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-sm">
                          {essai.systeme}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {essai.zone}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {essai.type}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                          {essai.datePrevue}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                          {essai.dateReelle}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {essai.responsable}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-[180px]">
                          {essai.resultat}
                        </TableCell>
                        <TableCell>
                          <EssaiStatutBadge statut={essai.statut} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary stats */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  Conformes :{" "}
                  <strong>
                    {essais.filter((e) => e.statut === "conforme").length}
                  </strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Non conformes :{" "}
                  <strong>
                    {essais.filter((e) => e.statut === "non_conforme").length}
                  </strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Planifiés :{" "}
                  <strong>
                    {essais.filter((e) => e.statut === "planifie").length}
                  </strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
                  Non planifiés :{" "}
                  <strong>
                    {essais.filter((e) => e.statut === "non_planifie").length}
                  </strong>
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Checklists Locaux ───────────────────────────────── */}
        <TabsContent value="checklists" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Checklists par local</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                {/* Room selector */}
                <div className="md:w-56 shrink-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Sélectionner un local
                  </p>
                  <div className="flex flex-col gap-1">
                    {ROOMS.map((room) => {
                      const items = checklists[room] ?? [];
                      const count = items.filter((i) => i.checked).length;
                      const isSelected = selectedRoom === room;
                      return (
                        <button
                          key={room}
                          onClick={() => setSelectedRoom(room)}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white font-medium"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span>{room}</span>
                          <span
                            className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : count === 15
                                ? "bg-green-100 text-green-700"
                                : count > 0
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {count}/15
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checklist panel */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">
                      {selectedRoom}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {checkedCount} / 15 points validés
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          checklistProgress === 100
                            ? "bg-green-500"
                            : checklistProgress > 0
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                        style={{ width: `${checklistProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {checklistProgress}% complété
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {currentChecklist.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-lg border p-3 transition-colors ${
                          item.checked
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={`check-${selectedRoom}-${item.id}`}
                            checked={item.checked}
                            onChange={() =>
                              toggleChecklistItem(selectedRoom, item.id)
                            }
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={`check-${selectedRoom}-${item.id}`}
                              className={`text-sm cursor-pointer select-none ${
                                item.checked
                                  ? "text-green-800 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              <span className="text-gray-400 text-xs mr-1.5">
                                {String(item.id).padStart(2, "0")}
                              </span>
                              {item.label}
                            </label>
                            {/* Optional comment */}
                            <input
                              type="text"
                              placeholder="Commentaire (optionnel)..."
                              value={item.comment}
                              onChange={(e) =>
                                updateChecklistComment(
                                  selectedRoom,
                                  item.id,
                                  e.target.value
                                )
                              }
                              className="mt-1.5 w-full text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
                            />
                          </div>
                          {item.checked && (
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: DOE ─────────────────────────────────────────────── */}
        <TabsContent value="doe" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                Dossier des Ouvrages Exécutés (DOE)
              </CardTitle>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Reçu :{" "}
                  <strong className="ml-0.5">
                    {DOE_ITEMS.filter((d) => d.statut === "Reçu").length}
                  </strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                  En cours :{" "}
                  <strong className="ml-0.5">
                    {DOE_ITEMS.filter((d) => d.statut === "En cours").length}
                  </strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                  En attente :{" "}
                  <strong className="ml-0.5">
                    {DOE_ITEMS.filter((d) => d.statut === "En attente").length}
                  </strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                  Non remis :{" "}
                  <strong className="ml-0.5">
                    {DOE_ITEMS.filter((d) => d.statut === "Non remis").length}
                  </strong>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Global DOE progress */}
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Documents reçus</span>
                  <span className="font-semibold text-gray-800">
                    {DOE_ITEMS.filter((d) => d.statut === "Reçu").length} /{" "}
                    {DOE_ITEMS.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (DOE_ITEMS.filter((d) => d.statut === "Reçu").length /
                          DOE_ITEMS.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          Document
                        </div>
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Responsable
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Statut
                      </TableHead>
                      <TableHead className="text-xs font-semibold whitespace-nowrap">
                        Date remise prévue
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DOE_ITEMS.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-sm">
                          {item.document}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {item.responsable}
                        </TableCell>
                        <TableCell>
                          <DOEStatutBadge statut={item.statut} />
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                          {item.dateRemise}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
