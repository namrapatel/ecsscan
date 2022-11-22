import { Entity, Record } from "../loupe/types";

export type Persona = {
  signer: Entity;
  entityPerspective: Entity;
};

export type ContextualRecord = Record & { ownedByEntity: boolean };

export type ContextualAction = {
  id: string;
  address: string;
  requiredRecords: ContextualRecord[]; // Records that are required to perform this action
  awardsRecords: Record[]; // Records read by this Action
  status: number; // (0, 1, 2, or 3 depending on undefined, locked, unlocked, completed)
};
