import { Record } from "../../loupe/types";

export type Action1 = {
  id: string;
  address: string;
  awardsRecords: Record[]; // Records read by this Action
  status: number; // (0, 1, 2, or 3 depending on undefined, locked, unlocked, or complete)
};

// export type Record2 = {}
// export type Action2 = {}

export function findActionsThatAwardRecords(records: Record[]): Action1[] {
  const actions: Action1[] = [];

  for (let i = 0; i < records.length; i++) {
    for (let j = 0; j < records.length; j++) {
      const existingActionIndex = checkIfActionExists(actions, records[i].writers[j].id);
      if (existingActionIndex !== null) {
        const tempRecords = actions[existingActionIndex].awardsRecords;
        tempRecords.push(records[i]);
        actions[existingActionIndex].awardsRecords = tempRecords;
      } else {
        const initialRecords: Record[] = [];
        initialRecords.push(records[i]);
        actions.push({
          id: records[i].writers[j].id,
          address: records[i].writers[j].address,
          awardsRecords: initialRecords,
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

// export function findActionsRequiringGivenRecords(records: Record2[]): Action2[]
