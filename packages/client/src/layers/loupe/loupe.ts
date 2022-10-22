import { createEntityIndex, getRegistryAddress } from "./helpers";
import { World as mudWorld, Component, getEntityComponents, getComponentEntities, Layers } from "@latticexyz/recs";
import { Entity, Rule, Record, World } from "./types";
import { exec } from "child_process";

export function buildWorld(mudWorld: mudWorld): World {
  console.log("Building World");
  const params = new URLSearchParams(window.location.search);
  const worldAddress = params.get("worldAddress") || "";

  if (worldAddress === "") {
    console.error("worldAddress is empty");
  }

  const world: World = {
    address: worldAddress,
    entities: [],
    records: [],
    rules: [],
    componentRegistryAddress: "",
    systemsRegistryAddress: "",
    // componentRegistryAddress: getRegistryAddress(worldAddress, "components()"),
    // systemsRegistryAddress: getRegistryAddress(worldAddress, "systems()"),
    mudWorld: mudWorld,
  };

  // Entities
  world.entities = getAllEntities(mudWorld);
  console.log(world);

  // Records
  world.records = getAllRecords(mudWorld, worldAddress);

  // Rules
  world.rules = getAllRules(mudWorld);

  return world;
}

// WIP
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
        address: "",
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

// WIP
export function getAllRecords(world: mudWorld, worldAddress: string): Record[] {
  const mudComponents: Component[] = world.components;
  const records: Record[] = [];

  console.log(mudComponents);
  // TODO: Get components from componentregistry address
  // for each component, get address, readers, writers, creator

  for (let i = 0; i < mudComponents.length; i++) {
    records[i].id = mudComponents[i].id;
    records[i].address = "";
    records[i].values = mudComponents[i].values;
    records[i].readers = getRecordReaders(records[i].address);
    records[i].writers = getRecordWriters(records[i].address);
    records[i].creator = "";
    records[i].mudComponent = mudComponents[i];
  }

  return records;
}

// TODO
export function getAllRules(world: mudWorld): Rule[] {
  const rules: Rule[] = [];

  return rules;
}

export function getRecordReaders(address: string): Rule[] {
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

export function getRecordWriters(address: string): Rule[] {
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
