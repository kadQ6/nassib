"use client";

import { useState, useTransition } from "react";
import { updateRoomMetaAction } from "@/app/actions/room-meta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RoomHub } from "@/types/room-hub";

export function RoomNameEditor({ hub }: { hub: RoomHub }) {
  const [name, setName] = useState(hub.room.name);
  const [role, setRole] = useState(hub.profile.functionalRole);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updateRoomMetaAction({
        roomId: hub.room.id,
        name,
        functionalRole: role,
      });
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-[#0891B2]">{hub.room.code}</span>
        <span className="text-lg font-semibold text-[#003F72]">{name}</span>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          Modifier le nom
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-[#0891B2]/30 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        Code plan (non modifiable) : <strong>{hub.room.code}</strong>
      </p>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du local" />
      <Input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Rôle fonctionnel"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={pending}>
          Enregistrer
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
