"use client";

import { useState } from "react";
import {
  Calendar,
  List,
  Plus,
  Users,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  FileDown,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────

type MeetingType = "Réunion chantier" | "Coordination" | "Technique" | "Réception";
type MeetingStatus = "terminée" | "planifiée";
type ActionStatus = "en_cours" | "terminé" | "en_retard";

interface Action {
  id: string;
  desc: string;
  resp: string;
  date: string;
  statut: ActionStatus;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  type: MeetingType;
  status: MeetingStatus;
  participants: string[];
  nbParticipants: number;
  nbActions: number;
  lieu: string;
  animateur: string;
  agenda: string[];
  decisions: string[];
  actions: Action[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MEETINGS: Meeting[] = [
  {
    id: "R24",
    title: "Réunion hebdomadaire N°24",
    date: "09/06/2026",
    type: "Réunion chantier",
    status: "terminée",
    participants: [
      "M. Benali (MOA)",
      "Mme Ouali (Architecte)",
      "M. Hamdani (CVC)",
      "M. Tlemçani (GC)",
      "M. Aïssaoui (CFO)",
      "Mme Karim (CFA)",
      "M. Meziane (PLB)",
      "M. Farid (coord)",
    ],
    nbParticipants: 8,
    nbActions: 4,
    lieu: "Salle de réunion chantier",
    animateur: "M. Farid",
    agenda: [
      "Point avancement par lot",
      "Suivi réserves ouvertes",
      "Approvisionnements en retard",
      "Divers",
    ],
    decisions: [
      "Validation coulage dalle R+1",
      "Relance fournisseur CTA",
      "Blocage faux plafond jusqu'à validation MEP",
    ],
    actions: [
      { id: "A01", desc: "Relance fournisseur CTA", resp: "M. Hamdani", date: "12/06/2026", statut: "en_cours" },
      { id: "A02", desc: "Mise à jour planning GC", resp: "M. Tlemçani", date: "11/06/2026", statut: "terminé" },
      { id: "A03", desc: "Soumettre plans exéc fluides", resp: "M. Benali", date: "15/06/2026", statut: "en_retard" },
      { id: "A04", desc: "CR envoyé à tous", resp: "M. Farid", date: "10/06/2026", statut: "terminé" },
    ],
  },
  {
    id: "R23",
    title: "Coordination CVC + Fluides",
    date: "05/06/2026",
    type: "Coordination",
    status: "terminée",
    participants: [
      "M. Hamdani (CVC)",
      "S. Benali (Fluides)",
      "M. Farid (coord)",
      "Mme Ouali (Architecte)",
      "M. Tlemçani (GC)",
    ],
    nbParticipants: 5,
    nbActions: 3,
    lieu: "Bureau CVC chantier",
    animateur: "M. Hamdani",
    agenda: [
      "Interface CVC/Fluides médicaux",
      "Coordination plafonds",
      "Planning essais",
    ],
    decisions: [
      "Réunion hebdo CVC/Fluides chaque lundi",
      "Plans interfaces à soumettre avant 15/06",
    ],
    actions: [
      { id: "A05", desc: "Plans interface CVC/Fluides", resp: "M. Hamdani", date: "15/06/2026", statut: "en_cours" },
      { id: "A06", desc: "Vérification hauteur faux plafonds R+1", resp: "M. Tlemçani", date: "10/06/2026", statut: "terminé" },
      { id: "A07", desc: "Note technique fluides médicaux", resp: "S. Benali", date: "20/06/2026", statut: "en_retard" },
    ],
  },
  {
    id: "R22",
    title: "Visite MOA + Architecte",
    date: "28/05/2026",
    type: "Réunion chantier",
    status: "terminée",
    participants: [
      "M. Benali (MOA)",
      "Mme Ouali (Architecte)",
      "M. Farid (coord)",
      "M. Tlemçani (GC)",
    ],
    nbParticipants: 4,
    nbActions: 2,
    lieu: "Chantier - Bloc obstétrique",
    animateur: "Mme Ouali",
    agenda: [
      "Visite bloc obstétrique",
      "Points techniques menuiseries",
      "Validation finitions",
    ],
    decisions: [
      "Changement carrelage salle 12",
      "Ajout ventilation WC R+1",
    ],
    actions: [
      { id: "A08", desc: "Devis carrelage alternatif salle 12", resp: "M. Tlemçani", date: "05/06/2026", statut: "terminé" },
      { id: "A09", desc: "Étude ventilation WC R+1", resp: "M. Hamdani", date: "10/06/2026", statut: "terminé" },
    ],
  },
  {
    id: "R25",
    title: "Réunion hebdomadaire N°25",
    date: "16/06/2026",
    type: "Réunion chantier",
    status: "planifiée",
    participants: [],
    nbParticipants: 8,
    nbActions: 0,
    lieu: "Salle de réunion chantier",
    animateur: "M. Farid",
    agenda: [
      "Point avancement par lot",
      "Suivi actions R24",
      "Revue planning",
      "Divers",
    ],
    decisions: [],
    actions: [],
  },
  {
    id: "R_OPR",
    title: "Préparation OPR",
    date: "30/06/2026",
    type: "Technique",
    status: "planifiée",
    participants: [],
    nbParticipants: 6,
    nbActions: 0,
    lieu: "Salle de conférence",
    animateur: "M. Benali",
    agenda: [
      "Liste des OPR à réaliser",
      "Affectation responsabilités",
      "Planning OPR",
    ],
    decisions: [],
    actions: [],
  },
];

// ─── All open actions (statut !== "terminé") ──────────────────────────────────

const ALL_OPEN_ACTIONS: Array<Action & { meetingId: string; meetingTitle: string }> =
  MEETINGS.flatMap((m) =>
    m.actions
      .filter((a) => a.statut !== "terminé")
      .map((a) => ({ ...a, meetingId: m.id, meetingTitle: m.title }))
  );

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";

function getMeetingTypeBadge(type: MeetingType): { variant: BadgeVariant; label: string } {
  const map: Record<MeetingType, { variant: BadgeVariant; label: string }> = {
    "Réunion chantier": { variant: "default", label: "Chantier" },
    Coordination: { variant: "info", label: "Coordination" },
    Technique: { variant: "warning", label: "Technique" },
    Réception: { variant: "secondary", label: "Réception" },
  };
  return map[type];
}

function getStatusBadge(status: MeetingStatus): { variant: BadgeVariant; label: string } {
  if (status === "terminée") return { variant: "success", label: "Terminée" };
  return { variant: "outline", label: "Planifiée" };
}

function getActionStatusBadge(statut: ActionStatus): { variant: BadgeVariant; label: string } {
  if (statut === "terminé") return { variant: "success", label: "Terminé" };
  if (statut === "en_retard") return { variant: "destructive", label: "En retard" };
  return { variant: "info", label: "En cours" };
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon, label, value, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const typeBadge = getMeetingTypeBadge(meeting.type);
  const statusBadge = getStatusBadge(meeting.status);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
          <Badge variant={statusBadge.variant} className="flex items-center gap-1">
            {statusBadge.label === "Terminée" ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {statusBadge.label}
          </Badge>
        </div>
        <span className="text-xs text-slate-400 font-medium">{meeting.id}</span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800 leading-snug">
        {meeting.title}
      </h3>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>{meeting.date}</span>
        <span className="mx-1 text-slate-300">•</span>
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span className="truncate">{meeting.lieu}</span>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          {meeting.nbParticipants} participant{meeting.nbParticipants !== 1 ? "s" : ""}
        </span>
        {meeting.nbActions > 0 && (
          <span className="flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
            {meeting.nbActions} action{meeting.nbActions !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

interface CardViewProps {
  meetings: Meeting[];
  onSelect: (m: Meeting) => void;
}

function CardView({ meetings, onSelect }: CardViewProps) {
  const upcoming = meetings.filter((m) => m.status === "planifiée");
  const past = meetings.filter((m) => m.status === "terminée");

  return (
    <div className="space-y-5">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            À venir
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((m) => (
              <MeetingCard key={m.id} meeting={m} onClick={() => onSelect(m)} />
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Passées
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((m) => (
              <MeetingCard key={m.id} meeting={m} onClick={() => onSelect(m)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ListViewProps {
  meetings: Meeting[];
  onSelect: (m: Meeting) => void;
}

function ListView({ meetings, onSelect }: ListViewProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Réunion
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
              Date
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
              Lieu
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
              Actions
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m, idx) => {
            const typeBadge = getMeetingTypeBadge(m.type);
            const statusBadge = getStatusBadge(m.status);
            return (
              <tr
                key={m.id}
                onClick={() => onSelect(m)}
                className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                  idx !== meetings.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{m.title}</p>
                  <p className="text-xs text-slate-400">{m.id}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                  {m.date}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                  {m.lieu}
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  {m.nbActions > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      {m.nbActions}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadge.variant} className="flex items-center gap-1 w-fit">
                    {statusBadge.label === "Terminée" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {statusBadge.label}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface NewMeetingModalProps {
  open: boolean;
  onClose: () => void;
}

function NewMeetingModal({ open, onClose }: NewMeetingModalProps) {
  const [type, setType] = useState<string>("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [lieu, setLieu] = useState("");
  const [participants, setParticipants] = useState("");
  const [agenda, setAgenda] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setType("");
    setDate("");
    setHeure("");
    setLieu("");
    setParticipants("");
    setAgenda("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle Réunion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="nr-type">Type de réunion</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="nr-type" className="w-full">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Réunion chantier">Réunion chantier</SelectItem>
                <SelectItem value="Coordination">Coordination</SelectItem>
                <SelectItem value="Technique">Technique</SelectItem>
                <SelectItem value="Réception">Réception</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nr-date">Date</Label>
              <input
                id="nr-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nr-heure">Heure</Label>
              <input
                id="nr-heure"
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nr-lieu">Lieu</Label>
            <input
              id="nr-lieu"
              type="text"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              placeholder="Ex: Salle de réunion chantier"
              required
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nr-participants">Participants</Label>
            <Textarea
              id="nr-participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Un participant par ligne"
              rows={3}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nr-agenda">Ordre du jour</Label>
            <Textarea
              id="nr-agenda"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Un point par ligne"
              rows={3}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer la réunion
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DetailModalProps {
  meeting: Meeting | null;
  onClose: () => void;
}

function DetailModal({ meeting, onClose }: DetailModalProps) {
  if (!meeting) return null;

  const typeBadge = getMeetingTypeBadge(meeting.type);
  const statusBadge = getStatusBadge(meeting.status);

  return (
    <Dialog open={!!meeting} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
              <Badge variant={statusBadge.variant} className="flex items-center gap-1">
                {statusBadge.label === "Terminée" ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                {statusBadge.label}
              </Badge>
              <span className="text-xs text-slate-400 ml-auto">{meeting.id}</span>
            </div>
            <DialogTitle className="text-base leading-snug">{meeting.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-3 grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {meeting.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {meeting.lieu}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Animateur : {meeting.animateur}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {meeting.nbParticipants} participants
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-5">
            {/* Participants */}
            {meeting.participants.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Participants
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {meeting.participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback
                          className={`text-xs font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                        >
                          {getInitials(p)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-700">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda */}
            {meeting.agenda.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Ordre du jour
                </h4>
                <ol className="list-decimal list-inside space-y-1">
                  {meeting.agenda.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Decisions */}
            {meeting.decisions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Décisions
                </h4>
                <ul className="space-y-1.5">
                  {meeting.decisions.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions table */}
            {meeting.actions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Actions
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-3 py-2 font-semibold text-slate-500">
                          Description
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-500 hidden sm:table-cell">
                          Responsable
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-500 hidden sm:table-cell">
                          Date limite
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-500">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {meeting.actions.map((action, i) => {
                        const ab = getActionStatusBadge(action.statut);
                        return (
                          <tr
                            key={action.id}
                            className={
                              i !== meeting.actions.length - 1
                                ? "border-b border-slate-100"
                                : ""
                            }
                          >
                            <td className="px-3 py-2 text-slate-700">{action.desc}</td>
                            <td className="px-3 py-2 text-slate-600 hidden sm:table-cell">
                              {action.resp}
                            </td>
                            <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">
                              {action.date}
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant={ab.variant}>{ab.label}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              /* Export CR PDF — no-op */
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Export CR PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReunionsPage() {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Réunions de Chantier</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi des réunions et actions du chantier
          </p>
        </div>
        <button
          onClick={() => setNewMeetingOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Réunion
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<ClipboardList className="w-5 h-5" />}
          label="Total réunions"
          value={18}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="À venir"
          value={3}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Actions en cours"
          value={12}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Actions en retard"
          value={4}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("cards")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            view === "cards"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Vue cartes
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <List className="w-4 h-4" />
          Vue liste
        </button>
      </div>

      {/* Meeting display */}
      {view === "cards" ? (
        <CardView meetings={MEETINGS} onSelect={setSelectedMeeting} />
      ) : (
        <ListView meetings={MEETINGS} onSelect={setSelectedMeeting} />
      )}

      {/* Open actions section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Actions en cours</h2>
          <Badge variant="info">{ALL_OPEN_ACTIONS.length}</Badge>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Réunion
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Responsable
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Date limite
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {ALL_OPEN_ACTIONS.map((action, idx) => {
                const ab = getActionStatusBadge(action.statut);
                return (
                  <tr
                    key={action.id}
                    className={
                      idx !== ALL_OPEN_ACTIONS.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{action.desc}</p>
                      <p className="text-xs text-slate-400">{action.id}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-slate-600">{action.meetingTitle}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                      {action.resp}
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                      {action.date}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ab.variant}>{ab.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {ALL_OPEN_ACTIONS.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-400 text-sm"
                  >
                    Aucune action en cours
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewMeetingModal
        open={newMeetingOpen}
        onClose={() => setNewMeetingOpen(false)}
      />
      <DetailModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  );
}
