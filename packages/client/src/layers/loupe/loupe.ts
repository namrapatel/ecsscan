import { createEntityIndex } from "./helpers";
import { Entity, Rule, Record, World } from "./types";
import { World as mudWorld, Component, getEntityComponents, getComponentEntities } from "@latticexyz/recs";
import { exec } from "node:child_process";

getRecordReaders();

export function buildWorld(mudWorld: mudWorld): World {
  const world: World = {
    entities: [],
    records: [],
    rules: [],
    mudWorld: mudWorld,
  };

  // Entities
  world.entities = getAllEntities(mudWorld);

  // Records

  // Rules

  return world;
}

export function getAllEntities(world: mudWorld): Entity[] {
  const entities: Entity[] = [];

  for (let i = 0; i < world.entities.length; i++) {
    entities[i].id = world.entities[i];

    const index = world.entityToIndex.get(world.entities[i]);
    const indexNumber = index?.valueOf() as number;
    entities[i].mudEntityIndex = createEntityIndex(indexNumber);

    entities[i].mudComponents = getEntityComponents(world, entities[i].mudEntityIndex);

    // TODO: Incomplete, add readers, writers, and creators when they are implemented
    for (let j = 0; j < entities[i].mudComponents.length; j++) {
      const record: Record = {
        id: entities[i].mudComponents[j].id,
        values: entities[i].mudComponents[j].values,
        readers: [],
        writers: [],
        creator: "",
        mudComponent: entities[i].mudComponents[j],
      };
      entities[i].records.push(record);
    }
  }

  return entities;
}

// TODO: update to return Record type
export function getAllRecords(world: mudWorld): Component[] {
  return world.components;
}

// TODO
export function getAllRules(world: mudWorld): Rule[] {
  const rules: Rule[] = [];

  return rules;
}

export function getRecordReaders(): Rule[] {
  // run the `ls` command using exec
  exec("cd && ls", (err, output) => {
    // once the command has completed, the callback function is called
    if (err) {
      // log and return if we encounter an error
      console.error("could not execute command: ", err);
      return;
    }
    // log the output received from the command
    console.log("Output: \n", output);
  });

  const rules: Rule[] = [];
  return rules;
}

export function getRecordsByEntity(entity: Entity): Record[] {
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
