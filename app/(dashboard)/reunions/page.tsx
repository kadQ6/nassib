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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Calendar,
  List,
  Users,
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  MapPin,
  CalendarDays,
} from "lucide-react";

type DecisionStatus = "En cours" | "En retard" | "Terminé";
type MeetingStatus = "terminée" | "planifiée";
type MeetingType = "Réunion chantier" | "Coordination" | "Technique" | "Réception";

interface Decision {
  desc: string;
  resp: string;
  deadline: string;
  status: DecisionStatus;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  type: MeetingType;
  status: MeetingStatus;
  participants: number;
  actions: number;
  lieu: string;
  agenda: string[];
  decisions: Decision[];
  participantsList: string[];
}

const meetings: Meeting[] = [
  {
    id: 1,
    title: "Réunion hebdomadaire N°24",
    date: "09/06/2026",
    type: "Réunion chantier",
    status: "terminée",
    participants: 8,
    actions: 5,
    lieu: "Salle de réunion chantier",
    agenda: [
      "Avancement travaux gros œuvre",
      "Point CVC et fluides",
      "Sécurité chantier",
      "Divers",
    ],
    decisions: [
      {
        desc: "Accélération coulage dalle R+1",
        resp: "SETAB",
        deadline: "12/06/2026",
        status: "En cours",
      },
      {
        desc: "Validation plans CVC",
        resp: "Architecte",
        deadline: "10/06/2026",
        status: "En retard",
      },
      {
        desc: "Rapport sécurité hebdo",
        resp: "Chef chantier",
        deadline: "13/06/2026",
        status: "En cours",
      },
    ],
    participantsList: [
      "Ahmed Ben Salem",
      "Karim Mansouri",
      "Sofia Larbi",
      "Youcef Benali",
      "Fatima Zohra",
      "Omar Khelif",
      "Nassim Boudali",
      "Rachid Ferhat",
    ],
  },
  {
    id: 2,
    title: "Coordination CVC + Fluides",
    date: "05/06/2026",
    type: "Coordination",
    status: "terminée",
    participants: 5,
    actions: 3,
    lieu: "Bureau technique",
    agenda: [
      "Revue plans CVC",
      "Coordination fluides médicaux",
      "Planning essais",
    ],
    decisions: [
      {
        desc: "Soumission plans exec CVC",
        resp: "ClimaMed",
        deadline: "08/06/2026",
        status: "Terminé",
      },
      {
        desc: "Commande vannes O2",
        resp: "MedFluides",
        deadline: "15/06/2026",
        status: "En cours",
      },
      {
        desc: "Planning essais pneumatiques",
        resp: "ClimaMed",
        deadline: "20/06/2026",
        status: "En cours",
      },
    ],
    participantsList: [
      "Karim Mansouri",
      "Omar Khelif",
      "Nassim Boudali",
      "Mohamed Ait",
      "Sara Benm",
    ],
  },
  {
    id: 3,
    title: "Visite MOA + Architecte",
    date: "28/05/2026",
    type: "Réception",
    status: "terminée",
    participants: 4,
    actions: 4,
    lieu: "Site chantier",
    agenda: ["Tour de site", "Points bloquants", "Décisions MOA"],
    decisions: [
      {
        desc: "Modification cloisons bloc chirurgie",
        resp: "Architecte",
        deadline: "05/06/2026",
        status: "Terminé",
      },
      {
        desc: "Validation échantillons carrelage",
        resp: "MOA",
        deadline: "01/06/2026",
        status: "Terminé",
      },
      {
        desc: "Reprise enduit couloir RDC",
        resp: "SETAB",
        deadline: "10/06/2026",
        status: "En retard",
      },
      {
        desc: "Mise à jour planning général",
        resp: "Chef projet",
        deadline: "03/06/2026",
        status: "Terminé",
      },
    ],
    participantsList: [
      "Ahmed Ben Salem",
      "Sofia Larbi",
      "Youcef Benali",
      "Fatima Zohra",
    ],
  },
  {
    id: 4,
    title: "Réunion hebdomadaire N°25",
    date: "16/06/2026",
    type: "Réunion chantier",
    status: "planifiée",
    participants: 8,
    actions: 0,
    lieu: "Salle de réunion chantier",
    agenda: ["Avancement travaux", "Point sécurité", "Préparation OPR"],
    decisions: [],
    participantsList: [],
  },
  {
    id: 5,
    title: "Préparation OPR",
    date: "30/06/2026",
    type: "Technique",
    status: "planifiée",
    participants: 6,
    actions: 0,
    lieu: "Bureau MOE",
    agenda: [
      "Liste réserves prévisionnelles",
      "Planning OPR",
      "Organisation visites",
    ],
    decisions: [],
    participantsList: [],
  },
];

function getMeetingStatusBadge(status: MeetingStatus) {
  switch (status) {
    case "terminée":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Terminée
        </Badge>
      );
    case "planifiée":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Planifiée
        </Badge>
      );
  }
}

function getDecisionStatusBadge(status: DecisionStatus) {
  switch (status) {
    case "Terminé":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Terminé
        </Badge>
      );
    case "En cours":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          En cours
        </Badge>
      );
    case "En retard":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          En retard
        </Badge>
      );
  }
}

function getMeetingTypeBadge(type: MeetingType) {
  switch (type) {
    case "Réunion chantier":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {type}
        </Badge>
      );
    case "Coordination":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          {type}
        </Badge>
      );
    case "Technique":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          {type}
        </Badge>
      );
    case "Réception":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {type}
        </Badge>
      );
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface NewMeetingForm {
  type: string;
  date: string;
  heure: string;
  lieu: string;
  participants: string;
  agenda: string;
}

function MeetingDetailDialog({ meeting }: { meeting: Meeting }) {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">{meeting.title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Header info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{meeting.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{meeting.lieu}</span>
          </div>
          <div>{getMeetingTypeBadge(meeting.type)}</div>
          <div>{getMeetingStatusBadge(meeting.status)}</div>
        </div>

        {/* Participants */}
        {meeting.participantsList.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Participants ({meeting.participantsList.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {meeting.participantsList.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                    {getInitials(p)}
                  </div>
                  <span className="text-sm text-gray-700">{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Ordre du jour</h3>
          <ol className="space-y-1">
            {meeting.agenda.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-medium mt-0.5">
                  {idx + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* Decisions & Actions */}
        {meeting.decisions.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Décisions &amp; Actions
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Date limite</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meeting.decisions.map((d, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-sm">{d.desc}</TableCell>
                      <TableCell className="text-sm font-medium">{d.resp}</TableCell>
                      <TableCell className="text-sm">{d.deadline}</TableCell>
                      <TableCell>{getDecisionStatusBadge(d.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Export button */}
        <div className="flex justify-end pt-2 border-t">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter CR PDF
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function ReunionsPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [form, setForm] = useState<NewMeetingForm>({
    type: "",
    date: "",
    heure: "",
    lieu: "",
    participants: "",
    agenda: "",
  });

  // Collect all open actions
  const openActions: Array<{
    meetingTitle: string;
    decision: Decision;
  }> = [];
  for (const m of meetings) {
    for (const d of m.decisions) {
      if (d.status === "En cours" || d.status === "En retard") {
        openActions.push({ meetingTitle: m.title, decision: d });
      }
    }
  }

  function handleFormChange(field: keyof NewMeetingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNewMeetingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsNewMeetingOpen(false);
    setForm({
      type: "",
      date: "",
      heure: "",
      lieu: "",
      participants: "",
      agenda: "",
    });
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Réunions de Chantier
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestion des réunions et comptes rendus
          </p>
        </div>
        <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Réunion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvelle Réunion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewMeetingSubmit} className="space-y-4 mt-2">
              <div className="space-y-1">
                <Label htmlFor="type">Type de réunion</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => handleFormChange("type", v)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Réunion chantier">
                      Réunion chantier
                    </SelectItem>
                    <SelectItem value="Coordination">Coordination</SelectItem>
                    <SelectItem value="Technique">Technique</SelectItem>
                    <SelectItem value="Réception">Réception</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => handleFormChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="heure">Heure</Label>
                  <Input
                    id="heure"
                    type="time"
                    value={form.heure}
                    onChange={(e) => handleFormChange("heure", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  id="lieu"
                  placeholder="Ex: Salle de réunion chantier"
                  value={form.lieu}
                  onChange={(e) => handleFormChange("lieu", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="participants">
                  Participants (séparés par des virgules)
                </Label>
                <Input
                  id="participants"
                  placeholder="Ex: Ahmed Ben Salem, Karim Mansouri"
                  value={form.participants}
                  onChange={(e) =>
                    handleFormChange("participants", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="agenda">Ordre du jour</Label>
                <Textarea
                  id="agenda"
                  placeholder="Entrez les points de l'ordre du jour..."
                  rows={4}
                  value={form.agenda}
                  onChange={(e) => handleFormChange("agenda", e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewMeetingOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer la réunion</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">À venir</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Actions en cours</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Actions en retard</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="reunions">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="reunions">Réunions</TabsTrigger>
            <TabsTrigger value="actions">Suivi des Actions</TabsTrigger>
          </TabsList>

          {/* View toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Réunions tab */}
        <TabsContent value="reunions" className="mt-0">
          {viewMode === "list" ? (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <Dialog
                  key={meeting.id}
                  open={selectedMeeting?.id === meeting.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedMeeting(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Date block */}
                            <div className="flex-shrink-0 w-14 text-center">
                              <div className="bg-blue-600 text-white text-xs font-bold rounded-t-md py-1">
                                {meeting.date.split("/")[1]}/
                                {meeting.date.split("/")[2].slice(-2)}
                              </div>
                              <div className="border border-t-0 rounded-b-md py-1">
                                <span className="text-lg font-bold text-gray-800">
                                  {meeting.date.split("/")[0]}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                {getMeetingTypeBadge(meeting.type)}
                              </div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {meeting.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {meeting.lieu}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {meeting.participants} participants
                                </span>
                                {meeting.actions > 0 && (
                                  <span className="flex items-center gap-1">
                                    <CheckSquare className="h-3.5 w-3.5" />
                                    {meeting.actions} actions
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex-shrink-0">
                            {getMeetingStatusBadge(meeting.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  {selectedMeeting?.id === meeting.id && (
                    <MeetingDetailDialog meeting={meeting} />
                  )}
                </Dialog>
              ))}
            </div>
          ) : (
            /* Calendar view - simplified grid */
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Juin 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-xs font-medium text-gray-500 py-1"
                      >
                        {d}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Offset for June 2026 starting on Monday */}
                  {Array.from({ length: 0 }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const dayStr = String(day).padStart(2, "0");
                    const dateStr = `${dayStr}/06/2026`;
                    const dayMeetings = meetings.filter(
                      (m) => m.date === dateStr
                    );
                    return (
                      <div
                        key={day}
                        className={`min-h-[60px] border rounded-md p-1 text-xs ${
                          dayMeetings.length > 0
                            ? "bg-blue-50 border-blue-200"
                            : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            dayMeetings.length > 0
                              ? "text-blue-700"
                              : "text-gray-500"
                          }`}
                        >
                          {day}
                        </span>
                        {dayMeetings.map((m) => (
                          <div
                            key={m.id}
                            className="mt-1 bg-blue-600 text-white rounded px-1 py-0.5 text-[10px] truncate cursor-pointer"
                            onClick={() => setSelectedMeeting(m)}
                          >
                            {m.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                {/* Meeting detail dialog for calendar view */}
                {selectedMeeting && (
                  <Dialog
                    open={!!selectedMeeting}
                    onOpenChange={(open) => {
                      if (!open) setSelectedMeeting(null);
                    }}
                  >
                    <MeetingDetailDialog meeting={selectedMeeting} />
                  </Dialog>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Actions tracker tab */}
        <TabsContent value="actions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Actions ouvertes ({openActions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Réunion</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Date limite</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openActions.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-sm font-medium text-gray-700 max-w-[200px] truncate">
                          {item.meetingTitle}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {item.decision.desc}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {item.decision.resp}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.decision.deadline}
                        </TableCell>
                        <TableCell>
                          {getDecisionStatusBadge(item.decision.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {openActions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-gray-400 py-8"
                        >
                          Aucune action ouverte
                        </TableCell>
                      </TableRow>
                    )}
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
