import { resolveImplementationPlanImage } from "@/lib/room-sheet/implementation-plan-images";

export function ImplementationPlanImage({
  roomCode,
  compact = false,
  printMode = false,
  className = "",
}: {
  roomCode: string;
  compact?: boolean;
  printMode?: boolean;
  className?: string;
}) {
  const plan = resolveImplementationPlanImage(roomCode);
  if (!plan) return null;

  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plan.src}
        alt={plan.alt}
        loading="eager"
        decoding="async"
        className={
          printMode
            ? "h-auto w-full max-h-[105mm] object-contain"
            : compact
              ? "h-auto w-full object-contain object-left-top"
              : "h-auto max-h-[320px] w-full object-contain object-left-top"
        }
      />
    </div>
  );
}

export function RoomImplementationPlan({
  roomCode,
  roomName,
  compact = false,
}: {
  roomCode: string;
  roomName: string;
  compact?: boolean;
}) {
  const plan = resolveImplementationPlanImage(roomCode);
  if (!plan) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-[#003F72]">
        Plan d&apos;implantation — {plan.title}
      </p>
      <p className="text-xs text-slate-500">
        {roomName} · Référence K&apos;BIO plans équipements 180526
      </p>
      <ImplementationPlanImage roomCode={roomCode} compact={compact} className="mt-2 min-h-[140px]" />
    </div>
  );
}
