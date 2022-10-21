import { World, Component, getEntityComponents, getComponentEntities } from "@latticexyz/recs";
import { Entity, Rule } from "./types";
import { createEntityIndex } from "./helpers";

export function getAllEntities(world: World): Entity[] {
  const entities: Entity[] = [];

  for (let i = 0; i < world.entities.length; i++) {
    entities[i].id = world.entities[i];

    const index = world.entityToIndex.get(world.entities[i]);
    const indexNumber = index?.valueOf() as number;
    entities[i].mudEntityIndex = createEntityIndex(indexNumber);

    entities[i].records = getEntityComponents(world, entities[i].mudEntityIndex);
  }

  return entities;
}

export function getAllRecords(world: World): Component[] {
  return world.components;
}

// TODO
export function getAllRules(world: World): Rule[] {
  const rules: Rule[] = [];

  return rules;
}

export function getRecordsByEntity(entity: Entity) {
  return entity.records;
}

// TODO
export function getRulesByRecord(record: Component): Rule[] {
  const rules: Rule[] = [];

  return rules;
}

// TODO
export function getRecordsByRule(): Component[] {
  const records: Component[] = [];

  return records;
}

// TODO: Return the real Entity type
export function getEntitiesByRecord(record: Component) {
  return getComponentEntities(record);
}
