import type { ProgrammeContext } from "@/types/programme";
import type { NassibBundle } from "@/types/nassib";
import { NASSIB_VALIDATED_BASELINE } from "./baseline";
import { NASSIB_ROOM_DISPATCH } from "./dispatch";
import { deriveProgramme } from "./derive-engine";
import { buildEquipmentSchema, appendTechnicalPlanSlots } from "./equipment-schema";

export function buildProgrammeContext(state: NassibBundle): ProgrammeContext {
  const baseline = structuredClone(NASSIB_VALIDATED_BASELINE);
  const equipmentSlots = appendTechnicalPlanSlots(
    buildEquipmentSchema(state.equipment),
  );
  baseline.equipmentSchema.slotCount = equipmentSlots.length;
  baseline.boq.lineCount = state.boq.length;
  baseline.boq.totalAmount = state.project.contractAmount;
  baseline.dispatch.roomCount = NASSIB_ROOM_DISPATCH.length;

  const derivation = deriveProgramme({
    baseline,
    dispatches: NASSIB_ROOM_DISPATCH,
    equipmentSlots,
    equipment: state.equipment,
    procurement: state.procurement,
  });

  return {
    baseline,
    dispatches: NASSIB_ROOM_DISPATCH,
    equipmentSlots,
    derivation,
  };
}

export { NASSIB_ROOM_DISPATCH, NASSIB_VALIDATED_BASELINE };
export { deriveProgramme } from "./derive-engine";
export { buildEquipmentSchema } from "./equipment-schema";
