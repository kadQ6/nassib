"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createReserveAction, type ActionResult } from "@/app/actions/reserves";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initial: ActionResult = { ok: true, message: "" };

export function ReserveForm({
  roomOptions,
  lotOptions,
}: {
  roomOptions: { code: string; name: string }[];
  lotOptions: { code: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) =>
      createReserveAction(formData),
    initial,
  );
  const router = useRouter();
  const fieldErrors = !state.ok ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state.ok && state.message.includes("créée")) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle réserve</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" required placeholder="Description courte" />
            {fieldErrors?.title && (
              <p className="text-xs text-red-600">{fieldErrors.title[0]}</p>
            )}
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomCode">Local</Label>
            <select
              id="roomCode"
              name="roomCode"
              className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
            >
              <option value="">—</option>
              {roomOptions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.code} — {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Input id="zone" name="zone" required placeholder="Bloc césarienne" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lotCode">Lot</Label>
            <select
              id="lotCode"
              name="lotCode"
              required
              className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
            >
              {lotOptions.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.code} — {l.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input id="company" name="company" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity">Gravité</Label>
            <select
              id="severity"
              name="severity"
              required
              className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
            >
              <option value="minor">Mineure</option>
              <option value="major">Majeure</option>
              <option value="critical">Critique</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" required placeholder="technique" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Responsable correction</Label>
            <Input id="assignedTo" name="assignedTo" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Échéance</Label>
            <Input id="dueDate" name="dueDate" type="date" required />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="correctiveAction">Action corrective</Label>
            <Input id="correctiveAction" name="correctiveAction" required />
          </div>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="blocksReception" className="accent-[#0891B2]" />
            Bloque la réception
          </label>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Créer la réserve"}
            </Button>
            {state.message && (
              <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-red-600"}`}>
                {state.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
