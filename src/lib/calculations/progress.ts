export interface WeightedProgressItem {
  progressPct: number;
  weight: number;
}

export function weightedAverage(items: WeightedProgressItem[]): number {
  if (items.length === 0) return 0;
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = items.reduce(
    (sum, item) => sum + item.progressPct * item.weight,
    0,
  );
  return Math.round((weighted / totalWeight) * 10) / 10;
}

export function checklistCompletion(done: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((done / total) * 1000) / 10;
}

export function ratioProgress(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export function reserveClosureRate(closed: number, total: number): number {
  return ratioProgress(closed, total);
}

export interface LotProgressInput {
  wbsProgress: number;
  roomProgress: number;
  boqProgress: number;
  reserveClosureRate: number;
}

export function calculateLotProgress(input: LotProgressInput): number {
  return weightedAverage([
    { progressPct: input.wbsProgress, weight: 0.4 },
    { progressPct: input.roomProgress, weight: 0.3 },
    { progressPct: input.boqProgress, weight: 0.2 },
    { progressPct: input.reserveClosureRate, weight: 0.1 },
  ]);
}

export interface RoomProgressInput {
  checklistDone: number;
  checklistTotal: number;
  equipmentInstalled: number;
  equipmentPlanned: number;
  reservesClosed: number;
  reservesTotal: number;
}

export function calculateRoomProgress(input: RoomProgressInput): number {
  return weightedAverage([
    {
      progressPct: checklistCompletion(input.checklistDone, input.checklistTotal),
      weight: 0.5,
    },
    {
      progressPct: ratioProgress(
        input.equipmentInstalled,
        input.equipmentPlanned,
      ),
      weight: 0.3,
    },
    {
      progressPct: reserveClosureRate(input.reservesClosed, input.reservesTotal),
      weight: 0.2,
    },
  ]);
}

export interface ProjectLotInput {
  id: string;
  contractAmount: number;
  progressPct: number;
}

export function calculateProjectProgress(lots: ProjectLotInput[]): number {
  if (lots.length === 0) return 0;
  const totalAmount = lots.reduce((sum, lot) => sum + lot.contractAmount, 0);
  return weightedAverage(
    lots.map((lot) => ({
      progressPct: lot.progressPct,
      weight: totalAmount > 0 ? lot.contractAmount : 1,
    })),
  );
}

export function calculateBoqItemProgress(
  qtyExecuted: number,
  qtyContract: number,
): number {
  return ratioProgress(qtyExecuted, qtyContract);
}
