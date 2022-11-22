import { Entity, Record, World } from "../../loupe/types";
import { Record1, Action1 } from "../types";

export function checkIfActionExists(actionsList: Action1[], id: string): number | null {
  for (let i = 0; i < actionsList.length; i++) {
    if (actionsList[i].id === id) {
      return i;
    }
  }
  return null;
}

export function getRecordRequirementsByAction(world: World, actionId: string, entity: Entity): Record1[] {
  const allActions = world.rules;
  const requiredRecords: Record1[] = [];
  for (let i = 0; i < allActions.length; i++) {
    if (allActions[i].id === actionId) {
      for (let j = 0; j < allActions[i].readsRecords.length; j++) {
        const fullRecord = getFullRecord(allActions[i].readsRecords[j].id, world.records);
        requiredRecords.push({
          ...fullRecord,
          ownedByEntity: determineIfEntityHasRecord(entity, fullRecord.id),
        });
      }
    }
  }
  return requiredRecords;
}

export function getFullRecord(recordId: string, allRecords: Record[]): Record {
  for (let i = 0; i < allRecords.length; i++) {
    if (allRecords[i].id === recordId) {
      return allRecords[i];
    }
  }
  throw new Error("Record not found");
}

export function determineIfEntityHasRecord(entity: Entity, recordId: string): boolean {
  for (let i = 0; i < entity.records.length; i++) {
    if (entity.records[i].id === recordId) {
      return true;
    }
  }
  return false;
}
