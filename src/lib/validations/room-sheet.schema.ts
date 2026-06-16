import { z } from "zod";

const editableNumber = z.union([
  z.number(),
  z.object({
    value: z.number(),
    source: z.enum(["plan", "calculated", "manual", "pending"]).optional(),
    notes: z.string().optional(),
  }),
]);

const finishSpec = z.object({
  material: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  reference: z.string().optional(),
  supplier: z.string().optional(),
  finishType: z.string().optional(),
  notes: z.string().optional(),
});

const openingSpec = z.object({
  id: z.string(),
  type: z.enum(["door", "window", "sliding_door", "passage"]),
  label: z.string(),
  widthMm: z.number(),
  heightMm: z.number(),
  leafColor: z.string().optional(),
  frameColor: z.string().optional(),
  glassType: z.string().optional(),
  fireRating: z.string().optional(),
  openingDirection: z.string().optional(),
  notes: z.string().optional(),
});

export const updateRoomSheetSchema = z.object({
  roomId: z.string().min(1),
  patch: z.object({
    surfaces: z
      .object({
        floorAreaM2: editableNumber.optional(),
        ceilingHeightM: editableNumber.optional(),
        volumeM3: editableNumber.optional(),
        perimeterM: editableNumber.optional(),
      })
      .optional(),
    finishes: z
      .object({
        walls: finishSpec.optional(),
        floor: finishSpec.optional(),
        ceiling: finishSpec.optional(),
        skirting: finishSpec.optional(),
      })
      .optional(),
    openings: z.array(openingSpec).optional(),
    cfo: z
      .object({
        sockets16A: editableNumber.optional(),
        sockets32A: editableNumber.optional(),
        socketsDedicated: editableNumber.optional(),
        lightingPoints: editableNumber.optional(),
        emergencyLighting: editableNumber.optional(),
        earthPoints: editableNumber.optional(),
        ipRating: z.string().optional(),
        notes: z.string().optional(),
      })
      .optional(),
    cfa: z
      .object({
        rj45: editableNumber.optional(),
        wifiAccessPoints: editableNumber.optional(),
        intercom: editableNumber.optional(),
        nurseCall: editableNumber.optional(),
        cctv: editableNumber.optional(),
        accessControl: editableNumber.optional(),
        tvOutlet: editableNumber.optional(),
        notes: z.string().optional(),
      })
      .optional(),
    plumbing: z
      .object({
        coldWater: z.boolean().optional(),
        hotWater: z.boolean().optional(),
        treatedWater: z.boolean().optional(),
        softWater: z.boolean().optional(),
        floorDrains: editableNumber.optional(),
        euPoints: editableNumber.optional(),
        evPoints: editableNumber.optional(),
        medicalWaste: z.boolean().optional(),
        notes: z.string().optional(),
      })
      .optional(),
    ventilation: z
      .object({
        occupancyMax: editableNumber.optional(),
        occupancyBasis: z.string().optional(),
        airChangesPerHourRequired: editableNumber.optional(),
        airChangesPerHourDesigned: editableNumber.optional(),
        flowM3hRequired: editableNumber.optional(),
        flowM3hDesigned: editableNumber.optional(),
        pressureDifferentialPa: editableNumber.optional(),
        temperatureSetpointC: editableNumber.optional(),
        humidityPct: editableNumber.optional(),
        filtration: z.string().optional(),
        normReference: z.string().optional(),
        calculationNotes: z.string().optional(),
      })
      .optional(),
    climate: z
      .object({
        coolingRequired: z.boolean().optional(),
        coolingKw: editableNumber.optional(),
        heatingKw: editableNumber.optional(),
        splitUnits: editableNumber.optional(),
        ctaZone: z.string().optional(),
        refrigerant: z.string().optional(),
        notes: z.string().optional(),
      })
      .optional(),
    medicalGas: z
      .object({
        o2Outlets: editableNumber.optional(),
        vacuumOutlets: editableNumber.optional(),
        medicalAirOutlets: editableNumber.optional(),
        agss: editableNumber.optional(),
        notes: z.string().optional(),
      })
      .optional(),
    customNotes: z.string().optional(),
  }),
});

export type UpdateRoomSheetInput = z.infer<typeof updateRoomSheetSchema>;
