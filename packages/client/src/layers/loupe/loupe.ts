import { call, createEntityIndex, getAddressCall } from "./helpers";
import { World as mudWorld, Component, getEntityComponents, getComponentEntities } from "@latticexyz/recs";
import { Entity, Rule, Record, World, Provider } from "./types";
import { createProvider, ProviderConfig } from "@latticexyz/network";
import { BigNumber } from "ethers";
import { AbiCoder, keccak256, Result, hexlify, toUtf8Bytes } from "ethers/lib/utils";

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

  const componentRegistryAddress = await getAddressCall(provider, worldAddress, "0xba62fbe4"); // systems()
  const systemsRegistryAddress = await getAddressCall(provider, worldAddress, "0x0d59332e"); // systems()

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
  const abiCoder = new AbiCoder();

  const encodedComponentAddressesFromChain = await call(provider, componentRegistryAddress, "0x31b933b9"); // componentsRegistry.getEntities();
  const componentsAddressesFromChain: Result = abiCoder.decode(["uint256[]"], encodedComponentAddressesFromChain)[0];

  componentsAddressesFromChain.forEach(async (component: { _hex: string; _isBigNumber: boolean }) => {
    // Get contractId for each component from chain
    const componentIdFromChain = await call(provider, component._hex, "0xaf640d0f"); // id()
    // Get metadata for each component in mudComponents
    for (let i = 0; i < mudComponents.length; i++) {
      const componentIdFromMUD = mudComponents[i].metadata;
      if (componentIdFromMUD !== undefined && typeof componentIdFromMUD.contractId === "string") {
        const componentIdStringFromMUD: string = componentIdFromMUD.contractId;
        const hashedComponentIdFromMUD = keccak256(hexlify(toUtf8Bytes(componentIdStringFromMUD)));
        if (hashedComponentIdFromMUD === componentIdFromChain) {
          console.log("found match");
          console.log(componentIdStringFromMUD);
          console.log(componentIdFromChain);
        }
      }
    }
  });
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
