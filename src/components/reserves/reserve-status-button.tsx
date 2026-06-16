"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReserveStatusAction } from "@/app/actions/reserves";
import { Badge } from "@/components/ui/badge";

const NEXT_STATUS: Record<string, string> = {
  open: "in_progress",
  in_progress: "corrected",
  corrected: "closed",
};

export function ReserveStatusButton({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const next = NEXT_STATUS[status];

  if (!next) return <Badge variant="success">{status}</Badge>;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await updateReserveStatusAction(id, next);
          if (result.ok) router.refresh();
        })
      }
      className="rounded-md bg-[#003F72] px-2 py-1 text-xs text-white hover:bg-[#002952] disabled:opacity-50"
    >
      {pending ? "..." : `→ ${next}`}
    </button>
  );
}
