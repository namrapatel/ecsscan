import { Entity, Record, World } from "../../loupe/types";
import { Action1 } from "../types";
import { checkIfActionExists, getRecordRequirementsByAction } from "./contextAdders";

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

export function determineStatusOfActionByEntity(actions: Action1[], entity: Entity): Action1[] {
  for (let i = 0; i < actions.length; i++) {
    const requiredRecords = actions[i].requiredRecords;
    let hasAllRequiredRecords = true;
    let hasAllAwardedRecords = true;
    for (let j = 0; j < requiredRecords.length; j++) {
      if (!requiredRecords[j].ownedByEntity) {
        hasAllRequiredRecords = false;
      }
    }
    for (let k = 0; k < entity.records.length; k++) {
      if (entity.records[k].id !== actions[i].id) {
        hasAllAwardedRecords = false;
      }
    }
    if (hasAllRequiredRecords && !hasAllAwardedRecords) {
      actions[i].status = 2; // Unlocked
    } else if (!hasAllRequiredRecords && !hasAllAwardedRecords) {
      actions[i].status = 1; // Locked
    } else if (hasAllRequiredRecords && hasAllAwardedRecords) {
      actions[i].status = 3; // Completed
    }
  }
  return actions;
}

// export function findActionsRequiringGivenRecords(records: Record2[]): Action2[]
