import { Entity, Record } from "../loupe/types";

export type Persona = {
  signer: Entity;
  entityPerspective: Entity;
};

export type Record1 = Record & { ownedByEntity: boolean };

export type Action1 = {
  id: string;
  address: string;
  requiredRecords: Record1[]; // Records that are required to perform this action
  awardsRecords: Record[]; // Records read by this Action
  status: number; // (0, 1, 2, or 3 depending on undefined, locked, unlocked, completed)
};
