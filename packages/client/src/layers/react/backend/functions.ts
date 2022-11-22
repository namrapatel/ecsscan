import { Entity, Record, World } from "../../loupe/types";
import { Record1, Action1 } from "../types";

// Create and return a list of Actions that individually return one or more of the Records given in params.
export function findActionsThatAwardRecords(world: World, desiredRecords: Record[], relevantEntity: Entity): Action1[] {
  const actions: Action1[] = [];

  for (let i = 0; i < desiredRecords.length; i++) {
    for (let j = 0; j < desiredRecords.length; j++) {
      const existingActionIndex = checkIfActionExists(actions, desiredRecords[i].writers[j].id);
      // If the action already exists in the list, add the record to the list of records it awards
      // else, create a new action and add it to the list of actions
      if (existingActionIndex !== null) {
        const tempRecords = actions[existingActionIndex].awardsRecords;
        tempRecords.push(desiredRecords[i]);
        actions[existingActionIndex].awardsRecords = tempRecords;
      } else {
        const awardedRecordsArr: Record[] = [];
        awardedRecordsArr.push(desiredRecords[i]);
        actions.push({
          id: desiredRecords[i].writers[j].id,
          address: desiredRecords[i].writers[j].address,
          requiredRecords: getRecordRequirementsByAction(world, desiredRecords[i].writers[j].id, relevantEntity),
          awardsRecords: awardedRecordsArr,
          status: 0,
        });
      }
    }
  }
  return actions;
}

function checkIfActionExists(actionsList: Action1[], id: string): number | null {
  for (let i = 0; i < actionsList.length; i++) {
    if (actionsList[i].id === id) {
      return i;
    }
  }
  return null;
}

function getRecordRequirementsByAction(world: World, actionId: string, entity: Entity): Record1[] {
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

function getFullRecord(recordId: string, allRecords: Record[]): Record {
  for (let i = 0; i < allRecords.length; i++) {
    if (allRecords[i].id === recordId) {
      return allRecords[i];
    }
  }
  throw new Error("Record not found");
}

function determineIfEntityHasRecord(entity: Entity, recordId: string): boolean {
  for (let i = 0; i < entity.records.length; i++) {
    if (entity.records[i].id === recordId) {
      return true;
    }
  }
  return false;
}

// A function that determines whether each Action in an array of actions is Locked or Unlocked
// based on the Records that the Action requires and the Records that the Entity has.
// export function determineStatusOfActionByEntity(actions: Action1[], entity: Entity): Action1[] {}

// export function findActionsRequiringGivenRecords(records: Record2[]): Action2[]
