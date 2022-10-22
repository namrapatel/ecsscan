import { createEntityIndex, getRegistryAddress } from "./helpers";
import { World as mudWorld, Component, getEntityComponents, getComponentEntities } from "@latticexyz/recs";
import { Entity, Rule, Record, World, Provider } from "./types";
import { exec } from "child_process";
import { createProvider, ProviderConfig } from "@latticexyz/network";

export async function buildWorld(mudWorld: mudWorld): Promise<World> {
  console.log("Building World");
  const params = new URLSearchParams(window.location.search);
  const worldAddress = params.get("worldAddress") || "";

  if (worldAddress === "") {
    console.error("worldAddress is empty");
  }

  const providerConfig: ProviderConfig = {
    chainId: 31337,
    jsonRpcUrl: "http://localhost:8545",
  };
  const provider = createProvider(providerConfig);

  let componentRegistryAddress = "";
  await provider.json
    .call({
      to: worldAddress,
      data: "0xba62fbe4", // components()
    })
    .then((result) => {
      // Get last 40 chars of output, which is the address of the registry
      const temp = result.slice(-40);
      componentRegistryAddress = "0x" + temp;
    });

  let systemsRegistryAddress = "";
  await provider.json
    .call({
      to: worldAddress,
      data: "0x0d59332e", // systems()
    })
    .then((result) => {
      // Get last 40 chars of output, which is the address of the registry
      const temp = result.slice(-40);
      systemsRegistryAddress = "0x" + temp;
    });

  const world: World = {
    address: worldAddress,
    entities: [],
    records: [],
    rules: [],
    componentRegistryAddress: componentRegistryAddress,
    systemsRegistryAddress: systemsRegistryAddress,
    mudWorld: mudWorld,
  };

  // Entities
  world.entities = getAllEntities(mudWorld);
  console.log("Logging world:");
  console.log(world);

  // Records
  world.records = await getAllRecords(mudWorld, worldAddress, provider, componentRegistryAddress);
  console.log("Logging world:");
  console.log(world);

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
export async function getAllRecords(
  world: mudWorld,
  worldAddress: string,
  provider: Provider,
  componentRegistryAddress: string
): Promise<Record[]> {
  const mudComponents: Component[] = world.components;
  const records: Record[] = [];

  // Loop through mudComponents and find the Component with id = ComponentsRegistry
  const componentsRegistryComponent = mudComponents.find((component) => component.id === "ComponentsRegistry");
  console.log("componentsRegistryComponent:");
  console.log(componentsRegistryComponent);
  const allComponentAddrs = componentsRegistryComponent ? getComponentEntities(componentsRegistryComponent) : null;
  console.log("All component addresses:");
  console.log(allComponentAddrs);
  if (allComponentAddrs?.return !== undefined) {
    console.log("all components: ");
    console.log(allComponentAddrs.return());
  }

  for (let i = 0; i < mudComponents.length; i++) {
    let ownerAddress = "";
    await provider.json
      .call({
        to: componentRegistryAddress,
        data: "0x8da5cb5b",
      })
      .then((result) => {
        // Get last 40 chars of output, which is the address of the registry
        const temp = result.slice(-40);
        ownerAddress = "0x" + temp;
        console.log("ownerAddress: " + ownerAddress);
      });

    const record: Record = {
      id: mudComponents[i].id,
      address: ownerAddress,
      values: mudComponents[i].values,
      readers: [],
      writers: [],
      creator: "",
      mudComponent: mudComponents[i],
    };
    records.push(record);
  }

  return records;
}

// TODO
export function getAllRules(world: mudWorld): Rule[] {
  const rules: Rule[] = [];
  return rules;
}

export function getRecordReaders(address: string): Rule[] {
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
