import { Entity, Record, World } from "../../loupe/types";
import { ContextualRecord, ContextualAction } from "../types";

export function checkIfActionExists(actionsList: ContextualAction[], id: string): number | null {
  for (let i = 0; i < actionsList.length; i++) {
    if (actionsList[i].id === id) {
      return i;
    }
  }
  return null;
}

export function getRecordRequirementsByAction(world: World, actionId: string, entity: Entity): ContextualRecord[] {
  const allActions = world.rules;
  const requiredRecords: ContextualRecord[] = [];
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

export function getRecordsAwardedByAction(world: World, actionId: string): Record[] {
  const allActions = world.rules;
  const awardedRecords: Record[] = [];
  for (let i = 0; i < allActions.length; i++) {
    if (allActions[i].id === actionId) {
      for (let j = 0; j < allActions[i].writesRecords.length; j++) {
        const fullRecord = getFullRecord(allActions[i].writesRecords[j].id, world.records);
        awardedRecords.push(fullRecord);
      }
    }
  }
  return awardedRecords;
}
