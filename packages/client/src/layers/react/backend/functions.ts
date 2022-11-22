import { Entity, Record, World } from "../../loupe/types";
import { ContextualAction } from "../types";
import { checkIfActionExists, getRecordRequirementsByAction, getRecordsAwardedByAction } from "./contextAdders";

// Create and return a list of Actions that individually return one or more of the Records given in params.
export function findActionsThatAwardRecords(
  world: World,
  desiredRecords: Record[],
  relevantEntity: Entity
): ContextualAction[] {
  const actions: ContextualAction[] = [];

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

export function determineStatusOfActionByEntity(actions: ContextualAction[], entity: Entity): ContextualAction[] {
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

export function findActionsRequiringGivenRecords(world: World, records: Record[]): ContextualAction[] {
  const allActions = world.rules;
  const actionsThatRequireRecords: ContextualAction[] = [];

  for (let i = 0; i < allActions.length; i++) {
    for (let j = 0; j < allActions[i].readsRecords.length; j++) {
      for (let k = 0; k < records.length; k++) {
        if (allActions[i].readsRecords[j].id === records[k].id) {
          actionsThatRequireRecords.push({
            id: allActions[i].id,
            address: allActions[i].address,
            requiredRecords: getRecordRequirementsByAction(world, allActions[i].id, world.entities[0]),
            awardsRecords: getRecordsAwardedByAction(world, allActions[i].id),
            status: 0,
          });
        }
      }
    }
  }
  return actionsThatRequireRecords;
}
